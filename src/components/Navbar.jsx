import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/themeContext';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, Settings, FileText, CheckSquare, Sparkles } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glassmorphism no-print">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <Sparkles className="logo-icon" size={24} />
          <span className="gradient-text font-secondary">ResuAI</span>
        </Link>

        {/* Mobile menu toggle */}
        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active-link' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <a 
            href="/#templates" 
            className="nav-link"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                const el = document.getElementById('templates');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
              setMenuOpen(false);
            }}
          >
            <span className="flex-align"><FileText size={16} style={{ marginRight: '6px' }} /> Resume Builder</span>
          </a>
          <Link 
            to="/ats-checker" 
            className={`nav-link ${isActive('/ats-checker') ? 'active-link' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex-align"><CheckSquare size={16} /> ATS Checker</span>
          </Link>
          <Link 
            to="/cover-letter" 
            className={`nav-link ${isActive('/cover-letter') ? 'active-link' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex-align"><FileText size={16} /> Cover Letter</span>
          </Link>
          <Link 
            to="/pricing" 
            className={`nav-link ${isActive('/pricing') ? 'active-link' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </Link>

          {/* Theme Toggle Button */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Auth Buttons */}
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-profile-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
                ) : (
                  <div className="avatar-fallback">{user.name.charAt(0).toUpperCase()}</div>
                )}
                <span className="user-name-label">{user.name.split(' ')[0]}</span>
                {user.isPro && <span className="pro-badge">PRO</span>}
              </button>

              {dropdownOpen && (
                <div className="user-dropdown glassmorphism">
                  <div className="dropdown-header">
                    <p className="dropdown-username">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link 
                    to="/dashboard" 
                    className="dropdown-item" 
                    onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link 
                    to="/settings" 
                    className="dropdown-item" 
                    onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/auth?mode=login" 
                className="auth-btn login"
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                to="/auth?mode=signup" 
                className="auth-btn signup glow-btn"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
