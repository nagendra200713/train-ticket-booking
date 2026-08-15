import React from 'react';
import { X, Train, MapPin, Clock, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export const TrainLocationModal = ({ isOpen, train, onClose }) => {
  if (!isOpen || !train) return null;

  const route = train.route || [];
  const liveStatus = train.liveStatus || {
    currentStation: train.fromStation,
    status: 'Running on Time',
    delayMinutes: 0,
    nextStation: route[1]?.stationCode || train.toStation,
    estimatedArrival: train.departureTime
  };

  // Find index of current station in route
  const currentStationIndex = route.findIndex(r => r.stationCode === liveStatus.currentStation);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">
              <Train size={22} color="#0284c7" />
              <span>Live Train Location & Route Tracker</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              {train.trainNumber} - <strong>{train.trainName}</strong> ({train.trainType})
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Live Status Banner */}
          <div
            style={{
              background: liveStatus.delayMinutes > 0 ? '#fffbeb' : '#f0fdf4',
              border: `1.5px solid ${liveStatus.delayMinutes > 0 ? '#fcd34d' : '#86efac'}`,
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: liveStatus.delayMinutes > 0 ? '#f59e0b' : '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <Radio size={22} className="animate-pulse" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b' }}>
                  Current Live Status
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: liveStatus.delayMinutes > 0 ? '#b45309' : '#15803d' }}>
                  {liveStatus.status}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Next Destination Stop</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f2b48' }}>
                {liveStatus.nextStation} (ETA: {liveStatus.estimatedArrival})
              </div>
            </div>
          </div>

          {/* Route Milestones Timeline */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2b48', marginBottom: '1rem' }}>
              Station Schedule & Route Map ({route.length} Stops)
            </h4>

            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              {/* Vertical timeline bar */}
              <div
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '12px',
                  bottom: '16px',
                  width: '3px',
                  background: '#e2e8f0',
                  zIndex: 1
                }}
              />

              {route.map((st, idx) => {
                const isPassed = currentStationIndex !== -1 && idx < currentStationIndex;
                const isCurrent = currentStationIndex !== -1 && idx === currentStationIndex;
                const isUpcoming = idx > currentStationIndex;

                let markerBg = '#cbd5e1';
                let markerBorder = '#94a3b8';
                if (isPassed) {
                  markerBg = '#10b981';
                  markerBorder = '#059669';
                } else if (isCurrent) {
                  markerBg = '#f59e0b';
                  markerBorder = '#d97706';
                }

                return (
                  <div
                    key={st.stationCode}
                    style={{
                      position: 'relative',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      background: isCurrent ? 'rgba(245, 158, 11, 0.08)' : '#fff',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: isCurrent ? '1.5px solid #f59e0b' : '1px solid #e2e8f0'
                    }}
                  >
                    {/* Circle marker */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2rem',
                        top: '1rem',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: markerBg,
                        border: `2px solid ${markerBorder}`,
                        zIndex: 2,
                        transform: 'translateX(4px)'
                      }}
                    />

                    {/* Station info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          {st.stationName}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: '#475569'
                          }}
                        >
                          {st.stationCode}
                        </span>
                        {isCurrent && (
                          <span
                            style={{
                              background: '#f59e0b',
                              color: '#000',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px'
                            }}
                          >
                            TRAIN IS HERE 🚆
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        Distance: {st.distance} km • Platform: {st.platform || '1'} • Halt: {st.halt || '2m'}
                      </div>
                    </div>

                    {/* Arrival / Departure */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f2b48' }}>
                        {st.arrival === 'Source' ? 'Origin' : st.arrival}
                        {st.departure !== 'Destination' && ` ➔ ${st.departure}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Day {st.day}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
