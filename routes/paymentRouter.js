const express = require("express");

const {
    createOrder,verifyPayment
} = require("../controllers/paymentController");

const { isAuthenticated } = require("../middlewares/auth");

const paymentRouter = express.Router();

paymentRouter.post(
    "/create-order",
    isAuthenticated,
    createOrder
);
paymentRouter.post(
    "/verify",
    isAuthenticated,
    verifyPayment
);

module.exports = paymentRouter;