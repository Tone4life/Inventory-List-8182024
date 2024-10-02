// utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // or another email provider
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASSWORD // Your email password
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Receiver email
        subject, // Email subject
        html, // HTML content of the email
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
      break;
    } catch (error) {
      console.error('Error sending email, retrying...', error);
      attempt++;
      if (attempt === maxRetries) throw new Error('Email sending failed after 3 attempts');
    }
  }
};
