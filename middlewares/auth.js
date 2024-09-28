export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        User.findOne({ token }, (err, user) => {
            if (err) {
                console.error('Server error during token lookup:', err); // Detailed logging
                return res.status(500).send('Server error');
            }
            if (!user) {
                console.warn('Unauthorized access attempt with token:', token); // Warning log
                return res.status(401).send('Unauthorized');
            }
            req.user = user;
            next();
        });
    } else {
        console.warn('Unauthorized access attempt without token'); // Warning log
        res.status(401).send('Unauthorized');
    }
};