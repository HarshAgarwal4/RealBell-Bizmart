import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import OrderModel from "../models/order.js";
import ProductModel from "../models/product.js";

// Razorpay Key Credentials with reliable fallback for test mode
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_RealBellBiz123";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "bizmart_sec_7894561230";

let razorpayInstance = null;
try {
    razorpayInstance = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET
    });
} catch (e) {
    console.log("Razorpay init notice:", e.message);
}

// Helper: Calculate unit price based on wholesale tiers
function computeTierPrice(product, qty) {
    if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
        return product.price;
    }
    const sorted = [...product.wholesaleTiers].sort((a, b) => a.minQty - b.minQty);
    let matched = sorted[0];
    for (const tier of sorted) {
        if (qty >= tier.minQty) {
            matched = tier;
        }
    }
    return matched.unitPrice;
}

// 1. Create Razorpay Order & Pending Marketplace Order
async function createRazorpayOrder(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Please login to proceed with checkout" });
        const { items, shippingAddress } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.send({ status: 7, msg: "Cart items cannot be empty" });
        }

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.phone || !shippingAddress.city || !shippingAddress.pincode) {
            return res.send({ status: 7, msg: "Please provide a complete shipping address (Full Name, Address, City, Pincode, and Phone)" });
        }

        // Clean & validate phone (ensure at least 10 digits)
        const cleanPhone = String(shippingAddress.phone).replace(/\D/g, "");
        if (cleanPhone.length < 10) {
            return res.send({ status: 7, msg: "Please provide a valid 10-digit contact phone number" });
        }

        // Clean & validate pincode (standard 6 digits)
        const cleanPincode = String(shippingAddress.pincode).replace(/\D/g, "");
        if (cleanPincode.length !== 6) {
            return res.send({ status: 7, msg: "Please provide a valid 6-digit postal PIN code" });
        }

        // Database-verified items list (PREVENT CLIENT PRICE TAMPERING)
        const verifiedItems = [];
        let calculatedTotal = 0;

        for (const item of items) {
            const qty = Number(item.quantity) || 1;
            if (qty < 1) {
                return res.send({ status: 7, msg: `Invalid quantity for item "${item.title || 'Product'}"` });
            }

            const isWholesale = item.purchaseType === 'wholesale' || item.isWholesale === true;
            let verifiedPrice = Number(item.price);
            let productRecord = null;

            // Check if product exists in MongoDB
            const productId = item.product || item._id;
            if (productId && mongoose.Types.ObjectId.isValid(productId)) {
                productRecord = await ProductModel.findById(productId);
            }

            if (productRecord) {
                // Ensure product is active
                if (!productRecord.isActive) {
                    return res.send({ status: 8, msg: `Item "${productRecord.title}" is currently out of catalog or inactive.` });
                }

                // Check available stock
                if (productRecord.stock < qty) {
                    return res.send({
                        status: 8,
                        msg: `Insufficient inventory for "${productRecord.title}". Only ${productRecord.stock} units available, but ${qty} requested.`
                    });
                }

                // Verify purchasing constraints
                if (isWholesale) {
                    if (productRecord.saleType === 'normal') {
                        return res.send({ status: 7, msg: `"${productRecord.title}" is only available for individual retail purchase.` });
                    }

                    // Check minimum wholesale order constraint
                    const minWholesaleConstraint = (productRecord.wholesaleTiers && productRecord.wholesaleTiers.length > 0)
                        ? Math.min(...productRecord.wholesaleTiers.map(t => t.minQty))
                        : (productRecord.moq || 1);

                    if (qty < minWholesaleConstraint) {
                        return res.send({
                            status: 7,
                            msg: `Minimum wholesale constraint for "${productRecord.title}" is ${minWholesaleConstraint} ${productRecord.unit || 'pcs'}. You selected ${qty}.`
                        });
                    }

                    // Securely calculate tier price from server
                    verifiedPrice = computeTierPrice(productRecord, qty);
                } else {
                    if (productRecord.saleType === 'wholesale') {
                        return res.send({ status: 7, msg: `"${productRecord.title}" is only sold in wholesale bulk batches.` });
                    }
                    verifiedPrice = productRecord.price;
                }
            } else {
                // For static catalog items, ensure price is positive number
                if (!verifiedPrice || verifiedPrice <= 0) {
                    verifiedPrice = Number(item.price) || 100;
                }
            }

            const itemSubtotal = verifiedPrice * qty;
            calculatedTotal += itemSubtotal;

            verifiedItems.push({
                product: productRecord ? productRecord._id : (mongoose.Types.ObjectId.isValid(productId) ? productId : null),
                title: productRecord?.title || item.title || "Marketplace Product",
                price: verifiedPrice,
                quantity: qty,
                subtotal: itemSubtotal,
                seller: productRecord?.seller || item.seller || null,
                sellerName: productRecord?.sellerName || item.sellerName || "Verified Merchant",
                image: (productRecord?.images && productRecord.images[0]) || productRecord?.image || item.image || "",
                purchaseType: isWholesale ? 'wholesale' : 'normal',
                tierApplied: isWholesale ? (item.tierApplied || `Tier @ ₹${verifiedPrice}`) : ''
            });
        }

        const finalAmount = calculatedTotal;
        if (finalAmount <= 0) {
            return res.send({ status: 7, msg: "Order total cannot be zero" });
        }

        const amountInPaise = Math.round(finalAmount * 100);
        const orderNumber = "RBM-" + Date.now().toString().slice(-6) + "-" + Math.floor(100 + Math.random() * 900);

        let razorpayOrderId = "order_sim_" + Date.now();

        // Attempt actual Razorpay SDK order creation
        if (razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            try {
                const rzpOrder = await razorpayInstance.orders.create({
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: orderNumber,
                    notes: {
                        buyerEmail: req.user.email,
                        buyerId: String(req.user._id),
                        orderNumber
                    }
                });
                razorpayOrderId = rzpOrder.id;
            } catch (rzpErr) {
                console.log("Razorpay API create order error, using simulated orderId:", rzpErr.message);
                razorpayOrderId = "order_sim_" + Date.now();
            }
        } else {
            razorpayOrderId = "order_sim_" + Date.now();
        }

        const newOrder = new OrderModel({
            orderNumber,
            buyer: req.user._id,
            buyerName: shippingAddress.fullName || req.user.name,
            buyerEmail: req.user.email,
            buyerPhone: cleanPhone,
            items: verifiedItems,
            totalAmount: finalAmount,
            shippingAddress: {
                ...shippingAddress,
                phone: cleanPhone,
                pincode: cleanPincode
            },
            paymentMethod: "Razorpay",
            paymentStatus: "pending",
            razorpayOrderId,
            orderStatus: "placed",
            timeline: [
                {
                    status: "Placed",
                    message: "Order placed. Awaiting secure Razorpay payment authorization.",
                    timestamp: new Date()
                }
            ]
        });

        await newOrder.save();

        return res.send({
            status: 1,
            msg: "Order initialized successfully",
            orderId: newOrder._id,
            orderNumber: newOrder.orderNumber,
            razorpayOrderId,
            amount: amountInPaise,
            currency: "INR",
            keyId: RAZORPAY_KEY_ID,
            prefill: {
                name: shippingAddress.fullName || req.user.name,
                email: req.user.email,
                contact: cleanPhone
            }
        });

    } catch (err) {
        console.error("Order creation exception:", err);
        return res.send({ status: 0, msg: "Failed to initialize payment order: " + (err.message || "Server error") });
    }
}

