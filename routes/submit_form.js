import express from 'express';
import { body, validationResult } from 'express-validator';
import csrf from 'csurf';
import axios from 'axios';
import { sendEmail } from '../utils/email.js'; // Assuming you have an email utility

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Example estimate functions
function calculateLocalEstimate() {
  // Simplified example: calculate based on a flat hourly rate
  return 100; // Placeholder estimate
}

function calculateIntrastateEstimate() {
  // Example: use a mix of hourly rate and distance
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

router.post(
  '/submit_form',
  csrfProtection,
  [
    body('clientEmail').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('clientName').trim().escape().isLength({ min: 1 }).withMessage('Name is required'),
    body('origin').trim().escape().isLength({ min: 1 }).withMessage('Origin address is required'),
    body('destination').trim().escape().isLength({ min: 1 }).withMessage('Destination address is required'),
    body('moveType').isIn(['local', 'intrastate', 'interstate']).withMessage('Invalid move type'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { clientEmail, clientName, origin, destination, moveType } = req.body;

      // Perform cost calculation based on moveType
      let estimatedCost = 0;
      if (moveType === 'local') {
        estimatedCost = calculateLocalEstimate();
      } else if (moveType === 'intrastate') {
        estimatedCost = calculateIntrastateEstimate();
      } else if (moveType === 'interstate') {
        estimatedCost = await calculateInterstateEstimate(origin, destination);
      }

      // Send a response back with the estimate
      res.status(200).json({ estimatedCost });

      // Optionally, send confirmation email or store data in the database
      await sendEmail({
        to: clientEmail,
        subject: 'Inventory Form Submitted',
        html: `<p>Hi ${clientName}, your inventory form has been submitted successfully! Your estimated cost is $${estimatedCost}.</p>`,
      });

    } catch (error) {
      console.error('Error processing form:', error);
      res.status(500).send('Error processing form.');
    }
  }
);

export default router;