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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined'));

const csrfProtection = csrf({ cookie: true });
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve()));

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Apply rate limiter to all requests
app.use(rateLimiter);

app.get('/', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.join(path.resolve(), 'index.html'));
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