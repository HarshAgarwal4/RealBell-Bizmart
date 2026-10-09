import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    subtotal: { type: Number, required: true },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sellerName: { type: String, default: "" },
    image: { type: String, default: "" },
    purchaseType: {
        type: String,
        enum: ['normal', 'wholesale'],
        default: 'normal'
    },
    tierApplied: { type: String, default: "" }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, default: "" },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        default: "Razorpay"
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    paymentFailureDetails: {
        errorCode: { type: String, default: "" },
        errorDescription: { type: String, default: "" },
        errorSource: { type: String, default: "" },
        errorStep: { type: String, default: "" },
        errorReason: { type: String, default: "" },
        failedAt: { type: Date }
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'placed'
    },
    cancellationReason: { type: String, default: "" },
    timeline: [
        {
            status: { type: String, required: true },
            message: { type: String, default: "" },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
