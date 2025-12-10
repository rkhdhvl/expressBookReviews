// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Create User model
const UserModel = mongoose.model('User', userSchema);

// User class methods for the API
class User {
    // Task 6 & 7: Find user by username
    async findByUsername(username) {
        return await UserModel.findOne({ username });
    }

    // Task 6: Check if username exists
    async usernameExists(username) {
        const user = await UserModel.findOne({ username });
        return user !== null;
    }

    // Task 6: Create a new user
    async create(userData) {
        const newUser = new UserModel(userData);
        await newUser.save();

        // Return user data without password
        const userObject = newUser.toObject();
        delete userObject.password;

        return userObject;
    }

    // Task 7: Verify password
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = new User();