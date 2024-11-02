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

    // Check if a specific collection exists
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'your_collection_name' }).toArray();
    if (collections.length > 0) {
      console.log('Collection exists, implying the database exists');
    } else {
      console.log('Collection does not exist, implying the database does not exist');
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;

