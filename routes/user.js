import express from 'express';
import { User } from '../models/User.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// User Authentication Route (if you need one)
router.post('/auth', async (req, res) => {
    const { token } = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Other user-related routes can be added here (e.g., registration, login, etc.)

// Example: GET all users (can be removed if unnecessary)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});

export default router;