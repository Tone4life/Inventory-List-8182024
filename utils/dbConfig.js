// utils/dbConfig.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Set strictQuery to prepare for Mongoose 7
mongoose.set('strictQuery', true);  // Or false, depending on your preference

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,  // Handles reconnections automatically
      retryWrites: true,  // Ensures writes are retried on failure
      connectTimeoutMS: 30000, // Timeouts for better performance
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;

