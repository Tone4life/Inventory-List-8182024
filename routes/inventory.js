import express from 'express';
import { InventoryItem } from '../models/InventoryItem';
import { validateInventoryItem } from '../utils/validateInventoryItem.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// GET: Retrieve all inventory items
router.get('/', async (req, res) => {
    try {
        const inventoryItems = await InventoryItem.find({});
        res.json(inventoryItems);
    } catch (error) {
        res.status(500).send('Error retrieving inventory items.');
    }
});

// POST: Add a new inventory item
router.post('/', csrfProtection, async (req, res) => {
    const itemData = req.body;

    // Validate inventory item
    const validation = validateInventoryItem(itemData);
    if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
    }

    // Add item to inventory
    try {
        const newItem = new InventoryItem(itemData);
        await newItem.save();
        res.status(200).send('Item added successfully');
    } catch (error) {
        res.status(500).send('Failed to add inventory item');
    }
});

// PUT: Update an existing inventory item
router.put('/:id', csrfProtection, async (req, res) => {
    const { id } = req.params;
    const itemData = req.body;

    // Validate inventory item
    const validation = validateInventoryItem(itemData);
    if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
    }

    // Update item in inventory
    try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(id, itemData, { new: true });
        if (!updatedItem) {
            return res.status(404).send('Item not found.');
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).send('Failed to update inventory item');
    }

    if (!updatedItem) {
        return res.status(404).send('Item not found.');
    }
    
});

// DELETE: Remove an inventory item
router.delete('/:id', csrfProtection, async (req, res) => {
    const { id } = req.params;

    // Remove item from inventory
    try {
        const deletedItem = await InventoryItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Item not found.');
        }
        res.json(deletedItem);
    } catch (error) {
        res.status(500).send('Failed to delete inventory item');
    }

    if (!deletedItem) {
        return res.status(404).send('Item not found.');
    }
 
});

export default router;
