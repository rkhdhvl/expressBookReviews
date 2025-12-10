// models/review.model.js
const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        ref: 'Book'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index to ensure one review per user per book
reviewSchema.index({ isbn: 1, userId: 1 }, { unique: true });

// Create Review model
const ReviewModel = mongoose.model('Review', reviewSchema);

// Review class methods for the API
class Review {
    // Task 5: Get all reviews for a book
    async getBookReviews(isbn) {
        return await ReviewModel.find({ isbn });
    }

    // Task 8 & 9: Find user's review for a book
    async findUserReview(isbn, userId) {
        return await ReviewModel.findOne({ isbn, userId });
    }

    // Task 8: Add a new review
    async create(reviewData) {
        const newReview = new ReviewModel({
            ...reviewData,
            updatedAt: new Date()
        });

        await newReview.save();
        return newReview;
    }

    // Task 8: Update an existing review
    async update(isbn, userId, reviewData) {
        const updatedReview = await ReviewModel.findOneAndUpdate(
            { isbn, userId },
            {
                ...reviewData,
                updatedAt: new Date()
            },
            { new: true } // Return the updated document
        );

        return updatedReview;
    }

    // Task 9: Delete a review
    async delete(isbn, userId) {
        const deletedReview = await ReviewModel.findOneAndDelete({ isbn, userId });
        return deletedReview;
    }
}

module.exports = new Review();