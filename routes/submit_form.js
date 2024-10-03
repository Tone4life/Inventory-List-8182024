import express from 'express';
import { body, validationResult } from 'express-validator';
import csrf from 'csurf';
import axios from 'axios';
import { sendEmail } from '../utils/email.js'; // Assuming you have an email utility

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Predefined furniture weights (in pounds)
const furnitureWeights = {
  chair: 20,
  table: 50,
  sofa: 100,
  bed: 150,
  dresser: 80,
  bookshelf: 60,
  // Add more items as needed
};

// Helper functions for CWT and rate calculation
function calculateCwt(weight) {
  return weight / 100;
}

function calculateTransportationCharge(cwt, ratePerCwt) {
  return cwt * ratePerCwt;
}

// Example estimate functions (existing code)
function calculateLocalEstimate() {
  return 100; // Placeholder estimate
}

function calculateIntrastateEstimate() {
  return 200; // Placeholder estimate
}

async function calculateInterstateEstimate(origin, destination) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`
    );
    const distance = response.data.rows[0].elements[0].distance.value / 1000; // Distance in kilometers
    const baseRate = 1.2; // Example rate per kilometer
    return distance * baseRate;
  } catch (error) {
    console.error('Error fetching distance from Google Maps API:', error);
    return 0; // Return 0 in case of error
  }
}

// Update POST route for form submission
router.post(
  '/submit_form',
  csrfProtection,
  [
    body('clientEmail').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('clientName').trim().escape().isLength({ min: 1 }).withMessage('Name is required'),
    body('origin').trim().escape().isLength({ min: 1 }).withMessage('Origin address is required'),
    body('destination').trim().escape().isLength({ min: 1 }).withMessage('Destination address is required'),
    body('moveType').isIn(['local', 'intrastate', 'interstate']).withMessage('Invalid move type'),
    body('furnitureItems').isArray().withMessage('Furniture items must be an array'), // New validation
    body('ratePerCwt').isNumeric().withMessage('Rate per CWT must be a number'), // New validation
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { clientEmail, clientName, origin, destination, moveType, furnitureItems, ratePerCwt } = req.body;

      // Error handling for missing furniture items or rate
      if (!furnitureItems || furnitureItems.length === 0) {
        return res.status(400).json({ error: 'Furniture items are required.' });
      }

      if (!ratePerCwt) {
        return res.status(400).json({ error: 'Rate per CWT is required.' });
      }

      // Calculate total weight based on furniture items
      let totalWeight = 0;
      furnitureItems.forEach(itemName => {
        const lowerCaseItemName = itemName.toLowerCase();
        if (furnitureWeights[lowerCaseItemName]) {
          totalWeight += furnitureWeights[lowerCaseItemName];
        } else {
          totalWeight += 50; // Default weight for unknown items
        }
      });

      // Calculate total weight in CWT and transportation charge
      const totalCwt = calculateCwt(totalWeight);
      const totalTransportationCharge = calculateTransportationCharge(totalCwt, parseFloat(ratePerCwt));

      // Send a response back with the calculation results
      res.status(200).json({
        estimatedCost: totalTransportationCharge,
        totalWeight,
        totalCwt,
        message: 'Calculation successful.'
      });

      // Optionally, send confirmation email
      await sendEmail({
        to: clientEmail,
        subject: 'Inventory Form Submitted',
        html: `<p>Hi ${clientName}, your inventory form has been submitted successfully! The estimated cost is $${totalTransportationCharge}.</p>`,
      });

    } catch (error) {
      console.error('Error processing form:', error);
      res.status(500).send('Error processing form.');
    }
  }
);

export default router;