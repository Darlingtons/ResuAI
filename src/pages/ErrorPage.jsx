import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import './ErrorPage.css';

export const ErrorPage = ({ errorCode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Determine error code from prop or query param (fallback to 404)
  const code = errorCode || parseInt(searchParams.get('code')) || 404;

  let title = "Page Not Found";
  let description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.";
  let Icon = AlertCircle;

  if (code === 500) {
    title = "Internal Server Error";
    description = "Something went wrong on our servers. Our engineering team has been notified. Please try again shortly.";
    Icon = AlertCircle;
  } else if (code === 403) {
    title = "Access Denied";
    description = "You do not have permission to access this page. Please log in with an authorized account.";
    Icon = AlertCircle;
  }

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="error-page-container">
      <div className="error-box glassmorphism">
        <div className="error-badge-container">
          <span className="error-code-badge">{code}</span>
        </div>
        
        <div className="error-icon-wrapper">
          <Icon size={64} className="error-main-icon" />
        </div>
        
        <h1 className="error-title">{title}</h1>
        <p className="error-desc">{description}</p>
        
        <div className="error-actions">
          {code === 500 ? (
            <button className="glow-btn error-btn" onClick={handleReload}>
              <RefreshCw size={16} /> Reload Page
            </button>
          ) : (
            <button className="glow-btn error-btn" onClick={() => navigate('/')}>
              <Home size={16} /> Go Home
            </button>
          )}
          
          <button className="secondary-cta-btn error-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>
          
          <button className="secondary-cta-btn error-btn" onClick={() => navigate('/contact')}>
            <HelpCircle size={16} /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
