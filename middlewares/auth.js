const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config.js');
const User = require('../models/user.js');

// Check if user is authenticated
const isAuthenticated = async (req, res, next) => {

    // Get token from cookie
    const token = req.cookies && req.cookies.token;

    // No token
    if (!token) {
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user ID from token
        req.userId = decoded.userId;

        // Continue
        next();

    } catch (e) {
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    }
};


// Check user role
const allowRoles = (roles) => {

    return async (req, res, next) => {

        try {
            // Get user ID from request
            const userId = req.userId;

            // Find user
            const user = await User.findById(userId);

            // User not found
            if (!user) {
                return res.status(404).json({
                    message: 'User is not found'
                });
            }

            // Check role
            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message: 'Forbidden: you do not have the required role to access this resource'
                });
            }

            // Store user in request
            req.user = user;

            next();

        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    };
};


module.exports = {
    isAuthenticated,
    allowRoles
};