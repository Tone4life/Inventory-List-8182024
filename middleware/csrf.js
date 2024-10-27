import csrf from 'csrf';

const csrfProtection = new csrf();  // Create a CSRF instance
const csrfSecret = csrfProtection.secretSync();  // Create a secret token for the session

export const generateCsrfToken = (res, next) => {
    // Generate a CSRF token and store it in res.locals
    const token = csrfProtection.create(csrfSecret);
    res.locals.csrfToken = token;  // Pass this to the frontend
    next();
};

export const verifyCsrfToken = (req, res, next) => {
    const token = req.body._csrf;  // Get CSRF token from form submission
    const isValid = csrfProtection.verify(csrfSecret, token);

    if (!isValid) {
        return res.status(403).send('Invalid CSRF token');
    }
    next();
};