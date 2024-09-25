import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
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

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

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
app.use(cookieParser());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Adjust Morgan logging level based on environment
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'));  // Less verbose logging in production
} else {
    app.use(morgan('combined'));  // Detailed logging in development
}

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

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Serve static assets from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Wildcard route - must be placed after all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Start the server with HTTPS
const certPath = process.env.SSL_CERT_PATH;
const keyPath = process.env.SSL_KEY_PATH;
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Server is running on port ${port}`);
});

// Removed HTTP fallback server to enforce HTTPS only
