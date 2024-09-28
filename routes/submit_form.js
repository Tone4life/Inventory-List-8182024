router.post(
  '/',
  csrfProtection,
  [
    body('clientEmail').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('clientName').trim().escape().isLength({ min: 1 }).withMessage('Name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { clientEmail, clientName } = req.body;

      // Process form and save to the database (if needed)...

      // Send confirmation email
      await sendEmail({
        to: clientEmail,
        subject: 'Inventory Form Submitted',
        html: `<p>Hi ${clientName}, your inventory form has been submitted successfully!</p>`,
      });

      res.status(200).send('Form submitted and email sent!');
    } catch (error) {
      console.error('Error processing form or sending email:', error); // Detailed logging
      res.status(500).send('Error processing form or sending email.');
    }
  }
);
