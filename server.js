const express = require('express');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

app.get('/', csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit_form', rateLimiter.prevent, csrfProtection, (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});