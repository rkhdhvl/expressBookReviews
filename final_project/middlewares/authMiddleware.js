const jwt = require('jsonwebtoken');
const { secret } = require('../configuration/authConfig');
const mongoose = require('mongoose');

// Verify JWT token middleware (used for Task 8 & 9)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Ensure id is a valid MongoDB ObjectId
        try {
            if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid user ID in token'
                });
            }

            // Add user info to request
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error processing authentication',
                error: error.message
            });
        }
    });
};

module.exports = {
    verifyToken
};
