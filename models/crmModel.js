import mongoose from 'mongoose';
import { estimateMoveCost } from '../utils/moveEstimator.js'; // Correct import path

const crmSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  moveDate: { type: Date, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  moveType: { type: String, enum: ['local', 'intrastate', 'interstate'], required: true },
  inventory: [
    {
      item: { type: String },
      room: { type: String },
      quantity: { type: Number, default: 1 }
    }
  ],
  estimatedCost: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

const CRM = mongoose.model('CRM', crmSchema);

const hourlyRate = 100;
const fuelSurcharge = 0.10; // 10% surcharge

export const calculateQuote = async (req, res, next) => {
    const { moveType, weight, distance, time, inventorySize } = req.body;

    // Default cost calculation (if AI estimator fails)
    let estimatedCost = time * hourlyRate + distance * fuelSurcharge;

    try {
        // Use AI estimator for a more detailed prediction
        const aiCost = await estimateMoveCost(inventorySize, distance, moveType);
        estimatedCost = aiCost || estimatedCost;  // Fallback to default if AI cost is unavailable
    } catch (error) {
        console.error('Error with AI cost estimation:', error);
    }

    req.body.estimatedCost = estimatedCost;  // Attach estimated cost to the request body
    next();
};

export default CRM;