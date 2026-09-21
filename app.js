//import express
const express=require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const restaurantRouter = require('./routes/restaurantRouter');

const reservationRouter = require('./routes/reservationRouter');
const reviewRouter=require('./routes/reviewRouter');
//create app
const app=express();
//parse cookie
app.use(cookieParser());
app.use(express.json());
//for cros origins
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
//configure Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/review', reviewRouter);
module.exports = app;