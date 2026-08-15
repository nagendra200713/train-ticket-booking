import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldAlert, Train, Calendar, Clock, MapPin } from 'lucide-react';
import { STATIONS } from '../data/stations';

export const TicketModal = ({ isOpen, booking, onClose }) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const fromStation = STATIONS.find(s => s.code === booking.fromStation) || { name: booking.fromStation, code: booking.fromStation };
  const toStation = STATIONS.find(s => s.code === booking.toStation) || { name: booking.toStation, code: booking.toStation };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '820px', background: 'transparent', boxShadow: 'none', border: 'none' }} onClick={(e) => e.stopPropagation()}>
        {/* Ticket Print Actions Top Bar (hidden on actual print) */}
        <div
          className="ticket-print-actions"
          style={{
            background: '#0f172a',
            padding: '0.85rem 1.25rem',
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <Train size={20} color="#f59e0b" />
            <span>Electronic Reservation Slip (ERS)</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-search-primary"
              style={{ margin: 0, height: '36px', padding: '0.35rem 1rem', fontSize: '0.85rem' }}
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>Print Ticket / Save PDF</span>
            </button>

            <button
              type="button"
              className="modal-close-btn"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Official Printable E-Ticket Container */}
        <div className="e-ticket-wrapper" id="printable-ticket">
          {/* Header Strip */}
          <div className="ticket-header-strip">
            <div>
              <div className="ticket-header-title">INDIAN RAILWAYS RESERVATION SLIP</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85, letterSpacing: '0.5px' }}>
                IRCTC E-TICKETING SERVICE • REGD OFFICE: NEW DELHI
              </div>
            </div>

            <div className="ticket-pnr-box">
              <div className="pnr-label">PNR NUMBER</div>
              <div className="pnr-val">{booking.pnr}</div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="ticket-body">
            {/* Status Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: booking.status === 'CONFIRMED' ? '#f0fdf4' : '#fee2e2',
                border: `1.5px solid ${booking.status === 'CONFIRMED' ? '#86efac' : '#fca5a5'}`,
                borderRadius: '8px',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {booking.status === 'CONFIRMED' ? (
                  <CheckCircle2 size={20} color="#15803d" />
                ) : (
                  <ShieldAlert size={20} color="#b91c1c" />
                )}
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: booking.status === 'CONFIRMED' ? '#15803d' : '#b91c1c' }}>
                    BOOKING STATUS: {booking.status}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Transaction ID: {booking.transactionId} • Booked On: {booking.bookingDate}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Class & Quota</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f2b48' }}>
                  {booking.travelClass} ({booking.quota || 'General'})
                </div>
              </div>
            </div>

            {/* Journey Grid */}
            <div className="ticket-route-box">
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b' }}>
                  Boarding Point / From
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2b48' }}>
                  {booking.boardingStationName || fromStation.name}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                  Code: {booking.fromStation} • Dept: {booking.departureTime}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                  {booking.journeyDate}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                  <span style={{ height: '2px', width: '30px', background: '#94a3b8', display: 'inline-block' }} />
                  <Train size={18} color="#0f2b48" />
                  <span style={{ height: '2px', width: '30px', background: '#94a3b8', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f2b48' }}>
                  Train: {booking.trainNumber}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b' }}>
                  Booking Point / To
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2b48' }}>
                  {booking.droppingStationName || toStation.name}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  Code: {booking.toStation} • Arr: {booking.arrivalTime}
                </div>
              </div>
            </div>

            {/* Passenger Manifest Table */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f2b48', marginBottom: '0.5rem' }}>
                PASSENGER DETAILS ({booking.passengers ? booking.passengers.length : 1} Passenger{booking.passengers?.length > 1 ? 's' : ''})
              </div>

              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Passenger Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Coach & Seat / Berth No</th>
                    <th>Berth Type</th>
                    <th>Booking Status</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.passengers && booking.passengers.map((p, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.age}</td>
                      <td>{p.gender}</td>
                      <td>
                        <span style={{ fontWeight: 800, color: '#0f2b48', fontFamily: 'var(--font-mono)' }}>
                          {booking.travelClass === 'CC' ? 'C1' : 'B1'} - {p.berth}
                        </span>
                      </td>
                      <td>{p.berthType || 'Standard'}</td>
                      <td>
                        <span style={{ color: booking.status === 'CONFIRMED' ? '#15803d' : '#b91c1c', fontWeight: 800 }}>
                          {booking.status === 'CONFIRMED' ? 'CNF' : 'CAN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fare & Refund Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>PAYMENT & FARE DETAILS:</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px' }}>
                  Payment Mode: <strong>{booking.paymentMode}</strong> • Base Fare: ₹{booking.baseFare} • GST: ₹{booking.gst}
                </div>
                {booking.cancellationDetails && (
                  <div style={{ marginTop: '6px', fontSize: '0.82rem', color: '#b91c1c', fontWeight: 700 }}>
                    Cancellation Charge: ₹{booking.cancellationDetails.cancellationCharge} • Refund Amount: ₹{booking.cancellationDetails.refundAmount} (Status: {booking.cancellationDetails.refundStatus})
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL TICKET FARE:</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f2b48' }}>
                  ₹{booking.totalFare?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* QR Code & Barcode Mock Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>IRCTC Digital Validation Code:</div>
                {/* Barcode representation */}
                <div style={{ display: 'flex', gap: '2px', height: '32px', alignItems: 'flex-end', marginTop: '4px' }}>
                  {[4,2,6,3,1,5,3,6,2,4,5,2,7,3,2,6,4,2,5,3,7,2,4,6,3,5,2,6,3,4].map((h, i) => (
                    <span key={i} style={{ width: `${(i % 3) + 1.5}px`, height: `${h * 4 + 8}px`, background: '#0f172a', display: 'inline-block' }} />
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  *{booking.pnr?.replace('-', '')}*
                </div>
              </div>

              <div className="ticket-qr-mock">
                {/* QR Code Graphic */}
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="30" height="30" fill="#0f2b48" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="#0f2b48" />
                  <rect x="65" y="5" width="30" height="30" fill="#0f2b48" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="#0f2b48" />
                  <rect x="5" y="65" width="30" height="30" fill="#0f2b48" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="#0f2b48" />
                  <circle cx="50" cy="50" r="6" fill="#f59e0b" />
                  <rect x="45" y="15" width="10" height="20" fill="#0f2b48" />
                  <rect x="75" y="45" width="15" height="15" fill="#0f2b48" />
                  <rect x="45" y="65" width="20" height="25" fill="#0f2b48" />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="ticket-footer-strip">
            <div>
              <strong>Important:</strong> Valid Photo ID proof (Aadhaar / Voter ID / Passport / Driving License) is mandatory during the journey.
            </div>
            <div>
              Railway Helpline: <strong>139</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
