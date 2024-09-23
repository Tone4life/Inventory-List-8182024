import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { User } from './models/User';
import { Inventory } from './models/Inventory';
import { InventoryItem } from './models/InventoryItem';
import { sendEmail } from './utils/email';
import { validateInventoryItem } from './utils/validateInventoryItem.js';
import connectDB from './utils/dbConfig.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve()));

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});
app.use(rateLimiter);

// Custom middleware for authentication
app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        User.findOne({ token }, (err, user) => {
            if (err) {
                return res.status(500).send('Server error');
            }
            if (!user) {
                return res.status(401).send('Unauthorized');
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Custom regular expression for route parameters
const customParamRegex = /^[a-zA-Z0-9_]+$/;

app.param('customParam', (req, res, next, value) => {
    if (customParamRegex.test(value)) {
        next();
    } else {
        res.status(400).send('Invalid parameter');
    }
});

// Connect to MongoDB
connectDB();

// Routes
app.post('/submit_form', csrfProtection, async (req, res) => {
    try {
        const { clientEmail, clientName } = req.body;

        // Process form and save to the database...

        // Send confirmation email
        await sendEmail({
            to: clientEmail,
            subject: 'Inventory Form Submitted',
            html: `<p>Hi ${clientName}, your inventory form has been submitted successfully!</p>`
        });

        res.status(200).send('Form submitted and email sent!');
    } catch (error) {
        res.status(500).send('Error processing form or sending email.');
    }
});

app.get('/inventory', async (req, res) => {
    try {
        const inventoryItems = await InventoryItem.find({});
        res.json(inventoryItems);
    } catch (error) {
        res.status(500).send('Error retrieving inventory items.');
    }
});

app.post('/inventory', csrfProtection, async (req, res) => {
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

app.put('/inventory/:id', csrfProtection, async (req, res) => {
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
});

app.delete('/inventory/:id', csrfProtection, async (req, res) => {
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
});

app.get('/:customParam', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Exceptional Movers Inventory List</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <link rel="stylesheet" href="style.css">
            <!-- Include Google Places API -->
            <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
            <!-- Bootstrap 5 CSS CDN -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <h1 class="text-center text-danger">Household Goods Moving Inventory List</h1>
                <div class="main-content">
                    <!-- Left Side: Personal Information -->
                    <div class="left-side">
                        <div class="step">
                            <h2>Step 1: Personal Information</h2>
                            <!-- Personal information fields -->
                            <div class="form-group">
                                <label for="clientName">Name:</label>
                                <input type="text" id="clientName" name="clientName" class="form-control">
                                <span id="clientName-error" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="origin">Origin Address <i class="fas fa-info-circle" title="Enter the address where the move will start."></i></label>
                                <input type="text" id="origin" name="origin" class="form-control">
                                <span id="origin-error" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="destination">Destination Address:</label>
                                <input type="text" id="destination" name="destination" class="form-control">
                                <span id="destination-error" class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="clientEmail">Email:</label>
                                <input type="email" id="clientEmail" name="clientEmail" class="form-control">
                                <span id="email-error" class="error-message"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Bootstrap 5 JS and Popper.js CDN (optional, for interactive components like modals or dropdowns) -->
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
        </body>
        </html>
    `);
});

app.post('/submit_form', csrfProtection, (req, res) => {
    res.send('Form data received');
});

app.use((err, _req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403);
        res.send('Invalid CSRF token');
    } else {
        next(err);
    }
});

// Load SSL paths from environment variables
const certPath = process.env.SSL_CERT_PATH;
const keyPath = process.env.SSL_KEY_PATH;

// HTTPS server options
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

// Start HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server is running on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;