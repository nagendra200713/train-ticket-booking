import React, { useState } from 'react';
import { X, User, ShieldCheck, Mail, Lock, Phone, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';

export const AuthModal = ({ isOpen, initialMode = 'login', onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState(initialMode); // 'user-login', 'user-register', 'admin-login'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'user-register') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields.');
        }
        const newUser = storageService.registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          role: 'user'
        });
        storageService.setActiveUser(newUser);
        onAuthSuccess(newUser, 'Account created successfully! Welcome aboard.');
        onClose();
      } else {
        // Login (User or Admin)
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        const user = storageService.loginUser(email, password);

        if (authMode === 'admin-login' && user.role !== 'admin') {
          throw new Error('This account does not have Railway Admin privileges.');
        }

        onAuthSuccess(user, `Welcome back, ${user.name}!`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@railways.gov.in');
      setPassword('admin123');
      const user = storageService.loginUser('admin@railways.gov.in', 'admin123');
      onAuthSuccess(user, 'Logged in as Railway Super Admin!');
      onClose();
    } else {
      setEmail('user@example.com');
      setPassword('user123');
      const user = storageService.loginUser('user@example.com', 'user123');
      onAuthSuccess(user, 'Logged in as Demo Passenger (Karthikeyan Raman)!');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            {authMode === 'admin-login' ? (
              <>
                <ShieldCheck size={22} color="#f59e0b" />
                <span>Railway Admin Access</span>
              </>
            ) : (
              <>
                <User size={22} color="#2563eb" />
                <span>{authMode === 'user-register' ? 'Create Passenger Account' : 'Passenger Login'}</span>
              </>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.75rem 1.25rem 0', gap: '0.5rem' }}>
          <button
            type="button"
            className={`filter-pill ${authMode === 'user-login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('user-login'); setError(''); }}
            style={{ textAlign: 'center', justifyContent: 'center' }}
          >
            User Login
          </button>
          <button
            type="button"
            className={`filter-pill ${authMode === 'user-register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('user-register'); setError(''); }}
            style={{ textAlign: 'center', justifyContent: 'center' }}
          >
            Register
          </button>
          <button
            type="button"
            className={`filter-pill ${authMode === 'admin-login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('admin-login'); setError(''); }}
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              borderColor: authMode === 'admin-login' ? '#f59e0b' : undefined,
              color: authMode === 'admin-login' ? '#f59e0b' : undefined
            }}
          >
            Admin 🔒
          </button>
        </div>

        {/* Quick Demo Credentials helper */}
        <div style={{ margin: '1rem 1.25rem 0', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#f59e0b" /> QUICK DEMO LOGINS (1-CLICK):
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              style={{
                flex: 1,
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.4rem',
                background: '#e0f2fe',
                color: '#0369a1',
                borderRadius: '6px'
              }}
            >
              👤 Passenger Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              style={{
                flex: 1,
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.4rem',
                background: '#fef3c7',
                color: '#b45309',
                borderRadius: '6px'
              }}
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ paddingTop: '1rem' }}>
          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}
            >
              {error}
            </div>
          )}

          {authMode === 'user-register' && (
            <div className="input-field-group" style={{ marginBottom: '1rem' }}>
              <label>Full Name *</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Karthik Raman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-field-group" style={{ marginBottom: '1rem' }}>
            <label>{authMode === 'admin-login' ? 'Admin Official Email' : 'Email Address'} *</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder={authMode === 'admin-login' ? 'admin@railways.gov.in' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {authMode === 'user-register' && (
            <div className="input-field-group" style={{ marginBottom: '1rem' }}>
              <label>Mobile Number (For SMS Updates)</label>
              <div className="input-wrapper">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98401 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-field-group" style={{ marginBottom: '1.25rem' }}>
            <label>Password *</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-search-primary"
            style={{ width: '100%', margin: 0 }}
            disabled={loading}
          >
            <span>
              {loading
                ? 'Verifying...'
                : authMode === 'user-register'
                ? 'Create My Account'
                : authMode === 'admin-login'
                ? 'Access Admin Dashboard'
                : 'Login to Continue'}
            </span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
