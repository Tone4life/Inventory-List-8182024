import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'] },
  moveDate: { type: Date, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  clientEmail: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export { InventoryItem };
