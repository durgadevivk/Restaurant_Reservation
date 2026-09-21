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

module.exports = {
    createOrder
};