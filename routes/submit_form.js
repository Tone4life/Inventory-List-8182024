import express from 'express';
import csrf from 'csurf';
import { sendEmail } from '../utils/email.js';

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router.post('/', csrfProtection, async (req, res) => {
    try {
        const { clientEmail, clientName } = req.body;

        // Process form and save to the database (if needed)...

        // Send confirmation email
        await sendEmail({
            to: clientEmail,
            subject: 'Inventory Form Submitted',
            html: `<p>Hi ${clientName}, your inventory form has been submitted successfully!</p>`
        });

        res.status(200).send('Form submitted and email sent!');
    } catch (error) {
        res.status(500).send('Error processing form or sending email.');
    }
});

export default router;