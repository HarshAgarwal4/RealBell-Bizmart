import axios from './axios';
import { toast } from 'react-toastify';

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const initiateRazorpayCheckout = async ({
    orderData,
    onSuccess,
    onFailure,
    onClose
}) => {
    try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            toast.error("Failed to load Razorpay payment gateway. Please check your internet connection.");
            if (onFailure) onFailure("Gateway script load failed");
            return;
        }

        // Initialize order on backend
        const initRes = await axios.post('/payment/create-order', orderData);
        if (initRes.status !== 200 || initRes.data.status !== 1) {
            const errorMsg = initRes.data?.msg || "Could not initialize order.";
            toast.error(errorMsg);
            if (onFailure) onFailure(errorMsg);
            return;
        }

        const {
            orderId,
            orderNumber,
            razorpayOrderId,
            amount,
            currency,
            keyId,
            prefill
        } = initRes.data;

        const options = {
            key: keyId,
            amount: amount,
            currency: currency || "INR",
            name: "RealBell BizMart",
            description: `Order #${orderNumber} • B2B Wholesale Payment`,
            image: "/logo.png",
            order_id: razorpayOrderId.startsWith("order_sim_") ? undefined : razorpayOrderId,
            prefill: {
                name: prefill?.name || "",
                email: prefill?.email || "",
                contact: prefill?.contact || ""
            },
            theme: {
                color: "#f59e0b" // Amber brand color
            },
            modal: {
                ondismiss: function () {
                    toast.info("Payment window closed. Order remains pending in your cart.");
                    if (onClose) onClose();
                }
            },
            handler: async function (response) {
                try {
                    // Verify payment on backend
                    const verifyRes = await axios.post('/payment/verify-payment', {
                        orderId,
                        razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyRes.status === 200 && verifyRes.data.status === 1) {
                        toast.success("Payment verified! Order placed successfully.");
                        if (onSuccess) onSuccess(verifyRes.data.order);
                    } else {
                        toast.error(verifyRes.data?.msg || "Payment verification failed.");
                        if (onFailure) onFailure(verifyRes.data?.msg);
                    }
                } catch (verifyErr) {
                    console.error("Verification error:", verifyErr);
                    toast.error("Network error verifying transaction. Please contact support.");
                    if (onFailure) onFailure(verifyErr.message);
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
            console.error("Payment failed:", response.error);
            toast.error(`Payment Failed: ${response.error.description || 'Transaction declined'}`);
            if (onFailure) onFailure(response.error);
        });
        razorpay.open();

    } catch (err) {
        console.error("Razorpay initiation error:", err);
        toast.error("Failed to start payment checkout.");
        if (onFailure) onFailure(err.message);
    }
};
