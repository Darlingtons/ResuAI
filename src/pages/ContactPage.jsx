import React from 'react';
import './PolicyPage.css';

export const ContactPage = () => {
  return (
    <div className="policy-page glassmorphism">
      <span className="gradient-text last-updated">GET IN TOUCH</span>
      <h1>Contact Us</h1>
      <p>
        If you have any questions, feedback, or support requests regarding your ResuAI account or Pro subscription, please feel free to reach out to us. We aim to respond to all inquiries within 24–48 hours.
      </p>

      <div className="contact-grid">
        <div className="contact-card">
          <h3>Email Support</h3>
          <p>sumontagarai2971@gmail.com</p>
        </div>
        <div className="contact-card">
          <h3>Operating Hours</h3>
          <p>Monday - Friday: 9 AM - 6 PM IST</p>
        </div>
        <div className="contact-card">
          <h3>Support Location</h3>
          <p>Kolkata, West Bengal, India</p>
        </div>
      </div>
    </div>
  );
};
