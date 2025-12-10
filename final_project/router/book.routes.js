const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

// Task 1: Get all books
router.get('/', bookController.getAllBooks);

// Task 2: Get book by ISBN
router.get('/isbn/:isbn', bookController.getBookByISBN);

// Task 3: Get books by author
router.get('/author/:author', bookController.getBooksByAuthor);

// Task 4: Get books by title
router.get('/title/:title', bookController.getBooksByTitle);

// Task 10: Get all books using async callback
router.get('/async/books', bookController.getAllBooksAsync);

// Task 11: Search by ISBN using Promises
router.get('/promise/isbn/:isbn', bookController.getBookByISBNPromise);

// Task 12: Search by author using Promises
router.get('/promise/author/:author', bookController.getBooksByAuthorPromise);

// Task 13: Search by title using Promises
router.get('/promise/title/:title', bookController.getBooksByTitlePromise);

module.exports = router;
