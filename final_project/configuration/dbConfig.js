const mongoose = require('mongoose');
require('dotenv').config();

// Use local MongoDB URL or the one configured for the environment
const MONGODB_URI = process.env.MONGODB_URI;

// Sample books data
const sampleBooks = [
    {
        isbn: "978-0143034638",
        title: "The White Tiger",
        author: "Aravind Adiga",
        description: "A satirical novel about the class struggle in modern India as told through the life of a highly ambitious man who escapes his village and achieves success."
    },
    {
        isbn: "978-0679727761",
        title: "The God of Small Things",
        author: "Arundhati Roy",
        description: "A novel exploring the childhood experiences of fraternal twins whose lives are destroyed by the 'Love Laws' of 1969 Kerala, India."
    },
    {
        isbn: "978-0385370500",
        title: "The Namesake",
        author: "Jhumpa Lahiri",
        description: "The story of Gogol Ganguli, a boy born in America to Bengali parents, and his struggle with his unique name and the clashing cultures in his life."
    },
    {
        isbn: "978-0143420842",
        title: "Malgudi Days",
        author: "R. K. Narayan",
        description: "A collection of short stories depicting the lives of people living in the fictional town of Malgudi, capturing the essence of Indian life with gentle humor."
    }
];

// populate database with books data
const populateDatabase = async () => {
    try {
        // Check if books already exist
        const bookCount = await mongoose.connection.collection('books').countDocuments();

        if (bookCount === 0) {
            console.log('No books found, populating database...');
            await mongoose.connection.collection('books').insertMany(sampleBooks);
            console.log(`${sampleBooks.length} books added to the database!`);
        } else {
            console.log(`Database already contains ${bookCount} books. Skipping adding data.`);
        }
    } catch (error) {
        console.error(`Error populating database: ${error.message}`);
    }
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // populate the database
        await populateDatabase();

        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    sampleBooks
};
