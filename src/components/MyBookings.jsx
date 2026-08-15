import React, { useState } from 'react';
import { Ticket, Printer, XCircle, Search, Calendar, MapPin, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { storageService } from '../services/storageService';

export const MyBookings = ({
  bookings,
  user,
  onViewTicket,
  onCancelSuccess
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cancellingPnr, setCancellingPnr] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Filter user bookings: if logged in as user, show their bookings; if admin or guest, show matching
  const userBookings = bookings.filter(b => {
    if (user && user.role !== 'admin') {
      // match user id or email
      return b.bookedBy?.id === user.id || b.bookedBy?.email === user.email;
    }
    return true; // show all for admin or preview
  });

  const filtered = userBookings.filter(b => {
    const matchesSearch =
      b.pnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainNumber?.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelClick = (booking) => {
    setCancellingPnr(booking);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (!cancellingPnr) return;
    const cancelled = storageService.cancelBooking(cancellingPnr.pnr);
    setShowCancelConfirm(false);
    setCancellingPnr(null);
    onCancelSuccess(cancelled, `Ticket with PNR ${cancellingPnr.pnr} has been cancelled successfully. Refund of ₹${cancelled.cancellationDetails.refundAmount} initiated.`);
  };

  return (
    <div className="main-content" style={{ marginTop: '2rem' }}>
      <div className="section-header">
        <div>
          <h2 className="section-title">My Booked Journeys & E-Tickets</h2>
          <p className="section-subtitle">
            View, print, download official tickets or cancel reservations with instant refund calculation
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          background: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} className="input-icon" style={{ left: '0.85rem' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by 10-digit PNR, Train Name or Train Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            All Bookings ({userBookings.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'CONFIRMED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('CONFIRMED')}
          >
            Confirmed
          </button>
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('CANCELLED')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}
        >
          <Ticket size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2b48', marginBottom: '0.5rem' }}>
            No Bookings Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            {searchTerm || statusFilter !== 'ALL'
              ? 'No tickets match your search filters.'
              : 'You have not booked any train tickets yet. Search for trains and book your seats!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((b) => (
            <div
              key={b.pnr}
              className="train-card"
              style={{
                borderLeft: `4px solid ${b.status === 'CONFIRMED' ? '#10b981' : '#ef4444'}`,
                marginBottom: 0
              }}
            >
              <div className="train-card-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="train-number-badge">{b.trainNumber}</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2b48' }}>
                    {b.trainName}
                  </span>
                  <span
                    className={`status-badge ${b.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}`}
                  >
                    {b.status === 'CONFIRMED' ? '● CNF / CONFIRMED' : '● CANCELLED'}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    PNR NUMBER
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: '#0f2b48' }}>
                    {b.pnr}
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div className="schedule-grid" style={{ marginBottom: '1rem' }}>
                <div className="time-station">
                  <span className="station-time">{b.departureTime}</span>
                  <span className="station-name">{b.boardingStationName || b.fromStation}</span>
                  <span className="station-code">Origin Station ({b.fromStation})</span>
                </div>

                <div className="duration-line">
                  <span className="duration-text">{b.journeyDate}</span>
                  <div className="line-visual" />
                  <span className="distance-tag">Class: <strong>{b.travelClass}</strong> ({b.quota || 'General'})</span>
                </div>

                <div className="time-station" style={{ textAlign: 'right' }}>
                  <span className="station-time">{b.arrivalTime}</span>
                  <span className="station-name">{b.droppingStationName || b.toStation}</span>
                  <span className="station-code">Destination ({b.toStation})</span>
                </div>
              </div>

              {/* Passenger Summary & Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.85rem',
                  borderTop: '1px dashed #e2e8f0',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                    <strong>Passengers ({b.passengers ? b.passengers.length : 1}):</strong>{' '}
                    {b.passengers?.map((p) => `${p.name} (Seat ${p.berth})`).join(', ')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Total Paid: <strong>₹{b.totalFare?.toLocaleString()}</strong> via {b.paymentMode}
                  </div>
                  {b.cancellationDetails && (
                    <div style={{ fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700, marginTop: '2px' }}>
                      Refund: ₹{b.cancellationDetails.refundAmount} (Cancelled on {b.cancellationDetails.cancelledAt})
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-book-now"
                    style={{
                      background: '#0f2b48',
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem'
                    }}
                    onClick={() => onViewTicket(b)}
                  >
                    <Printer size={16} />
                    <span>View / Print E-Ticket</span>
                  </button>

                  {b.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      className="btn-book-now"
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fca5a5',
                        padding: '0.5rem 1rem',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => handleCancelClick(b)}
                    >
                      <XCircle size={16} />
                      <span>Cancel Ticket</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && cancellingPnr && (
        <div className="modal-overlay" onClick={() => setShowCancelConfirm(false)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: '#b91c1c' }}>
                <ShieldAlert size={22} color="#b91c1c" />
                <span>Confirm Ticket Cancellation</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowCancelConfirm(false)}>
                <XCircle size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1rem' }}>
                Are you sure you want to cancel the booking for PNR <strong>{cancellingPnr.pnr}</strong> ({cancellingPnr.trainName})?
              </p>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span>Total Amount Paid:</span>
                  <strong>₹{cancellingPnr.totalFare}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#b91c1c' }}>
                  <span>Cancellation Deduction (15% + ₹60):</span>
                  <span>- ₹{(Math.min(cancellingPnr.totalFare * 0.15 + 60, cancellingPnr.totalFare)).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #cbd5e1', fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>
                  <span>Refund to be Credited:</span>
                  <span>₹{Math.max(0, cancellingPnr.totalFare - Math.min(cancellingPnr.totalFare * 0.15 + 60, cancellingPnr.totalFare)).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="filter-pill"
                  style={{ flex: 1, padding: '0.75rem', textAlign: 'center', justifyContent: 'center' }}
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Booking
                </button>

                <button
                  type="button"
                  className="btn-search-primary"
                  style={{ flex: 1, margin: 0, background: '#ef4444', height: '42px', padding: '0.5rem' }}
                  onClick={handleConfirmCancel}
                >
                  <span>Yes, Cancel & Refund</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
