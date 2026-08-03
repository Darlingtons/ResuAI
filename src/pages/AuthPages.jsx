import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import {
  Sparkles, Mail, Lock, User as UserIcon, Phone,
  ArrowLeft, Loader2, AlertCircle, ShieldCheck, Eye, EyeOff,
} from 'lucide-react';
import './AuthPages.css';

const getFirebaseErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password must be at least 6 characters long.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential': return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-blocked': return 'Popup was blocked. Please allow popups and try again.';
    default: return 'Something went wrong. Please try again.';
  }
};

export const AuthPages = () => {
  const { signup, login, loginWithGoogle, forgotPassword, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'login';

  const [mode, setMode] = useState(modeParam);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    setMode(modeParam);
    setError('');
    setSuccess('');
  }, [modeParam]);

  // ─── Form Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw { code: 'custom', message: 'Please enter your full name.' };
        if (password.length < 6) throw { code: 'auth/weak-password' };
        if (password !== confirmPassword) throw { code: 'custom', message: 'Passwords do not match.' };
        await signup(name.trim(), email, phone, password);
        navigate('/dashboard');
      } else if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError(err.message && err.code === 'custom'
        ? err.message
        : getFirebaseErrorMessage(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result) navigate('/dashboard');
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLoginOrSignup = mode === 'login' || mode === 'signup';

  return (
    <div className="auth-page">
      <div className="auth-card glassmorphism">

        {/* Header */}
        <div className="auth-header">
          <Sparkles className="auth-logo-icon" size={28} />
          <h2>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="auth-subheader">
            {mode === 'login' && 'Sign in to access your resumes'}
            {mode === 'signup' && 'Fill in your details to get started for free'}
            {mode === 'forgot' && 'Enter your email to receive a reset link'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="auth-alert error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="auth-alert success">
            <AlertCircle size={15} />
            <span>{success}</span>
          </div>
        )}

        {/* ── FORM ── */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Full Name — signup only */}
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <UserIcon className="input-icon" size={15} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          {mode !== 'reset' && (
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={15} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          )}

          {/* Phone — signup only */}
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>Phone Number <span className="optional-label">(optional)</span></label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={15} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          {/* Password */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="auth-input-group">
              <label>{mode === 'signup' ? 'Create Password' : 'Password'}</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={15} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="show-pass-btn"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="pass-hint">Minimum 6 characters</p>
              )}
            </div>
          )}

          {/* Confirm Password — signup only */}
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={15} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Forgot password link */}
          {mode === 'login' && (
            <div className="forgot-password-link">
              <button type="button" onClick={() => navigate('/auth?mode=forgot')}>
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="glow-btn submit-btn" disabled={submitting}>
            {submitting
              ? <Loader2 className="spinner" size={18} />
              : mode === 'signup' ? 'Create Account'
              : mode === 'login' ? 'Sign In'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* ── OR DIVIDER + GOOGLE ── */}
        {isLoginOrSignup && (
          <>
            <div className="auth-divider"><span>or continue with</span></div>

            <div className="auth-google-section">
              <button
                className="google-oauth-btn"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                id="google-signin-btn"
              >
                {googleLoading ? (
                  <Loader2 className="spinner" size={18} />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
              <div className="auth-security-note">
                <ShieldCheck size={12} />
                <span>Secured by Firebase Authentication</span>
              </div>
            </div>
          </>
        )}

        {/* ── TOGGLE LOGIN / SIGNUP ── */}
        <div className="auth-toggle">
          {mode === 'login' && (
            <p>New to ResuAI?{' '}
              <button type="button" onClick={() => navigate('/auth?mode=signup')}>Sign up free</button>
            </p>
          )}
          {mode === 'signup' && (
            <p>Already have an account?{' '}
              <button type="button" onClick={() => navigate('/auth?mode=login')}>Sign in here</button>
            </p>
          )}
          {mode === 'forgot' && (
            <div className="back-to-login">
              <button type="button" onClick={() => navigate('/auth?mode=login')}>
                <ArrowLeft size={13} /> Back to Sign In
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
