import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Check, ShieldCheck, Sparkles, CreditCard, Award, ArrowRight, Loader2 } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import './PricingPage.css';

export const PricingPage = () => {
  const { user, upgradeToPro } = useAuth();
  const navigate = useNavigate();
  
  const [isYearly, setIsYearly] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('success');

  const startCheckout = async () => {
    if (!user) {
      navigate('/auth?mode=signup');
      return;
    }

    if (!window.Razorpay) {
      alert("Payment gateway is still loading. Please try again in a few seconds.");
      return;
    }

    const price = isYearly ? 40 : 5;
    const amountInCents = price * 100;

    try {
      // 1. Get Secure Order ID from Backend
      const response = await fetch('http://localhost:3001/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents, currency: "USD" })
      });
      
      const order = await response.json();
      
      if (!response.ok) throw new Error(order.error || "Failed to create order");

      // 2. Open Razorpay Window
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id, // Secure Order ID!
        name: "ResuAI",
        description: isYearly ? "Pro Plan (Yearly)" : "Pro Plan (Monthly)",
        handler: async function (response) {
          // 3. Verify Signature Securely on the Backend
          const verifyRes = await fetch('http://localhost:3001/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              userId: user.id
            })
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            upgradeToPro();
            setPaymentStep('success');
            setCheckoutOpen(true);
          } else {
            alert("Payment Verification Failed! " + (verifyData.message || "Potential tampering detected."));
          }
        },

        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error initiating checkout: " + err.message);
    }
  };

  const handleFinishSuccess = () => {
    setCheckoutOpen(false);
    navigate('/dashboard');
  };

  const price = isYearly ? 40 : 5; // $40/year vs $5/month
  const savedAmt = isYearly ? 20 : 0; // save $20/year

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <span className="pricing-tag">Flexible Plans</span>
        <h2>Choose the Right Plan for Your Career</h2>
        <p>Invest in your career with professional templates and real-time AI optimization tools.</p>

        {/* Toggle billing */}
        <div className="billing-switch-container">
          <span className={!isYearly ? 'active-billing' : ''}>Monthly</span>
          <button 
            className={`billing-switch-btn ${isYearly ? 'yearly' : ''}`}
            onClick={() => setIsYearly(!isYearly)}
            aria-label="Toggle yearly billing"
          >
            <span className="billing-switch-slider"></span>
          </button>
          <span className={isYearly ? 'active-billing' : ''}>
            Yearly <span className="discount-tag">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="pricing-grid">
        {/* Free Plan */}
        <div className="pricing-card glassmorphism">
          <h3>Free Plan</h3>
          <p className="card-desc">Perfect to try out our standard editor capabilities.</p>
          <div className="price-display">
            <span className="currency">$</span>
            <span className="price-val">0</span>
            <span className="price-term">/ forever</span>
          </div>

          <button 
            className="cancel-btn pricing-card-btn" 
            onClick={() => navigate(user ? '/dashboard' : '/auth?mode=signup')}
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'}
          </button>

          <hr className="pricing-divider" />

          <ul className="plan-features">
            <li><Check size={16} className="check-icon" /> <span>1 Active Resume</span></li>
            <li><Check size={16} className="check-icon" /> <span>Classic Template Layout</span></li>
            <li><Check size={16} className="check-icon" /> <span>Basic Live Editor</span></li>
            <li><Check size={16} className="check-icon" /> <span>Standard Web PDF Download</span></li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card pro glassmorphism">
          <div className="pro-label">RECOMMENDED</div>
          <h3>Pro Plan</h3>
          <p className="card-desc">Designed to maximize callback rates with AI optimization.</p>
          <div className="price-display">
            <span className="currency">$</span>
            <span className="price-val">{price}</span>
            <span className="price-term">/ {isYearly ? 'year' : 'month'}</span>
          </div>

          {isYearly && <p className="yearly-save-note">Billed annually (${price}). You save ${savedAmt}!</p>}

          <button 
            className="glow-btn pricing-card-btn pro-btn" 
            onClick={startCheckout}
            disabled={user?.isPro}
          >
            {user?.isPro ? 'You are Subscribed' : 'Upgrade to Pro'}
          </button>

          <hr className="pricing-divider" />

          <ul className="plan-features">
            <li><Check size={16} className="check-icon" /> <span><strong>Unlimited</strong> Resumes</span></li>
            <li><Check size={16} className="check-icon" /> <span><strong>All 6</strong> Premium Templates</span></li>
            <li><Check size={16} className="check-icon" /> <span><strong>AI Bullet Optimizer</strong> (Contextual writing)</span></li>
            <li><Check size={16} className="check-icon" /> <span><strong>Real-time ATS Scorer</strong> & Audits</span></li>
            <li><Check size={16} className="check-icon" /> <span>AI Cover Letter Generator</span></li>
            <li><Check size={16} className="check-icon" /> <span>Custom Color Pickers & Fonts</span></li>
          </ul>
        </div>
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="comparison-section">
        <h3>Feature Comparison Matrix</h3>
        <div className="comparison-table-wrapper glassmorphism">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Features</th>
                <th>Free</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active Resumes</td>
                <td>1 Resume</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Classic Design Template</td>
                <td><Check size={16} className="green" /></td>
                <td><Check size={16} className="green" /></td>
              </tr>
              <tr>
                <td>Premium Templates (Modern, Minimal, Creative, Technical, Fresher)</td>
                <td>Locked</td>
                <td><Check size={16} className="green" /></td>
              </tr>
              <tr>
                <td>AI-Generated Section Bullets</td>
                <td>Locked</td>
                <td><Check size={16} className="green" /></td>
              </tr>
              <tr>
                <td>Cover Letter Generator</td>
                <td>Locked</td>
                <td><Check size={16} className="green" /></td>
              </tr>
              <tr>
                <td>Job ATS Scorer and Highlights</td>
                <td>Basic score</td>
                <td>Detailed recommendations</td>
              </tr>
              <tr>
                <td>Color Accent and Font switchers</td>
                <td>Default only</td>
                <td>Full personalization</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* RAZORPAY SUCCESS CHECKOUT DIALOG */}
      <Dialog 
        isOpen={checkoutOpen} 
        onClose={() => setCheckoutOpen(false)} 
        title="Payment Successful"
        size="sm"
      >

        {paymentStep === 'success' && (
          <div className="razorpay-success">
            <div className="success-icon-box">
              <Award size={48} />
            </div>
            <h4>Payment Successful!</h4>
            <p>Thank you! Your account has been successfully upgraded to ResuAI Pro. You now have unlimited access.</p>
            <button className="glow-btn finish-btn" onClick={handleFinishSuccess}>
              Proceed to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
};
