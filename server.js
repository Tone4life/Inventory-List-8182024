import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import to use instead of __dirname
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
import { authMiddleware } from './routes/auth.js'; // Import JWT middleware
import { generateCsrfToken, verifyCsrfToken } from './middleware/csrf.js';  // Adjust the path as necessary
import session from 'express-session'; // Import session middleware
import { Server } from 'socket.io'; // Import Socket.IO

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Enforce HTTPS
app.use((req, res, next) => {
  const allowedHosts = ['yourdomain.com', 'www.yourdomain.com']; // Add your allowed hosts here

  // Check if the host is in the list of allowed hosts
  const host = req.headers.host.split(':')[0]; // Ignore port number
  if (!allowedHosts.includes(host)) {
    return res.status(400).send('Invalid Host');
  }

  // Ensure the protocol is HTTPS
  if (req.protocol === 'http') {
    return res.redirect(`https://${host}${req.url}`);
  }
  
  next();
});

// Middleware setup
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "https://apis.google.com"],
            "style-src": ["'self'", "https://stackpath.bootstrapcdn.com"],
            "img-src": ["'self'", "data:"],
        },
    },
    xssFilter: true,  // XSS protection
    noSniff: true,    // Prevent MIME-type sniffing
    referrerPolicy: { policy: 'same-origin' }  // Same-origin referrer policy
}));

// Add HSTS (HTTP Strict Transport Security) below helmet
app.use(helmet.hsts({
  maxAge: 31536000, // Enforce HTTPS for one year
  includeSubDomains: true, // Apply to subdomains
  preload: true // Preload list for major browsers
}));

app.use(cookieParser());

// Secure Cookie Settings
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,  // Only transmit over HTTPS
      httpOnly: true, // Prevent access by JavaScript
      sameSite: 'Strict', // Prevent CSRF
    },
  })
);

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to generate CSRF token and pass it to the frontend
app.use(generateCsrfToken);

// Use the verifyCsrfToken middleware for routes handling sensitive data
app.post('/submit_form', verifyCsrfToken, (req, res) => {
    // Handle the form submission after CSRF verification
    res.send('Form submitted successfully');
});

// Adjust Morgan logging level based on environment
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'));  // Less verbose logging in production
} else {
    app.use(morgan('combined'));  // Detailed logging in development
}

// Serve static assets from 'client/build' directory
app.use(express.static(path.join(__dirname, 'client', 'build')));

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Rate limiting
const formRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: 'Too many form submissions, please try again later.'
});

// Apply rate limiter only to sensitive routes
app.use('/submit_form', formRateLimiter);

// Global rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);  // Apply rate limiting globally

// Routes
app.use('/inventory', inventoryRoutes);
app.use('/user', userRoutes);
app.use('/submit_form', submitFormRoutes);
app.use('/', customParamRoutes);

app.get('/', (_req, res) => {
  res.send('Welcome to the public API!');
});

// Protected route using authMiddleware
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, _req, res) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Serve index.html for all client-side routes (for React Router)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// Start the server with HTTPS
const certPath = process.env.SSL_CERT_PATH;
const keyPath = process.env.SSL_KEY_PATH;
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

// Create HTTPS server
const server = https.createServer(options, app);

// Attach Socket.IO to the HTTPS server
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Listen for adding new items
  socket.on('addInventoryItem', async (itemData) => {
    const item = await addInventoryItem(itemData);
    io.emit('inventoryUpdated', await getInventoryItems());
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Listen on the HTTPS server
server.listen(port, () => {
  console.log(`HTTPS Server is running on port ${port}`);
});