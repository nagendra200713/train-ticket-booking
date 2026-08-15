import React from 'react';
import { Train, Ticket, ShieldCheck, User, LogOut, LogIn, LayoutDashboard } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  bookingCount = 0
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div
          className="brand-logo"
          onClick={() => setActiveTab('search')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon-wrapper">
            <Train size={24} />
          </div>
          <div>
            RailYatri <span style={{ color: '#f59e0b' }}>Pro</span>
            <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#94a3b8', letterSpacing: '0px' }}>
              Indian Railways Reservation Portal
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Train size={18} />
            <span>Search & Book</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
            style={{ position: 'relative' }}
          >
            <Ticket size={18} />
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span
                style={{
                  background: '#f59e0b',
                  color: '#0f172a',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '2px'
                }}
              >
                {bookingCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Tab (Visible for Admin or general switch) */}
          <button
            className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => {
              if (user && user.role === 'admin') {
                setActiveTab('admin');
              } else {
                // If not admin, open auth modal pre-set to admin or navigate to admin
                setActiveTab('admin');
              }
            }}
          >
            <LayoutDashboard size={18} />
            <span>Admin Portal</span>
            <span className="admin-badge">Officer</span>
          </button>

          {/* Auth / User menu */}
          {user ? (
            <div className="user-profile-menu">
              <div className="user-avatar">
                {user.role === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: user.role === 'admin' ? '#f59e0b' : '#94a3b8' }}>
                  {user.role === 'admin' ? 'System Administrator' : 'Passenger'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="nav-btn"
                style={{ padding: '0.35rem 0.6rem', marginLeft: '0.5rem' }}
                title="Log out"
              >
                <LogOut size={16} color="#ef4444" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-search-primary"
              style={{
                margin: 0,
                height: '38px',
                padding: '0.4rem 1.1rem',
                fontSize: '0.88rem'
              }}
            >
              <LogIn size={16} />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
