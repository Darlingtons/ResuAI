import React from 'react';
import './PolicyPage.css';

export const PrivacyPolicyPage = () => {
  return (
    <div className="policy-page glassmorphism">
      <span className="last-updated">Last Updated: August 3, 2026</span>
      <h1>Privacy Policy</h1>
      
      <p>
        At ResuAI, accessible from our application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ResuAI and how we use it.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
      </p>
      <ul>
        <li><strong>Account Info:</strong> When you register for an Account, we may ask for your contact information, including items such as name, email address, and telephone number.</li>
        <li><strong>Resume Data:</strong> We store the resume details you input (work experience, education, skills, achievements) to allow you to load and edit them.</li>
        <li><strong>Payment Data:</strong> Payment processing is handled securely by Razorpay. We do not store your credit card or netbanking details directly on our servers.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect in various ways, including to:</p>
      <ul>
        <li>Provide, operate, and maintain our resume builder platform.</li>
        <li>Improve, personalize, and expand our application.</li>
        <li>Understand and analyze how you use our application.</li>
        <li>Develop new products, services, features, and functionality.</li>
        <li>Send you emails regarding account updates or support inquiries.</li>
        <li>Prevent fraud and secure payment processing.</li>
      </ul>

      <h2>3. Log Files & Data Security</h2>
      <p>
        ResuAI follows a standard procedure of using log files. These files log visitors when they use app services. We take industry-standard administrative and technical measures to protect your data stored in Google Firebase Firestore.
      </p>

      <h2>4. Contact Us</h2>
      <p>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at sumontagarai2971@gmail.com.
      </p>
    </div>
  );
};
