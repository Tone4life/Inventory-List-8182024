import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming you have a User model
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // Assuming bcrypt is used for password hashing
import express from 'express';

dotenv.config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables');
}

// Middleware to protect routes and verify JWT
export const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (!token) {
        console.warn('Unauthorized access attempt without token'); // Warning log
        return res.status(401).send('Unauthorized');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded token data (user info) to the request
        next();
    } catch (error) {
        console.warn('Invalid or expired token'); // Warning log
        return res.status(403).send('Invalid or expired token');
    }
};

// Function to generate Access Token
function generateAccessToken(user) {
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
}

// Function to generate Refresh Token
function generateRefreshToken(user) {
    return jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ accessToken });
});

// Token Refresh Route
router.post('/token', async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.sendStatus(403);

    try {
        const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch {
        res.sendStatus(403);
    }
});

export default router;