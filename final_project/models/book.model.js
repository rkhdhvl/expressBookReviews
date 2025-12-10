// models/book.model.js
const mongoose = require('mongoose');

// Book Schema
const bookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    publishedDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create indexes for faster searching
bookSchema.index({ title: 'text', author: 'text' });

// Create the Book model
const BookModel = mongoose.model('Book', bookSchema);

// Book class methods for the API
class Book {
    // Task 1: Get all books
    async getAllBooks() {
        return await BookModel.find({});
    }

    // Task 2: Get book by ISBN
    async getBookByISBN(isbn) {
        return await BookModel.findOne({ isbn });
    }

    // Task 3: Get books by author
    async getBooksByAuthor(author) {
        return await BookModel.find({
            author: { $regex: author, $options: 'i' }
        });
    }

    // Task 4: Get books by title
    async getBooksByTitle(title) {
        return await BookModel.find({
            title: { $regex: title, $options: 'i' }
        });
    }

    // Task 10: Async version with callback
    getAllBooksAsync(callback) {
        BookModel.find({})
            .then(books => callback(null, books))
            .catch(err => callback(err, null));
    }

    // Task 11: Promise-based version for ISBN lookup
    getBookByISBNPromise(isbn) {
        return new Promise((resolve, reject) => {
            BookModel.findOne({ isbn })
                .then(book => {
                    if (!book) {
                        reject(new Error('Book not found'));
                    } else {
                        resolve(book);
                    }
                })
                .catch(err => reject(err));
        });
    }

    // Task 12: Promise-based version for author lookup
    getBooksByAuthorPromise(author) {
        return new Promise((resolve, reject) => {
            BookModel.find({ author: { $regex: author, $options: 'i' } })
                .then(books => {
                    if (books.length === 0) {
                        reject(new Error('No books found for this author'));
                    } else {
                        resolve(books);
                    }
                })
                .catch(err => reject(err));
        });
    }

    // Task 13: Promise-based version for title lookup
    getBooksByTitlePromise(title) {
        return new Promise((resolve, reject) => {
            BookModel.find({ title: { $regex: title, $options: 'i' } })
                .then(books => {
                    if (books.length === 0) {
                        reject(new Error('No books found with this title'));
                    } else {
                        resolve(books);
                    }
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = new Book();