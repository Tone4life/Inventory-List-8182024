import express from 'express';
import { InventoryItem } from '../models/InventoryItem.js';
import { validateInventoryItem } from '../utils/validateInventoryItem.js';
import csrf from 'csurf';
import { body, validationResult } from 'express-validator';
import { addItem, removeItem, updateItem } from '../client/inventory.js'; // Adjust the import path as needed

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// GET: Retrieve all inventory items
router.get('/', async (req, res) => {
    try {
        const inventoryItems = await InventoryItem.find({});
        res.json(inventoryItems);
    } catch (error) {
        console.error('Error retrieving inventory items:', error); // Detailed logging
        res.status(500).send('Error retrieving inventory items.');
    }
});

// POST: Add a new inventory item
router.post(
  '/',
  csrfProtection,
  [
    body('name').trim().escape().isLength({ min: 1 }).withMessage('Item name is required'),
    body('description').optional().trim().escape(),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('origin').trim().escape().isLength({ min: 1 }).withMessage('Origin is required'),
    body('destination').trim().escape().isLength({ min: 1 }).withMessage('Destination is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const itemData = req.body;
    const validation = validateInventoryItem(itemData);

    if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
    }

    try {
        await addItem(itemData.room, itemData.name, itemData.quantity);
        const newItem = new InventoryItem(itemData);
        await newItem.save();
        res.status(200).send('Item added successfully');
    } catch (error) {
        console.error('Failed to add inventory item:', error); // Detailed logging
        res.status(500).send('Failed to add inventory item');
    }
  }
);

// PUT: Update an existing inventory item
router.put(
  '/:id',
  csrfProtection,
  [
    body('name').trim().escape().isLength({ min: 1 }).withMessage('Item name is required'),
    body('description').optional().trim().escape(),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('origin').trim().escape().isLength({ min: 1 }).withMessage('Origin is required'),
    body('destination').trim().escape().isLength({ min: 1 }).withMessage('Destination is required')
  ],
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const itemData = req.body;
    const validation = validateInventoryItem(itemData);

    if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
    }

    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(id, itemData, { new: true });
        if (!updatedItem) {
            return res.status(404).send('Item not found.');
        }
        res.json(updatedItem);
    } catch (error) {
        console.error('Failed to update inventory item:', error); // Detailed logging
        res.status(500).send('Failed to update inventory item');
    }
  }
);


// DELETE: Remove an inventory item
router.delete('/:id', csrfProtection, async (req, res) => {
  try {
      const { room, index } = req.body;
      await removeItem(room, index);
      await InventoryItem.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
      console.error('Failed to delete inventory item:', error); // Detailed logging
      res.status(500).send('Failed to delete inventory item');
  }
});

export default router;
