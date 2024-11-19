import express from 'express';
import CRM from '../models/crmModel.js';
import { calculateQuote } from '../models/crmModel.js'; // Import the calculateQuote function

const router = express.Router();

// Get all CRM entries
router.get('/', async (req, res) => {
  try {
    const crmEntries = await CRM.find({});
    res.json(crmEntries);
  } catch (err) {
    res.status(500).send('Error retrieving CRM entries');
  }
});

// Add a new CRM entry
router.post('/add', async (req, res) => {
  try {
    const newEntry = new CRM(req.body);
    await newEntry.save();
    res.status(200).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add CRM entry' });
  }
});

// Update an existing CRM entry
router.put('/edit/:id', async (req, res) => {
  try {
    const updatedEntry = await CRM.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update CRM entry' });
  }
});

// Delete a CRM entry
router.delete('/delete/:id', async (req, res) => {
  try {
    await CRM.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'CRM entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete CRM entry' });
  }
});

// Endpoint for testing calculateQuote
router.post('/test-quote', calculateQuote, (req, res) => {
  res.json({ estimatedCost: req.body.estimatedCost });
});

export default router;