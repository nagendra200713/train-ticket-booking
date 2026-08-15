import React from 'react';
import { Radio, ArrowRight, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { STATIONS, getClassDetails } from '../data/stations';

export const TrainCard = ({
  train,
  selectedClassFilter,
  onSelectTrainForBooking,
  onViewLiveLocation
}) => {
  const [selectedClassCode, setSelectedClassCode] = React.useState(
    train.classes && train.classes.length > 0 ? train.classes[0].code : 'SL'
  );

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const fromStation = STATIONS.find(s => s.code === train.fromStation) || { name: train.fromStation, code: train.fromStation };
  const toStation = STATIONS.find(s => s.code === train.toStation) || { name: train.toStation, code: train.toStation };

  // Filter classes if user selected a specific class in the search bar
  const displayedClasses = selectedClassFilter && selectedClassFilter !== 'ALL'
    ? train.classes.filter(c => c.code === selectedClassFilter)
    : train.classes;

  const currentSelectedClassData = train.classes?.find(c => c.code === selectedClassCode) || train.classes?.[0];

  return (
    <div className="train-card">
      {/* Top Header */}
      <div className="train-card-header">
        <div>
          <div className="train-main-info">
            <span className="train-number-badge">{train.trainNumber}</span>
            <h3 className="train-name">{train.trainName}</h3>
            <span className="train-type-pill">{train.trainType}</span>
          </div>

          <div className="runs-days" style={{ marginTop: '0.4rem' }}>
            <span>Runs On:</span>
            {daysList.map((day) => {
              const isRunning = train.runsOn?.includes(day);
              return (
                <span
                  key={day}
                  className={`runs-day-badge ${isRunning ? 'active' : 'inactive'}`}
                >
                  {day.charAt(0)}
                </span>
              );
            })}
          </div>
        </div>

        {/* Live Status Tag */}
        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="live-route-btn"
            onClick={() => onViewLiveLocation(train)}
          >
            <Radio size={14} className="animate-pulse" />
            <span>Live Location: {train.liveStatus?.status || 'On Time'}</span>
          </button>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="schedule-grid">
        <div className="time-station">
          <span className="station-time">{train.departureTime}</span>
          <span className="station-name">{fromStation.name}</span>
          <span className="station-code">Source ({train.fromStation})</span>
        </div>

        <div className="duration-line">
          <span className="duration-text">{train.duration}</span>
          <div className="line-visual" />
          <span className="distance-tag">{train.distanceKm} KM • {train.route?.length || 2} Stops</span>
        </div>

        <div className="time-station" style={{ textAlign: 'right' }}>
          <span className="station-time">{train.arrivalTime}</span>
          <span className="station-name">{toStation.name}</span>
          <span className="station-code">Destination ({train.toStation})</span>
        </div>
      </div>

      {/* Class Fare & Availability Grid */}
      <div className="class-grid">
        {(displayedClasses && displayedClasses.length > 0 ? displayedClasses : train.classes)?.map((cls) => {
          const isSelected = selectedClassCode === cls.code;
          const classDetail = getClassDetails(cls.code);
          const isAvail = cls.availableSeats > 0;

          return (
            <div
              key={cls.code}
              className={`class-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedClassCode(cls.code)}
            >
              <div className="class-card-top">
                <span className="class-code">{cls.code}</span>
                <span className="class-fare">₹{cls.baseFare}</span>
              </div>

              <div>
                <span
                  className={`class-avail-badge ${
                    cls.availableSeats > 10 ? 'avail-green' : cls.availableSeats > 0 ? 'avail-orange' : 'avail-red'
                  }`}
                >
                  {cls.availableSeats > 0 ? `AVL ${cls.availableSeats}` : 'WL / FULL'}
                </span>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                  {classDetail.name.split(' ')[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Booking Actions */}
      <div className="train-card-footer">
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Selected: <strong style={{ color: '#0f2b48' }}>{currentSelectedClassData?.code}</strong> (₹{currentSelectedClassData?.baseFare} per seat) •{' '}
          <span style={{ color: '#15803d', fontWeight: 700 }}>
            {currentSelectedClassData?.availableSeats} Seats Available
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="filter-pill"
            style={{ padding: '0.55rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => onViewLiveLocation(train)}
          >
            <span>View Full Route</span>
          </button>

          <button
            type="button"
            className="btn-book-now"
            onClick={() => onSelectTrainForBooking(train, selectedClassCode)}
          >
            <span>Select Seats & Book</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
