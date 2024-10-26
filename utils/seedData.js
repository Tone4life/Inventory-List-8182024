// utils/seedData.js
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';  
import { User } from '../models/User.js';
import { InventoryItem } from '../models/InventoryItem.js';
import connectDB from './dbConfig.js'; // Import the DB config

dotenv.config(); // Load environment variables

// Connect to the database
connectDB();

const createSampleUsers = async () => {
  return [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash(process.env.USER1_PASSWORD, 10), // Hash the password
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash(process.env.USER2_PASSWORD, 10), // Hash the password
    },
  ];
};

const sampleInventoryItems = [
  {
    name: 'Sofa',
    description: 'A comfy 3-seater sofa',
    quantity: 1,
    moveDate: new Date(),
    origin: '123 Main St',
    destination: '456 Elm St',
    clientEmail: 'john@example.com',
    owner: null, // Placeholder for owner ID
  },
  {
    name: 'Refrigerator',
    description: 'Double-door refrigerator',
    quantity: 1,
    moveDate: new Date(),
    origin: '789 Oak St',
    destination: '101 Pine St',
    clientEmail: 'jane@example.com',
    owner: null, // Placeholder for owner ID
  },
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await InventoryItem.deleteMany({});

    // Create sample users
    const sampleUsers = await createSampleUsers();

    // Insert sample users
    const createdUsers = await User.insertMany(sampleUsers);

    // Assign owner IDs to inventory items
    sampleInventoryItems[0].owner = createdUsers[0]._id;
    sampleInventoryItems[1].owner = createdUsers[1]._id;

    // Insert sample inventory items
    await InventoryItem.insertMany(sampleInventoryItems);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding data failed:', error);
    process.exit(1);
  }
};

seedDatabase();
