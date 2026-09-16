//import express
const express=require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');

//create app
const app=express();
//parse cookie
app.use(cookieParser());
app.use(express.json());

//configure Routes
app.use('/api/v1/auth', authRouter);

module.exports = app;