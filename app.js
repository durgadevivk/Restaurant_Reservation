//import express
const express=require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const restaurantRouter = require('./routes/restaurantRouter');

//create app
const app=express();
//parse cookie
app.use(cookieParser());
app.use(express.json());

//configure Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/restaurant', restaurantRouter);

module.exports = app;