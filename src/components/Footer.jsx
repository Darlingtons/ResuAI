import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer no-print">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Sparkles className="logo-icon" size={20} />
            <span className="gradient-text font-secondary">ResuAI</span>
          </Link>
          <p className="brand-tagline">
            Build high-performance, ATS-friendly resumes in minutes with intelligent auto-generation and templates.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Product</h4>
            <a href="/#templates">Resume Builder</a>
            <Link to="/ats-checker">ATS Scorer</Link>
            <Link to="/cover-letter">Cover Letters</Link>
            <Link to="/pricing">Pricing Plans</Link>
          </div>
          <div className="footer-column">
            <h4>Templates</h4>
            <Link to="/dashboard">Classic Layout</Link>
            <Link to="/dashboard">Modern Sidebar</Link>
            <Link to="/dashboard">Developer Slate</Link>
            <Link to="/dashboard">Fresher Minimal</Link>
          </div>
          <div className="footer-column">
            <h4>Support & Legal</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/refund-policy">Refund & Cancellation</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ResuAI. All rights reserved.</p>
        <p className="made-with">
          Made with <Heart size={14} className="heart-icon" /> for job seekers.
        </p>
      </div>
    </footer>
  );
};
