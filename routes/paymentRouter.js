const express = require("express");

const {
    createOrder
} = require("../controllers/paymentController");

const { isAuthenticated } = require("../middlewares/auth");

const paymentRouter = express.Router();

paymentRouter.post(
    "/create-order",
    isAuthenticated,
    createOrder
);

module.exports = paymentRouter;