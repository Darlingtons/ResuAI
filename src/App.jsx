import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { ThemeProvider } from './context/themeContext';
import { ResumeProvider } from './context/resumeContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { BuilderPage } from './pages/BuilderPage';
import { AtsCheckerPage } from './pages/AtsCheckerPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { PricingPage } from './pages/PricingPage';
import { SettingsPage } from './pages/SettingsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ErrorPage } from './pages/ErrorPage';
import { ErrorBoundary } from './components/ErrorBoundary';

// Route Protector Gate
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return children;
};

// Layout Wrapper
const StandardLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <ResumeProvider>
            <ErrorBoundary>
              <Routes>
                {/* Pages with standard navbar and footer */}
                <Route path="/" element={<StandardLayout><LandingPage /></StandardLayout>} />
                <Route path="/auth" element={<StandardLayout><AuthPages /></StandardLayout>} />
                <Route path="/ats-checker" element={<StandardLayout><AtsCheckerPage /></StandardLayout>} />
                <Route path="/cover-letter" element={<StandardLayout><CoverLetterPage /></StandardLayout>} />
                <Route path="/pricing" element={<StandardLayout><PricingPage /></StandardLayout>} />
                <Route path="/contact" element={<StandardLayout><ContactPage /></StandardLayout>} />
                <Route path="/privacy-policy" element={<StandardLayout><PrivacyPolicyPage /></StandardLayout>} />
                <Route path="/terms" element={<StandardLayout><TermsPage /></StandardLayout>} />
                <Route path="/refund-policy" element={<StandardLayout><RefundPolicyPage /></StandardLayout>} />
                <Route path="/error" element={<StandardLayout><ErrorPage /></StandardLayout>} />
                <Route path="/404" element={<StandardLayout><ErrorPage errorCode={404} /></StandardLayout>} />
              
              {/* Protected dashboard and settings pages */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <StandardLayout>
                      <DashboardPage />
                    </StandardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <StandardLayout>
                      <SettingsPage />
                    </StandardLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Resume builder full-screen page */}
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <BuilderPage />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback route */}
              <Route path="*" element={<StandardLayout><ErrorPage errorCode={404} /></StandardLayout>} />
            </Routes>
          </ErrorBoundary>
        </ResumeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
