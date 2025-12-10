const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const bookRoutes = require('./router/book.routes');
const authRoutes = require('./router/auth.routes');
const reviewRoutes = require('./router/review.routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple API status route
app.get('/api', (req, res) => {
    res.json({
        message: 'Bookshop API is running',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', reviewRoutes); // Reviews are part of books

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate entry error',
            error: Object.keys(err.keyValue).reduce((acc, key) => {
                acc[key] = `${key} already exists`;
                return acc;
            }, {})
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            message: 'Validation error',
            errors
        });
    }

    // Handle other errors
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

module.exports = app;
