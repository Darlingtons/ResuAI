import React from 'react';
import './PolicyPage.css';

export const RefundPolicyPage = () => {
  return (
    <div className="policy-page glassmorphism">
      <span className="last-updated">Last Updated: August 3, 2026</span>
      <h1>Cancellation & Refund Policy</h1>

      <p>
        Thank you for choosing ResuAI. We want you to be completely satisfied with our resume builder. Please read our cancellation and refund guidelines below:
      </p>

      <h2>1. Cancellation Policy</h2>
      <ul>
        <li>You can cancel your ResuAI Pro subscription at any time.</li>
        <li>To cancel, simply go to your User Profile menu and select "Cancel Subscription", or email us directly.</li>
        <li>After cancellation, your account will remain Pro until the end of your current paid billing period, and no further charges will be made.</li>
      </ul>

      <h2>2. Refund Policy</h2>
      <ul>
        <li>We offer a **7-day money-back guarantee** on both our Monthly and Yearly Pro plans.</li>
        <li>If you are not satisfied with the premium features, you can request a full refund within **7 days** of your initial purchase date.</li>
        <li>To request a refund, please send an email to **sumontagarai2971@gmail.com** with your account details.</li>
        <li>Approved refunds will be processed securely via Razorpay and credited back to your original payment method within **5-7 business days**.</li>
      </ul>

      <h2>3. Late or Missing Refunds</h2>
      <p>
        If you haven't received a refund yet, first check your bank account again, then contact your credit card company or bank, as it may take some processing time before your refund is officially posted. If you've done all of this and still have not received your refund, please contact us.
      </p>
    </div>
  );
};
