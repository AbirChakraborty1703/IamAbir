require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
        
        if (!mongoURI) {
            throw new Error('MongoDB connection string is not defined in environment variables!');
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('MongoDB Atlas connected successfully');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Don't exit the process, let the application handle the error
        throw error;
    }
};

module.exports = connectDB;
