import React, { useState } from 'react';
import { X, QrCode, CreditCard, Landmark, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePNR } from '../services/pnrService';
import { storageService } from '../services/storageService';
import { STATIONS } from '../data/stations';

export const PaymentModal = ({
  isOpen,
  bookingDraft,
  user,
  onClose,
  onBookingSuccess
}) => {
  if (!isOpen || !bookingDraft) return null;

  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('karthik@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9012');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [isProcessing, setIsProcessing] = useState(false);

  const { train, selectedClass, journeyDate, fromStation, toStation, passengers, baseFare, gst, reservationFee, totalFare } = bookingDraft;

  const fromStationObj = STATIONS.find(s => s.code === (fromStation || train.fromStation));
  const toStationObj = STATIONS.find(s => s.code === (toStation || train.toStation));

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const pnr = generatePNR();
      const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const bookingDateStr = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      let modeLabel = 'UPI (QR / GPay)';
      if (paymentMode === 'card') modeLabel = 'Debit / Credit Card';
      if (paymentMode === 'netbanking') modeLabel = `Net Banking (${selectedBank.split(' ')[0]})`;

      const newBooking = {
        pnr,
        bookingId,
        trainId: train.id,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        fromStation: fromStation || train.fromStation,
        toStation: toStation || train.toStation,
        boardingStationName: fromStationObj ? `${fromStationObj.name} (${fromStationObj.code})` : train.fromStation,
        droppingStationName: toStationObj ? `${toStationObj.name} (${toStationObj.code})` : train.toStation,
        journeyDate,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        travelClass: selectedClass,
        quota: 'General',
        passengers: passengers.map(p => ({
          ...p,
          status: 'CNF'
        })),
        farePerPassenger: bookingDraft.farePerPassenger,
        baseFare,
        gst,
        reservationFee,
        totalFare,
        status: 'CONFIRMED',
        bookingDate: bookingDateStr,
        paymentMode: modeLabel,
        transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`,
        bookedBy: {
          id: user ? user.id : 'usr_guest',
          name: user ? user.name : passengers[0]?.name || 'Passenger',
          email: user ? user.email : 'passenger@railways.gov.in'
        }
      };

      // Save to localStorage DB
      storageService.saveBooking(newBooking);

      setIsProcessing(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore confetti error if blocked
      }

      onBookingSuccess(newBooking);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck size={22} color="#10b981" />
            <span>IRCTC Secure Railway Payment Gateway</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={isProcessing}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Fare Summary */}
          <div className="fare-breakdown-card">
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f2b48', marginBottom: '0.75rem' }}>
              Booking Ticket Summary ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})
            </div>
            <div className="fare-row">
              <span>{train.trainNumber} - {train.trainName} ({selectedClass})</span>
              <span>{journeyDate}</span>
            </div>
            <div className="fare-row">
              <span>Base Fare</span>
              <span>₹{baseFare.toLocaleString()}</span>
            </div>
            <div className="fare-row">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="fare-row">
              <span>IRCTC Service & Reservation Fee</span>
              <span>₹{reservationFee}</span>
            </div>
            <div className="fare-row total">
              <span>Total Payable Amount</span>
              <span>₹{totalFare.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
              Choose Payment Method
            </label>
            <div className="payment-options-grid">
              <button
                type="button"
                className={`payment-tab-btn ${paymentMode === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMode('upi')}
              >
                <QrCode size={20} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                className={`payment-tab-btn ${paymentMode === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMode('card')}
              >
                <CreditCard size={20} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                className={`payment-tab-btn ${paymentMode === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMode('netbanking')}
              >
                <Landmark size={20} />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Payment Mode Details */}
          <form onSubmit={handlePayNow}>
            {paymentMode === 'upi' && (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f2b48', marginBottom: '0.5rem' }}>
                  Scan UPI QR Code (GPay / PhonePe / Paytm)
                </div>
                <div style={{ display: 'inline-block', padding: '10px', background: '#fff', border: '1.5px dashed #0f2b48', borderRadius: '8px', marginBottom: '0.75rem' }}>
                  {/* Mock QR SVG representation */}
                  <svg width="130" height="130" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="30" height="30" fill="#0f2b48" />
                    <rect x="15" y="15" width="20" height="20" fill="white" />
                    <rect x="20" y="20" width="10" height="10" fill="#0f2b48" />
                    <rect x="60" y="10" width="30" height="30" fill="#0f2b48" />
                    <rect x="65" y="15" width="20" height="20" fill="white" />
                    <rect x="70" y="20" width="10" height="10" fill="#0f2b48" />
                    <rect x="10" y="60" width="30" height="30" fill="#0f2b48" />
                    <rect x="15" y="65" width="20" height="20" fill="white" />
                    <rect x="20" y="70" width="10" height="10" fill="#0f2b48" />
                    <circle cx="50" cy="50" r="8" fill="#f59e0b" />
                    <rect x="50" y="60" width="15" height="15" fill="#0f2b48" />
                    <rect x="70" y="60" width="20" height="25" fill="#0f2b48" />
                    <rect x="50" y="20" width="5" height="25" fill="#0f2b48" />
                  </svg>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Or enter Virtual Payment Address (VPA / UPI ID):
                </div>
                <input
                  type="text"
                  className="form-input"
                  style={{ marginTop: '0.5rem', textAlign: 'center', paddingLeft: '0.85rem' }}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  required
                />
              </div>
            )}

            {paymentMode === 'card' && (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <div className="input-field-group" style={{ marginBottom: '0.85rem' }}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8901 2345 6789"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-field-group">
                    <label>Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      defaultValue="08/29"
                      required
                    />
                  </div>
                  <div className="input-field-group">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      defaultValue="782"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMode === 'netbanking' && (
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                  Select Bank
                </label>
                <select
                  className="form-select"
                  style={{ paddingLeft: '0.85rem' }}
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank (PNB)</option>
                  <option>Bank of Baroda</option>
                  <option>Indian Overseas Bank (IOB)</option>
                  <option>Canara Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="btn-search-primary"
              style={{ width: '100%', margin: 0, height: '48px' }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Processing Secure Railway Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{totalFare.toLocaleString()} & Confirm Ticket</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
