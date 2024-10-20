import express from 'express';
import InventoryItem from '../models/InventoryItems.js';

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await InventoryItem.find({});
    res.json(items);
  } catch (err) {
    res.status(500).send('Error retrieving inventory items');
  }
});

// Add a new inventory item
router.post('/add', async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(200).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
});

// Update an existing inventory item
router.put('/edit/:id', async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete an inventory item
router.delete('/delete/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;