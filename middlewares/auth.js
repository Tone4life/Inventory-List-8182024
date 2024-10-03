import jwt from 'jsonwebtoken';
import User from '../models/User'; // Assuming you have a User model
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
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

// Function to generate JWT with expiration
export const generateToken = (user) => {
    const expiresIn = '1h'; // Token expires in 1 hour (can be adjusted)

    return jwt.sign(
        { id: user._id, email: user.email }, // Payload with user details
        JWT_SECRET,                          // Secret key to sign the token
        { expiresIn }                        // Token expiry time
    );
};

// Example of logging in and generating a JWT token
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find user by email and validate password (assuming bcrypt for hashing)
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a token
    const token = generateToken(user);

    // Send the token to the client
    res.json({
        message: 'Login successful',
        token,  // Return the JWT token
    });
};