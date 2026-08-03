import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { User, Lock, CreditCard, ShieldAlert, Check } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { user, updateProfile, cancelSubscription, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile forms
  const [profileName, setProfileName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // No password state needed — authentication is handled by Google OAuth

  // Danger Dialog actions
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileSuccess('');
    updateProfile(profileName, avatarUrl || undefined);
    setProfileSuccess('Profile details successfully updated.');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  // Password management not applicable — account uses Google Sign-In

  const handleCancelSub = () => {
    if (window.confirm('Are you sure you want to cancel your Pro subscription? You will lose access to premium templates.')) {
      cancelSubscription();
    }
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    setDeleteConfirmOpen(false);
  };

  const mockAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  ];

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your account preferences, credentials, and billing choices.</p>
      </header>

      <div className="settings-container">
        {/* Navigation Sidebar */}
        <aside className="settings-sidebar glassmorphism">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} /> <span>Edit Profile</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Lock size={16} /> <span>Google Account</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard size={16} /> <span>Billing & Sub</span>
          </button>
          <button 
            className={`tab-btn danger-tab ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            <ShieldAlert size={16} /> <span>Danger Zone</span>
          </button>
        </aside>

        {/* Content Body */}
        <main className="settings-body glassmorphism">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="tab-pane">
              <h3>Profile Settings</h3>
              <p className="pane-desc">Manage your public information and avatar thumbnail.</p>
              
              {profileSuccess && <div className="settings-alert success">{profileSuccess}</div>}

              <form onSubmit={handleUpdateProfile} className="settings-form">
                <div className="avatar-picker-section">
                  <label>Select Profile Picture</label>
                  <div className="avatar-row">
                    {mockAvatars.map((url, i) => (
                      <button 
                        type="button" 
                        key={i} 
                        className={`avatar-choice ${avatarUrl === url ? 'selected' : ''}`}
                        onClick={() => setAvatarUrl(url)}
                      >
                        <img src={url} alt={`Avatar option ${i+1}`} />
                        {avatarUrl === url && <div className="avatar-check-badge"><Check size={10} /></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="p-name">Full Name</label>
                  <input 
                    type="text" 
                    id="p-name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="p-email">Email Address (Read Only)</label>
                  <input 
                    type="email" 
                    id="p-email"
                    value={user?.email || ''}
                    disabled
                    className="disabled-field"
                  />
                </div>

                <button type="submit" className="glow-btn save-settings-btn">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* GOOGLE ACCOUNT TAB */}
          {activeTab === 'password' && (
            <div className="tab-pane">
              <h3>Google Account</h3>
              <p className="pane-desc">Your account is secured and managed via Google Sign-In. No password is stored by ResuAI.</p>

              <div className="billing-status-box" style={{ marginTop: '1.5rem' }}>
                <div className="billing-status-header">
                  <div>
                    <p className="sub-type">Linked Google Account</p>
                    <h4 className="plan-name">{user?.name || 'Google User'}</h4>
                  </div>
                  <span className="status-badge pro" style={{ background: 'rgba(66,133,244,0.15)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.3)' }}>GOOGLE</span>
                </div>
                <hr className="billing-divider" />
                <div className="billing-status-details">
                  <div className="detail-row">
                    <span>Email</span>
                    <strong>{user?.email || '—'}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Auth Method</span>
                    <strong>Google OAuth 2.0</strong>
                  </div>
                  <div className="detail-row">
                    <span>Password</span>
                    <strong>Managed by Google</strong>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--muted-text)', lineHeight: 1.5 }}>
                To change your password or manage account security, visit <a href="https://myaccount.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>myaccount.google.com</a>.
              </p>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="tab-pane">
              <h3>Subscription & Billing</h3>
              <p className="pane-desc">Inspect your currently active subscription level, billing dates, and invoices.</p>

              <div className="billing-status-box">
                <div className="billing-status-header">
                  <div>
                    <p className="sub-type">Current License</p>
                    <h4 className="plan-name">{user?.isPro ? 'Pro Subscription' : 'Free License'}</h4>
                  </div>
                  <span className={`status-badge ${user?.isPro ? 'pro' : 'free'}`}>
                    {user?.isPro ? 'PRO ACTIVE' : 'FREE VERSION'}
                  </span>
                </div>

                <hr className="billing-divider" />

                <div className="billing-status-details">
                  {user?.isPro ? (
                    <>
                      <div className="detail-row">
                        <span>Billing Cycle</span>
                        <strong>Annual Billing</strong>
                      </div>
                      <div className="detail-row">
                        <span>Renewal Date</span>
                        <strong>{user.subscriptionRenewal || 'N/A'}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Included Features</span>
                        <strong>Unlimited Resumes, AI helper, cover letters</strong>
                      </div>
                      <button className="cancel-sub-btn" onClick={handleCancelSub}>
                        Cancel Subscription
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="billing-pitch">
                        Upgrade to Pro to unlock premium resume designs, ATS auditing scores, and auto-generated AI points.
                      </p>
                      <button className="glow-btn" onClick={() => window.location.href = '/pricing'}>
                        Upgrade Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && (
            <div className="tab-pane">
              <h3 className="danger-text">Danger Zone</h3>
              <p className="pane-desc">Irreversible account actions. Please be extremely careful.</p>

              <div className="danger-zone-box">
                <div className="danger-row">
                  <div>
                    <h4>Delete Account</h4>
                    <p>Permanently delete your profile and erase all saved resumes, cover letters, and subscriptions. This action is irreversible.</p>
                  </div>
                  <button className="danger-action-btn" onClick={() => setDeleteConfirmOpen(true)}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION DIALOG */}
      <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Your Account Permanently?"
        size="sm"
        actions={
          <>
            <button className="cancel-btn" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </button>
            <button className="danger-btn glow-btn" onClick={handleDeleteAccount}>
              Permanently Delete
            </button>
          </>
        }
      >
        <p>This is irreversible. Your profile and all generated resume documents in our databases will be completely erased. Are you absolutely sure?</p>
      </Dialog>
    </div>
  );
};
