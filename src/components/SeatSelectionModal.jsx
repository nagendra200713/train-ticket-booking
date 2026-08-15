import React, { useState } from 'react';
import { X, Check, Users, ArrowRight, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { getClassDetails } from '../data/stations';

export const SeatSelectionModal = ({
  isOpen,
  train,
  selectedClass,
  journeyDate,
  fromStation,
  toStation,
  onClose,
  onProceedToPayment
}) => {
  if (!isOpen || !train) return null;

  const classInfo = getClassDetails(selectedClass);
  const currentClassData = train.classes?.find(c => c.code === selectedClass) || { baseFare: 500, totalSeats: 48, availableSeats: 24 };
  const baseFare = currentClassData.baseFare || 500;

  // Mock seat layout generator based on class
  // Generate 48 seats for coach
  const totalCoachSeats = currentClassData.totalSeats || 48;
  const bookedSeatsCount = Math.max(0, totalCoachSeats - currentClassData.availableSeats);

  // Determine fixed mock booked seat numbers (e.g. seats 3, 4, 11, 12, 19, etc.)
  const bookedSeatNumbers = new Set();
  let step = 1;
  while (bookedSeatNumbers.size < bookedSeatsCount && step <= totalCoachSeats) {
    if ((step % 3 === 0 || step % 7 === 0 || step <= 4) && bookedSeatNumbers.size < bookedSeatsCount) {
      bookedSeatNumbers.add(step);
    }
    step++;
  }
  // Fill remaining if any
  for (let i = 1; i <= totalCoachSeats && bookedSeatNumbers.size < bookedSeatsCount; i++) {
    bookedSeatNumbers.add(i);
  }

  // Selected seat list
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [validationError, setValidationError] = useState('');

  // Handle seat click
  const handleSeatClick = (seatNum, berthType) => {
    if (bookedSeatNumbers.has(seatNum)) return;

    if (selectedSeats.includes(seatNum)) {
      // Deselect
      const updatedSeats = selectedSeats.filter(s => s !== seatNum);
      setSelectedSeats(updatedSeats);
      setPassengers(passengers.filter((_, idx) => idx !== selectedSeats.indexOf(seatNum)));
    } else {
      if (selectedSeats.length >= 6) {
        setValidationError('Maximum 6 seats can be booked in a single reservation.');
        return;
      }
      setValidationError('');
      const updatedSeats = [...selectedSeats, seatNum];
      setSelectedSeats(updatedSeats);
      setPassengers([
        ...passengers,
        {
          name: '',
          age: '',
          gender: 'Male',
          berth: `${seatNum}`,
          berthType: berthType,
          status: 'CNF'
        }
      ]);
    }
  };

  // Passenger input change
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  // Helper to determine Berth type name
  const getBerthTypeLabel = (seatNumber) => {
    if (selectedClass === 'CC' || selectedClass === '2S') {
      const pos = seatNumber % 3;
      if (pos === 1) return 'Window (W)';
      if (pos === 2) return 'Middle (M)';
      return 'Aisle (A)';
    } else {
      // Sleeper / AC 3-Tier
      const mod = seatNumber % 8;
      if (mod === 1 || mod === 4) return 'Lower (L)';
      if (mod === 2 || mod === 5) return 'Middle (M)';
      if (mod === 3 || mod === 6) return 'Upper (U)';
      if (mod === 7) return 'Side Lower (SL)';
      return 'Side Upper (SU)';
    }
  };

  // Fare calculations
  const totalBaseFare = selectedSeats.length * baseFare;
  const gst = Number((totalBaseFare * 0.05).toFixed(2));
  const reservationFee = selectedSeats.length > 0 ? 40 : 0;
  const grandTotal = Number((totalBaseFare + gst + reservationFee).toFixed(2));

  // Proceed handler
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      setValidationError('Please select at least 1 seat to proceed.');
      return;
    }

    // Validate passenger names & age
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setValidationError(`Please enter name for Passenger #${i + 1} (Seat ${selectedSeats[i]}).`);
        return;
      }
      if (!passengers[i].age || Number(passengers[i].age) < 1 || Number(passengers[i].age) > 120) {
        setValidationError(`Please enter a valid age for Passenger #${i + 1}.`);
        return;
      }
    }

    onProceedToPayment({
      train,
      selectedClass,
      journeyDate,
      fromStation,
      toStation,
      selectedSeats,
      passengers,
      baseFare: totalBaseFare,
      farePerPassenger: baseFare,
      gst,
      reservationFee,
      totalFare: grandTotal
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '920px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">
              <Users size={22} color="#f59e0b" />
              <span>Select Seats & Enter Passenger Details</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              {train.trainNumber} - {train.trainName} • Class: <strong>{classInfo.name}</strong> • Date: <strong>{journeyDate}</strong>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Coach View */}
          <div className="coach-container">
            <div className="coach-header">
              <div className="coach-name-tag">
                🚆 COACH {selectedClass === 'CC' ? 'C-1' : selectedClass === '1A' ? 'H-1' : selectedClass === '2A' ? 'A-1' : selectedClass === '3A' ? 'B-1' : 'S-1'}
              </div>
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="legend-box avail" />
                  <span>Available ({currentClassData.availableSeats})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box selected" />
                  <span>Selected ({selectedSeats.length})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box booked" />
                  <span>Booked / Reserved</span>
                </div>
              </div>
            </div>

            {/* Visual Seat Grid */}
            <div className="seat-grid-coach">
              {Array.from({ length: totalCoachSeats }, (_, i) => i + 1).map((seatNum) => {
                const isBooked = bookedSeatNumbers.has(seatNum);
                const isSelected = selectedSeats.includes(seatNum);
                const berthLabel = getBerthTypeLabel(seatNum);

                return (
                  <div
                    key={seatNum}
                    className={`seat-item ${isBooked ? 'booked' : isSelected ? 'selected' : 'avail'}`}
                    onClick={() => handleSeatClick(seatNum, berthLabel)}
                  >
                    <span>{seatNum}</span>
                    <span className="seat-type-label">
                      {isBooked ? 'OCC' : berthLabel.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Validation Banner */}
          {validationError && (
            <div
              style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <AlertCircle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Passenger Details Form */}
          {selectedSeats.length > 0 && (
            <div className="passenger-roster">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2b48', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#f59e0b" />
                Passenger Manifest ({selectedSeats.length} Selected)
              </h4>

              {passengers.map((p, idx) => (
                <div key={idx} className="passenger-row">
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                      Passenger #{idx + 1} Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      placeholder="e.g. Karthikeyan Raman"
                      value={p.name}
                      onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Age *</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      placeholder="e.g. 32"
                      min="1"
                      max="120"
                      value={p.age}
                      onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Gender *</label>
                    <select
                      className="form-select"
                      style={{ paddingLeft: '0.85rem' }}
                      value={p.gender}
                      onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>Seat & Berth</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '0.85rem', background: '#e2e8f0', fontWeight: 800 }}
                      value={`Seat ${p.berth} (${p.berthType})`}
                      disabled
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fare Summary & Proceed Action */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Estimated Fare ({selectedSeats.length} Passenger{selectedSeats.length > 1 ? 's' : ''})</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2b48' }}>
                ₹{grandTotal.toLocaleString()}
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginLeft: '6px' }}>
                  (incl. 5% GST & ₹40 booking fee)
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-search-primary"
              style={{ margin: 0, padding: '0.75rem 2rem' }}
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              <span>Proceed to Payment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