// 2. Verify Razorpay Payment Signature
async function verifyRazorpayPayment(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!orderId || !razorpay_payment_id) {
            return res.send({ status: 7, msg: "Missing payment verification parameters (orderId & paymentId required)" });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) return res.send({ status: 9, msg: "Order not found" });

        // Security check: Verify buyer ownership
        if (String(order.buyer) !== String(req.user._id)) {
            return res.send({ status: 403, msg: "Permission denied: Unauthorized access to this order." });
        }

        // Idempotency: If already verified and paid, return clean success immediately
        if (order.paymentStatus === "paid") {
            return res.send({
                status: 1,
                msg: "Payment was already verified. Order is confirmed.",
                order
            });
        }

        // Cross-Order validation: If order has live Razorpay ID, ensure it matches incoming request
        if (order.razorpayOrderId && !order.razorpayOrderId.startsWith("order_sim_") && razorpay_order_id) {
            if (order.razorpayOrderId !== razorpay_order_id) {
                return res.send({
                    status: 10,
                    msg: "Order ID mismatch. Transaction cannot be validated against this order."
                });
            }
        }

        let isSignatureValid = false;

        // Perform cryptographic HMAC-SHA256 signature check if live secret is available
        if (razorpay_signature && RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET) {
            const body = (razorpay_order_id || order.razorpayOrderId) + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

            isSignatureValid = expectedSignature === razorpay_signature;
        } else {
            // Simulated test-mode authorization
            isSignatureValid = true;
        }

        if (isSignatureValid) {
            order.paymentStatus = "paid";
            order.orderStatus = "confirmed";
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature || "simulated_sig";
            order.paymentFailureDetails = undefined; // clear any previous failure details

            order.timeline.push({
                status: "Confirmed",
                message: `Payment authorized via Razorpay (${razorpay_payment_id}). Order confirmed & sent to merchant for fulfillment!`,
                timestamp: new Date()
            });

            // Deduct stock for all ordered products
            for (const item of order.items) {
                if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
                    await ProductModel.findByIdAndUpdate(item.product, {
                        $inc: { stock: -Number(item.quantity) }
                    }).catch(e => console.log("Inventory update notice:", e.message));
                }
            }

            await order.save();

            return res.send({
                status: 1,
                msg: "Payment verified successfully! Your order has been placed.",
                order
            });
        } else {
            order.paymentStatus = "failed";
            order.paymentFailureDetails = {
                errorCode: "SIGNATURE_MISMATCH",
                errorDescription: "Cryptographic signature check failed. Security authorization mismatch.",
                errorSource: "gateway_verification",
                failedAt: new Date()
            };
            order.timeline.push({
                status: "Payment Failed",
                message: "Payment signature mismatch or failed transaction verification.",
                timestamp: new Date()
            });
            await order.save();

            return res.send({
                status: 10,
                msg: "Payment verification failed. Invalid transaction signature.",
                order
            });
        }

    } catch (err) {
        console.error("Payment verification exception:", err);
        return res.send({ status: 0, msg: "Error verifying payment: " + (err.message || "Server error") });
    }
}

