require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./configuration/dbConfig');
const mongoose = require('mongoose');

// Set port
const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
};

startServer();

// Handle process termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed. Exiting process');
    process.exit(0);
});
