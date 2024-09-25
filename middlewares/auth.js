// middlewares/auth.js
import { User } from '../models/User.js';  // Adjust the path if needed

export const authMiddleware = (req, res, next) => {
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
};
