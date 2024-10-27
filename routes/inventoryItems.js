import express from 'express';
import InventoryItem from '../models/InventoryItems.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

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
router.post('/add', csrfProtection, async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(200).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
});

// Update an existing inventory item
router.put('/edit/:id', csrfProtection, async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete an inventory item
router.delete('/delete/:id', csrfProtection, async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;