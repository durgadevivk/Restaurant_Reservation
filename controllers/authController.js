const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const {
    SALT_ROUNDS,
    JWT_SECRET,
    ENV
} = require('../utils/config.js');
const jwt = require('jsonwebtoken');

const authController = {

    // REGISTER USER
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check required fields
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: 'Name, email and password are required'
                });
            }

            // Check existing user
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    message: 'User already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(
                password,
                parseInt(SALT_ROUNDS)
            );

            // Create user
            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            await newUser.save();

            return res.status(201).json({
                message: 'User registered successfully'
            });

        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    },


    // LOGIN USER
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    message: 'Invalid email or user does not exist'
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(400).json({
                    message: 'Invalid password'
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { userId: user._id },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: ENV === 'production',
                sameSite: ENV === 'production' ? 'none' : 'lax',
                maxAge: 3600000
            });

            return res.status(200).json({
                message: 'User logged in successfully'
            });

        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    },


    // GET LOGGED-IN USER PROFILE
    me: async (req, res) => {
        try {
            const userId = req.userId;

            const user = await User.findById(userId)
                .select('-password -__v');

            return res.status(200).json({
                user
            });

        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    },


    // LOGOUT USER
    logout: async (req, res) => {
        try {

            res.clearCookie('token', {
                httpOnly: true,
                secure: ENV === 'production',
                sameSite: ENV === 'production' ? 'none' : 'lax'
            });

            return res.status(200).json({
                message: 'User logged out successfully'
            });

        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

};

module.exports = authController;