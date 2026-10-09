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

// Helper: Common checkout launcher given initialized order parameters
const launchRazorpayModal = ({
    orderId,
    orderNumber,
    razorpayOrderId,
    amount,
    currency,
    keyId,
    prefill,
    onSuccess,
    onFailure,
    onClose
}) => {
    let paymentCompleted = false;

    const options = {
        key: keyId,
        amount: amount,
        currency: currency || "INR",
        name: "RealBell BizMart",
        description: `Order #${orderNumber} • B2B Marketplace Payment`,
        image: "/logo.png",
        order_id: razorpayOrderId && !razorpayOrderId.startsWith("order_sim_") ? razorpayOrderId : undefined,
        prefill: {
            name: prefill?.name || "",
            email: prefill?.email || "",
            contact: prefill?.contact || ""
        },
        theme: {
            color: "#f59e0b" // Amber brand color
        },
        modal: {
            ondismiss: async function () {
                if (!paymentCompleted) {
                    try {
                        await axios.post('/payment/payment-failed', {
                            orderId,
                            error: {
                                code: "MODAL_DISMISSED",
                                description: "Checkout window closed by user without completing authorization.",
                                source: "buyer_action"
                            }
                        });
                    } catch (e) {
                        console.error("Failed to record dismissal:", e);
                    }
                    toast.info("Payment window closed. You can retry this order anytime from your Orders page.");
                    if (onClose) onClose({ orderId, orderNumber, dismissed: true });
                }
            }
        },
        handler: async function (response) {
            paymentCompleted = true;
            try {
                // Verify payment cryptographically on backend
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
                    const failMsg = verifyRes.data?.msg || "Payment verification failed.";
                    toast.error(failMsg);
                    if (onFailure) onFailure({ message: failMsg, orderId });
                }
            } catch (verifyErr) {
                console.error("Verification error:", verifyErr);
                toast.error("Network error verifying transaction. Please check your Orders page.");
                if (onFailure) onFailure({ message: verifyErr.message, orderId });
            }
        }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on('payment.failed', async function (response) {
        paymentCompleted = false;
        const errObj = response.error || {};
        console.error("Razorpay Payment failure event:", errObj);

        try {
            await axios.post('/payment/payment-failed', {
                orderId,
                error: {
                    code: errObj.code || "PAYMENT_DECLINED",
                    description: errObj.description || "Bank declined or transaction failed.",
                    source: errObj.source || "bank_gateway",
                    step: errObj.step || "payment_authorization",
                    reason: errObj.reason || ""
                }
            });
        } catch (e) {
            console.error("Failed to notify backend of payment failure:", e);
        }

        const failureDescription = errObj.description || 'Transaction declined by payment gateway.';
        toast.error(`Payment Failed: ${failureDescription}`);
        if (onFailure) onFailure({ error: errObj, orderId, orderNumber });
    });

    razorpay.open();
};

// 1. Initial Checkout
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
            if (onFailure) onFailure({ message: "Gateway script load failed" });
            return;
        }

        // Initialize order on backend
        const initRes = await axios.post('/payment/create-order', orderData);
        if (initRes.status !== 200 || initRes.data.status !== 1) {
            const errorMsg = initRes.data?.msg || "Could not initialize order.";
            toast.error(errorMsg);
            if (onFailure) onFailure({ message: errorMsg });
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

        launchRazorpayModal({
            orderId,
            orderNumber,
            razorpayOrderId,
            amount,
            currency,
            keyId,
            prefill,
            onSuccess,
            onFailure,
            onClose
        });

    } catch (err) {
        console.error("Razorpay initiation error:", err);
        const errMsg = err.response?.data?.msg || err.message || "Failed to start payment checkout.";
        toast.error(errMsg);
        if (onFailure) onFailure({ message: errMsg });
    }
};

// 2. Retry Checkout for an Existing Pending/Failed Order
export const retryRazorpayCheckout = async ({
    orderId,
    onSuccess,
    onFailure,
    onClose
}) => {
    try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            toast.error("Failed to load payment gateway script.");
            if (onFailure) onFailure({ message: "Gateway script load failed" });
            return;
        }

        const retryRes = await axios.post('/payment/retry-order', { orderId });
        if (retryRes.status !== 200 || retryRes.data.status !== 1) {
            const errorMsg = retryRes.data?.msg || "Could not initialize payment retry.";
            toast.error(errorMsg);
            if (onFailure) onFailure({ message: errorMsg });
            return;
        }

        const {
            orderNumber,
            razorpayOrderId,
            amount,
            currency,
            keyId,
            prefill
        } = retryRes.data;

        launchRazorpayModal({
            orderId,
            orderNumber,
            razorpayOrderId,
            amount,
            currency,
            keyId,
            prefill,
            onSuccess,
            onFailure,
            onClose
        });

    } catch (err) {
        console.error("Razorpay retry error:", err);
        const errMsg = err.response?.data?.msg || err.message || "Failed to retry payment.";
        toast.error(errMsg);
        if (onFailure) onFailure({ message: errMsg });
    }
};
