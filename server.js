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
import authRoutes from './middleware/auth.js'; // Import the auth.js router
import { generateCsrfToken } from './middleware/csrf.js';
import crmRoutes from './routes/crm.js'; // Add CRM routes
import inventoryItemsRoutes from './routes/inventoryItems.js'; // Add InventoryItems routes
import { initSocket } from './utils/socket.js'; // Import initSocket

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
  message: 'You have exceeded the maximum number of requests. Please try again in 15 minutes.'
});

// Apply rate limit to all requests
app.use(limiter);

// Middleware setup
app.use(helmet({ contentSecurityPolicy: { useDefaults: true } }));
app.use(cookieParser());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging setup
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('tiny'));
} else {
  app.use(morgan('combined'));
}

// CSRF Protection
app.use(csrfProtection);

// Static assets and routes
app.use('/inventory', inventoryRoutes);
app.use('/user', userRoutes);
app.use('/submit_form', submitFormRoutes);
app.use('/', customParamRoutes);
app.use('/crm', crmRoutes); // Add CRM routes
app.use('/inventoryItems', inventoryItemsRoutes); // Add InventoryItems routes
app.use('/auth', authRoutes); // Use the auth.js router

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

  const server = https.createServer(options, app);

  // Initialize Socket.IO
  const io = initSocket(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle inventory updates
    socket.on('updateInventory', (data) => {
      console.log('Inventory update received:', data);
      io.emit('inventoryUpdated', data); // Broadcast the update to all connected clients
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  server.listen(port, () => {
    console.log(`HTTPS Server is running on https://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database', err);
});

// Export the app for testing
export const createServer = () => app;