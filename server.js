require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(morgan('combined'));

const csrfProtection = csrf({ cookie: true });cd 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Apply rate limiter to all requests
app.use(rateLimiter);

app.get('/', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit_form', csrfProtection, (req, res) => {
    res.send('Form data received');
});

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403);
        res.send('Invalid CSRF token');
    } else {
        next(err);
    }
});

// Start HTTP server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});