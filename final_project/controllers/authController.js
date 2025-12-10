const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { secret, expiresIn } = require('../configuration/authConfig');
const asyncHandler = require('../utils/async-handler');

// Task 6: Register new user
const register = asyncHandler(async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if required fields are provided
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if username already exists
        const usernameExists = await User.usernameExists(username);
        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Create user
        const user = await User.create({ username, password, email });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

// Task 7: Login as a registered user
const login = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if required fields are provided
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find user
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const validPassword = await User.verifyPassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            secret,
            { expiresIn }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

module.exports = {
    register,
    login
};
