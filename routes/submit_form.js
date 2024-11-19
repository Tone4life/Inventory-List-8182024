import express from 'express';
import { body, validationResult } from 'express-validator';
import csrf from 'csurf';
import axios from 'axios';
import InventorySubmission from '../models/crmModel.js'; // Correct import path
import { sendEmail } from '../utils/email.js'; // Assuming you have an email utility
import { jsPDF } from 'jspdf'; // Import jsPDF
import docusign from 'docusign-esign'; // Import docusign-esign
import PDFDocument from 'pdfkit';

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
  tv: 40,
  piano: 300
  // Add more items as needed
};

// Helper functions for CWT and rate calculation
function calculateCWT(inventoryItems) {
  if (!Array.isArray(inventoryItems)) {
    throw new Error('Expected an array of inventory items');
  }
  let totalWeight = 0;
  inventoryItems.forEach(item => {
    totalWeight += item.weight; // Assume each item has a predefined weight
  });
  return Math.ceil(totalWeight / 100); // Convert to CWT
}

function calculateLocalEstimate(hourlyRate, hours, fuelSurcharge) {
  return (hourlyRate * hours) + fuelSurcharge;
}

function calculateLongDistanceEstimate(cwt, mileage, fuelSurcharge) {
  const ratePerCWT = getRateForMileage(mileage);
  return (ratePerCWT * cwt) + fuelSurcharge;
}

function getRateForMileage(mileage) {
  // Placeholder function to get rate per CWT based on mileage
  return mileage * 0.5; // Example rate calculation
}

// Utility functions for moving cost calculation
async function calculateMovingCost(origin, destination, inventory) {
  const totalWeight = inventory.reduce((acc, item) => acc + item.weight, 0);
  const distance = await getDistanceFromGoogleMaps(origin, destination); // Google Maps API

  const RATE_PER_POUND = 0.5; // Example rate per pound per kilometer
  const cost = distance * totalWeight * RATE_PER_POUND;
  return cost;
}

async function getDistanceFromGoogleMaps(origin, destination) {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
  const distance = response.data.rows[0].elements[0].distance.value / 1000; // Kilometers
  return distance;
}

// Function to generate PDF
function generatePDF(quoteDetails) {
  const doc = new jsPDF();
  doc.text('Estimate Summary', 10, 10);
  doc.text(`Total Cost: $${quoteDetails.totalCost}`, 10, 20);
  doc.save('estimate.pdf');
  return doc.output('arraybuffer'); // Return the PDF as an array buffer
}

// Function to generate move document using PDFKit
function generateMoveDocument(data) {
  const doc = new PDFDocument();
  doc.fontSize(16).text('Move Details', { align: 'center' });
  doc.text(`Client Name: ${data.clientName}`);
  doc.text(`Estimated Cost: ${data.estimatedCost}`);
  // Continue adding details as needed
  return doc;
}

// Function to send envelope via DocuSign
async function sendEnvelope(quotePDF, clientEmail) {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath('https://demo.docusign.net/restapi');
  apiClient.addDefaultHeader('Authorization', 'Bearer YOUR_ACCESS_TOKEN');

  const envelope = new docusign.EnvelopeDefinition();
  envelope.emailSubject = "Please sign your estimate";

  const doc = new docusign.Document();
  doc.documentBase64 = Buffer.from(quotePDF).toString('base64');
  doc.name = 'Estimate.pdf';
  doc.fileExtension = 'pdf';
  doc.documentId = '1';
  envelope.documents = [doc];

  const signer = new docusign.Signer();
  signer.email = clientEmail;
  signer.name = 'Client Name';
  signer.recipientId = '1';

  const signHere = new docusign.SignHere();
  signHere.documentId = '1';
  signHere.pageNumber = '1';
  signHere.recipientId = '1';
  signHere.xPosition = '100';
  signHere.yPosition = '100';

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  envelope.recipients = new docusign.Recipients();
  envelope.recipients.signers = [signer];

  const envelopesApi = new docusign.EnvelopesApi(apiClient);
  const results = await envelopesApi.createEnvelope('YOUR_ACCOUNT_ID', {
    envelopeDefinition: envelope,
  });

  console.log(`Envelope sent! Envelope ID: ${results.envelopeId}`);
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
      if (!Array.isArray(furnitureItems) || furnitureItems.length === 0) {
        return res.status(400).json({ error: 'Furniture items are required and must be an array.' });
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
      const totalCwt = calculateCWT(totalWeight);
      const totalTransportationCharge = calculateLongDistanceEstimate(totalCwt, parseFloat(ratePerCwt));

      // Send a response back with the calculation results
      res.status(200).json({
        estimatedCost: totalTransportationCharge,
        totalWeight,
        totalCwt,
        message: 'Calculation successful.'
      });

      // Generate PDF
      generatePDF({ totalCost: totalTransportationCharge });

      // Optionally, send confirmation email
      await sendEmail({
        to: 'Toney@exceptional1movers.com',  // Your email to receive CWT info
        subject: `CWT Calculation for ${clientName}`,
        html: `<p>Inventory submitted by ${clientName}:</p>
               <p><strong>Total Weight:</strong> ${totalWeight} lbs</p>
               <p><strong>Total CWT:</strong> ${totalCwt} CWT</p>
               <p><strong>Furniture Items:</strong> ${furnitureItems.join(', ')}</p>`,
      });

    } catch (error) {
      console.error('Error processing form:', error);
      res.status(500).send('Error processing form.');
    }
  }
);

// New route for inventory submission
router.post('/submit-inventory', async (req, res) => {
  try {
    const { clientId, inventoryItems } = req.body;
    await InventorySubmission.create({ clientId, inventoryItems });
    res.status(200).json({ message: 'Inventory submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting inventory' });
  }
});

export default router;