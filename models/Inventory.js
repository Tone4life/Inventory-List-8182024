import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }]
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