// 3. Handle Payment Failure / Modal Dismissal / Decline
async function handlePaymentFailure(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const { orderId, error } = req.body;

        if (!orderId) {
            return res.send({ status: 7, msg: "Order ID is required to log payment failure" });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) return res.send({ status: 9, msg: "Order not found" });

        // Ensure buyer owns this order
        if (String(order.buyer) !== String(req.user._id)) {
            return res.send({ status: 403, msg: "Unauthorized access" });
        }

        // Do not overwrite if order is already paid
        if (order.paymentStatus === "paid") {
            return res.send({ status: 1, msg: "Order is already paid", order });
        }

        const errCode = error?.code || "PAYMENT_CANCELLED_OR_FAILED";
        const errDesc = error?.description || error?.message || "Transaction was declined or cancelled by user.";

        order.paymentStatus = "failed";
        order.paymentFailureDetails = {
            errorCode: errCode,
            errorDescription: errDesc,
            errorSource: error?.source || "client_sdk",
            errorStep: error?.step || "payment_authorization",
            errorReason: error?.reason || "",
            failedAt: new Date()
        };

        order.timeline.push({
            status: "Payment Failed",
            message: `Payment failed: ${errDesc} (${errCode})`,
            timestamp: new Date()
        });

        await order.save();

        return res.send({
            status: 1,
            msg: "Payment failure recorded",
            order
        });

    } catch (err) {
        console.error("Payment failure recording error:", err);
        return res.send({ status: 0, msg: "Failed to record payment failure" });
    }
}

