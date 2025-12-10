const Book = require('../models/book.model');
const asyncHandler = require('../utils/async-handler');

// Task 1: Get all books
const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving books',
            error: error.message
        });
    }
});

// Task 2: Get book by ISBN
const getBookByISBN = asyncHandler(async (req, res) => {
    try {
        const book = await Book.getBookByISBN(req.params.isbn);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving book',
            error: error.message
        });
    }
});

// Task 3: Get books by author
const getBooksByAuthor = asyncHandler(async (req, res) => {
    try {
        const books = await Book.getBooksByAuthor(req.params.author);

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found for this author'
            });
        }

        res.json(books);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving books',
            error: error.message
        });
    }
});

// Task 4: Get books by title
const getBooksByTitle = asyncHandler(async (req, res) => {
    try {
        const books = await Book.getBooksByTitle(req.params.title);

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found with this title'
            });
        }

        res.json(books);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving books',
            error: error.message
        });
    }
});

// Task 10: Get all books using async callback
const getAllBooksAsync = (req, res) => {
    Book.getAllBooksAsync((err, books) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving books',
                error: err.message
            });
        }
        res.json(books);
    });
};

// Task 11: Search by ISBN using Promise
const getBookByISBNPromise = asyncHandler(async (req, res) => {
    try {
        const book = await Book.getBookByISBNPromise(req.params.isbn);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.json(book);
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// Task 12: Search by author using Promise
const getBooksByAuthorPromise = asyncHandler(async (req, res) => {
    try {
        const books = await Book.getBooksByAuthorPromise(req.params.author);

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found for this author'
            });
        }

        res.json(books);
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// Task 13: Search by title using Promise
const getBooksByTitlePromise = asyncHandler(async (req, res) => {
    try {
        const books = await Book.getBooksByTitlePromise(req.params.title);

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found with this title'
            });
        }

        res.json(books);
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle,
    getAllBooksAsync,
    getBookByISBNPromise,
    getBooksByAuthorPromise,
    getBooksByTitlePromise
};
