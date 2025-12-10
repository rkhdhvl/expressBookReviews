const Review = require('../models/review.model');
const Book = require('../models/book.model');
const asyncHandler = require('../utils/async-handler');

// Task 5: Get book reviews
const getBookReviews = asyncHandler(async (req, res) => {
    try {
        const { isbn } = req.params;

        // Check if book exists
        const book = await Book.getBookByISBN(isbn);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const reviews = await Review.getBookReviews(isbn);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving reviews',
            error: error.message
        });
    }
});

// Task 8: Add or update book review
const addOrUpdateReview = asyncHandler(async (req, res) => {
    try {
        const { isbn } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment is required'
            });
        }

        // Check if book exists
        const book = await Book.getBookByISBN(isbn);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Check if user already has a review for this book
        const existingReview = await Review.findUserReview(isbn, userId);

        if (existingReview) {
            // Update existing review
            const updatedReview = await Review.update(isbn, userId, { rating, comment });
            return res.json({
                success: true,
                message: 'Review updated successfully',
                review: updatedReview
            });
        }

        // Add new review
        const newReview = await Review.create({
            isbn,
            userId,
            username,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            review: newReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing review',
            error: error.message
        });
    }
});

// Task 9: Delete a book review
const deleteReview = asyncHandler(async (req, res) => {
    try {
        const { isbn } = req.params;
        const userId = req.user.id;

        // Find and delete user's review for this book
        const deletedReview = await Review.delete(isbn, userId);

        if (!deletedReview) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully',
            review: deletedReview
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
});

module.exports = {
    getBookReviews,
    addOrUpdateReview,
    deleteReview
};
