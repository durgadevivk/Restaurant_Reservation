const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
    try {
        const options = {
            amount: 50000, // ₹500 in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        console.error("Razorpay order error:", error);

        res.status(500).json({
            message: "Failed to create payment order",
            error: error.message
        });
    }
};
const crypto = require("crypto");

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        return res.status(200).json({
            message: "Payment verified successfully"
        });

    } catch (error) {
        console.error("Payment verification error:", error);

        return res.status(500).json({
            message: "Payment verification failed",
            error: error.message
        });
    }
};
module.exports = {
    createOrder,verifyPayment
};