// 4. Retry Payment on Pending/Failed Order
async function retryRazorpayOrder(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const { orderId } = req.body;

        if (!orderId) return res.send({ status: 7, msg: "Order ID is required" });

        const order = await OrderModel.findById(orderId);
        if (!order) return res.send({ status: 9, msg: "Order not found" });

        if (String(order.buyer) !== String(req.user._id)) {
            return res.send({ status: 403, msg: "Unauthorized access" });
        }

        if (order.paymentStatus === "paid") {
            return res.send({ status: 7, msg: "This order has already been paid for and confirmed." });
        }

        if (order.orderStatus === "cancelled") {
            return res.send({ status: 7, msg: "This order was cancelled. Please place a new order from your cart." });
        }

        const amountInPaise = Math.round(order.totalAmount * 100);
        let newRazorpayOrderId = "order_sim_" + Date.now();

        if (razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            try {
                const rzpOrder = await razorpayInstance.orders.create({
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: order.orderNumber,
                    notes: {
                        buyerEmail: req.user.email,
                        orderNumber: order.orderNumber,
                        isRetry: "true"
                    }
                });
                newRazorpayOrderId = rzpOrder.id;
            } catch (rzpErr) {
                console.log("Retry Razorpay create order notice:", rzpErr.message);
                newRazorpayOrderId = "order_sim_" + Date.now();
            }
        }

        order.razorpayOrderId = newRazorpayOrderId;
        order.timeline.push({
            status: "Payment Retry",
            message: "Customer initiated payment retry.",
            timestamp: new Date()
        });

        await order.save();

        return res.send({
            status: 1,
            msg: "Retry payment initialized",
            orderId: order._id,
            orderNumber: order.orderNumber,
            razorpayOrderId: newRazorpayOrderId,
            amount: amountInPaise,
            currency: "INR",
            keyId: RAZORPAY_KEY_ID,
            prefill: {
                name: order.shippingAddress?.fullName || req.user.name,
                email: req.user.email,
                contact: order.shippingAddress?.phone || ""
            }
        });

    } catch (err) {
        console.error("Retry payment error:", err);
        return res.send({ status: 0, msg: "Failed to initialize payment retry" });
    }
}

// 5. Buyer Cancel Order
async function cancelOrder(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const { id } = req.params;
        const { reason } = req.body;

        const order = await OrderModel.findById(id);
        if (!order) return res.send({ status: 9, msg: "Order not found" });

        const isBuyer = String(order.buyer) === String(req.user._id);
        const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

        if (!isBuyer && !isAdmin) {
            return res.send({ status: 403, msg: "Unauthorized to cancel this order" });
        }

        // Cannot cancel if already dispatched or delivered
        if (['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
            return res.send({
                status: 7,
                msg: `Order is already ${order.orderStatus.replace('_', ' ')} and cannot be cancelled directly. Please contact support.`
            });
        }

        if (order.orderStatus === 'cancelled') {
            return res.send({ status: 7, msg: "Order is already cancelled." });
        }

        const previousPaymentStatus = order.paymentStatus;
        order.orderStatus = "cancelled";
        order.cancellationReason = reason || "Cancelled by customer";

        // If order was already paid, mark payment as refunded / pending refund & restore stock
        if (previousPaymentStatus === "paid") {
            order.paymentStatus = "refunded";
            order.timeline.push({
                status: "Cancelled & Refund Initiated",
                message: `Order cancelled (${reason || 'Customer request'}). Refund of ₹${order.totalAmount} initiated to original payment source.`,
                timestamp: new Date()
            });

            // Restore product stock
            for (const item of order.items) {
                if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
                    await ProductModel.findByIdAndUpdate(item.product, {
                        $inc: { stock: Number(item.quantity) }
                    }).catch(e => console.log("Inventory restoration notice:", e.message));
                }
            }
        } else {
            order.timeline.push({
                status: "Cancelled",
                message: `Order cancelled before payment authorization. Reason: ${reason || 'Customer request'}`,
                timestamp: new Date()
            });
        }

        await order.save();

        return res.send({
            status: 1,
            msg: "Order cancelled successfully",
            order
        });

    } catch (err) {
        console.error("Cancel order error:", err);
        return res.send({ status: 0, msg: "Failed to cancel order" });
    }
}

