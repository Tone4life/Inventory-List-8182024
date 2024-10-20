import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './utils/dbConfig.js';
import inventoryRoutes from './routes/inventory.js';
import userRoutes from './routes/user.js';
import submitFormRoutes from './routes/submit_form.js';
import customParamRoutes from './routes/customParam.js';
import csrf from 'csurf';
import { authMiddleware } from './routes/auth.js';
import { generateCsrfToken, verifyCsrfToken } from './middleware/csrf.js';
import crmRoutes from './routes/crm.js'; // Add CRM routes
import inventoryItemsRoutes from './routes/inventoryItems.js'; // Add InventoryItems routes


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const csrfProtection = csrf({ cookie: true });
const port = process.env.PORT || 3000;

// Define rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limit to all requests
app.use(limiter);

// Middleware setup
app.use(helmet({ contentSecurityPolicy: { useDefaults: true } }));
app.use(cookieParser());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CSRF Protection
app.post('/submit_form', csrfProtection, verifyCsrfToken, (req, res) => {
    res.send('Form submitted successfully');
});


// Logging setup
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'));
} else {
    app.use(morgan('combined'));
}

// Static assets and routes
app.use('/inventory', csrfProtection, inventoryRoutes);
app.use('/user', csrfProtection, userRoutes);
app.use('/submit_form', csrfProtection, submitFormRoutes);
app.use('/', csrfProtection, customParamRoutes);
app.use('/crm', csrfProtection, crmRoutes); // Add CRM routes
app.use('/crm', crmRoutes); // Add CRM routes
app.use('/inventoryItems', inventoryItemsRoutes); // Add InventoryItems routes

// Error handling middleware (Fixed)
app.use((err, _req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// Generate CSRF token and send it to client-side 
app.get('/csrf-token', generateCsrfToken);

// Serve React frontend
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Connect to the database and start the server
connectDB().then(() => {
  const certPath = process.env.SSL_CERT_PATH;
  const keyPath = process.env.SSL_KEY_PATH;
  const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
  };

  https.createServer(options, app).listen(port, () => {
      console.log(`HTTPS Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database', err);
});

// Start HTTPS server
const certPath = process.env.SSL_CERT_PATH;
const keyPath = process.env.SSL_KEY_PATH;
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
};

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server is running on port ${port}`);
});
