//import express
const express=require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const restaurantRouter = require('./routes/restaurantRouter');
console.log("Mounting reservation routes...");
const reservationRouter = require('./routes/reservationRouter');
const reviewRouter=require('./routes/reviewRouter');
const paymentRouter = require('./routes/paymentRouter');
//create app
const app=express();
//parse cookie
app.use(cookieParser());
app.use(express.json());
//for cros origins
app.use(cors({
    origin:['http://localhost:5173',
    'https://fe-restaurant.netlify.app'],
    credentials: true
}));
//configure Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/restaurant', restaurantRouter);
app.post('/api/v1/test-reservation', (req, res) => {
    console.log("TEST RESERVATION ROUTE REACHED");
    res.json({ message: "Test route working" });
});
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/payment', paymentRouter);

module.exports = app;