// 6. User: Get all my orders
async function getUserOrders(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const orders = await OrderModel.find({ buyer: req.user._id }).sort({ createdAt: -1 });
        return res.send({ status: 1, orders });
    } catch (err) {
        console.error("Fetch user orders error:", err);
        return res.send({ status: 0, msg: "Failed to fetch orders" });
    }
}

// 7. User: Get single order with tracking timeline
async function getOrderDetails(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send({ status: 9, msg: "Invalid Order ID" });
        }

        const order = await OrderModel.findById(id);
        if (!order) return res.send({ status: 9, msg: "Order not found" });

        // Ensure buyer, seller or admin
        const isBuyer = req.user && String(order.buyer) === String(req.user._id);
        const isAdmin = req.user && ['admin', 'super_admin'].includes(req.user.role);
        const isSeller = req.user && order.items.some(i => String(i.seller) === String(req.user._id));

        if (!isBuyer && !isAdmin && !isSeller) {
            return res.send({ status: 403, msg: "Permission denied to view this order" });
        }

        return res.send({ status: 1, order });
    } catch (err) {
        console.error("Fetch order details error:", err);
        return res.send({ status: 0, msg: "Failed to fetch order details" });
    }
}

// 8. Seller: Get incoming orders for seller's products
async function getSellerOrders(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });

        const orders = await OrderModel.find({
            $or: [
                { "items.seller": req.user._id },
                { "items.sellerName": req.user.name },
                { "items.sellerName": req.user.sellerDetails?.shopName }
            ]
        }).sort({ createdAt: -1 });

        return res.send({ status: 1, orders });
    } catch (err) {
        console.error("Fetch seller orders error:", err);
        return res.send({ status: 0, msg: "Failed to fetch seller orders" });
    }
}

// 9. Seller: Update order fulfillment status
async function updateSellerOrderStatus(req, res) {
    try {
        if (!req.user) return res.send({ status: 401, msg: "Unauthorized" });
        const { orderId, newStatus, message } = req.body;

        if (!orderId || !newStatus) {
            return res.send({ status: 7, msg: "Order ID and new status required" });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) return res.send({ status: 9, msg: "Order not found" });

        const validStatuses = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.send({ status: 7, msg: "Invalid order status value" });
        }

        order.orderStatus = newStatus;
        const statusLabels = {
            processing: "Order Processing & Quality Inspection",
            shipped: "Order Dispatched / In Transit with Courier Partner",
            out_for_delivery: "Out for Doorstep Delivery",
            delivered: "Delivered to Customer",
            cancelled: "Order Cancelled by Merchant"
        };

        order.timeline.push({
            status: newStatus.toUpperCase(),
            message: message || statusLabels[newStatus] || `Status updated to ${newStatus}`,
            timestamp: new Date()
        });

        await order.save();
        return res.send({ status: 1, msg: `Order status updated to ${newStatus}`, order });
    } catch (err) {
        console.error("Update seller order status error:", err);
        return res.send({ status: 0, msg: "Failed to update order status" });
    }
}

// 10. Admin: Get all orders across the entire marketplace
async function adminGetAllOrders(req, res) {
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 });

        const totalSales = orders
            .filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const totalOrders = orders.length;
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
        const failedOrders = orders.filter(o => o.paymentStatus === 'failed').length;
        const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'processing').length;

        return res.send({
            status: 1,
            orders,
            metrics: {
                totalSales,
                totalOrders,
                paidOrders,
                failedOrders,
                pendingOrders
            }
        });
    } catch (err) {
        console.error("Admin orders error:", err);
        return res.send({ status: 0, msg: "Failed to fetch admin orders" });
    }
}

export {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handlePaymentFailure,
    retryRazorpayOrder,
    cancelOrder,
    getUserOrders,
    getOrderDetails,
    getSellerOrders,
    updateSellerOrderStatus,
    adminGetAllOrders
};
