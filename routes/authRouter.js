//import express
const express = require('express');
const {
    register,
    login,
    me,
    logout
} = require('../controllers/authController.js');
const { isAuthenticated } = require('../middlewares/auth.js');
//setup router
const authRouter = express.Router();


//configure routes
//public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
//protected routes
authRouter.get('/me', isAuthenticated,me);
authRouter.post('/logout', logout);

module.exports = authRouter;