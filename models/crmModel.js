import mongoose from 'mongoose';

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

export const calculateQuote = (req, res, next) => {
    const { moveType, weight, distance, time } = req.body;
    let estimatedCost = 0;

    if (moveType === 'local') {
        estimatedCost = time * hourlyRate + distance * fuelSurcharge;
    } else {
        const cwt = weight / 100;
        estimatedCost = cwt * transportationRate + distance * travelRate + fuelSurcharge;
    }

    req.body.estimatedCost = estimatedCost;
    next();
};

export default CRM;