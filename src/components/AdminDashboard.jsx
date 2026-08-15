import React, { useState } from 'react';
import {
  LayoutDashboard,
  Train,
  Ticket,
  FileSpreadsheet,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Users,
  ShieldCheck,
  XCircle,
  Printer
} from 'lucide-react';
import { exportBookingsToExcel } from '../services/excelExportService';
import { storageService } from '../services/storageService';
import { STATIONS } from '../data/stations';

export const AdminDashboard = ({
  trains,
  bookings,
  user,
  onUpdateTrains,
  onViewTicket,
  onNotify
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState('bookings'); // 'bookings', 'trains', 'analytics'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Train Form Modal state
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);
  const [trainForm, setTrainForm] = useState({
    trainNumber: '',
    trainName: '',
    trainType: 'Superfast Express',
    fromStation: 'MAS',
    toStation: 'CBE',
    departureTime: '06:00',
    arrivalTime: '13:30',
    duration: '7h 30m',
    distanceKm: 495,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', baseFare: 620, totalSeats: 48, availableSeats: 48 },
      { code: '2S', baseFare: 190, totalSeats: 60, availableSeats: 60 }
    ]
  });

  // Analytics calculation
  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalFare || 0), 0);

  const totalConfirmedPassengers = bookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.passengers ? b.passengers.length : 1), 0);

  const totalCancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.pnr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainNumber?.includes(searchTerm) ||
      b.passengers?.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Excel Export (The key requirement: "booked datails lam excel sheets save aggunum ennku")
  const handleExportExcel = () => {
    try {
      const fileName = exportBookingsToExcel(filteredBookings.length > 0 ? filteredBookings : bookings);
      onNotify('success', `Excel Sheet "${fileName}" exported and downloaded successfully!`);
    } catch (err) {
      onNotify('error', err.message || 'Failed to export Excel file.');
    }
  };

  // Open Train Modal for Add / Edit
  const handleOpenAddTrain = () => {
    setEditingTrain(null);
    setTrainForm({
      trainNumber: '',
      trainName: '',
      trainType: 'Superfast Express',
      fromStation: 'MAS',
      toStation: 'CBE',
      departureTime: '06:00',
      arrivalTime: '13:30',
      duration: '7h 30m',
      distanceKm: 495,
      runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: [
        { code: '3A', baseFare: 850, totalSeats: 64, availableSeats: 64 },
        { code: 'SL', baseFare: 320, totalSeats: 72, availableSeats: 72 }
      ]
    });
    setIsTrainModalOpen(true);
  };

  const handleOpenEditTrain = (train) => {
    setEditingTrain(train);
    setTrainForm({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      trainType: train.trainType,
      fromStation: train.fromStation,
      toStation: train.toStation,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      distanceKm: train.distanceKm,
      runsOn: train.runsOn || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      classes: train.classes || []
    });
    setIsTrainModalOpen(true);
  };

  const handleSaveTrain = (e) => {
    e.preventDefault();
    if (!trainForm.trainNumber || !trainForm.trainName) {
      onNotify('error', 'Train Number and Name are required.');
      return;
    }

    if (editingTrain) {
      const updated = storageService.updateTrain({
        ...editingTrain,
        ...trainForm
      });
      onUpdateTrains(storageService.getTrains());
      onNotify('success', `Train ${updated.trainNumber} - ${updated.trainName} updated successfully!`);
    } else {
      const added = storageService.addTrain({
        ...trainForm,
        route: [
          { stationCode: trainForm.fromStation, stationName: STATIONS.find(s => s.code === trainForm.fromStation)?.name || trainForm.fromStation, arrival: 'Source', departure: trainForm.departureTime, halt: '-', day: 1, distance: 0, platform: '1' },
          { stationCode: trainForm.toStation, stationName: STATIONS.find(s => s.code === trainForm.toStation)?.name || trainForm.toStation, arrival: trainForm.arrivalTime, departure: 'Destination', halt: '-', day: 1, distance: trainForm.distanceKm, platform: '2' }
        ]
      });
      onUpdateTrains(storageService.getTrains());
      onNotify('success', `New Train ${added.trainNumber} - ${added.trainName} added to the railway system!`);
    }
    setIsTrainModalOpen(false);
  };

  const handleDeleteTrain = (trainId, trainName) => {
    if (window.confirm(`Are you sure you want to remove ${trainName} from the timetable?`)) {
      const updated = storageService.deleteTrain(trainId);
      onUpdateTrains(updated);
      onNotify('info', `Train ${trainName} deleted.`);
    }
  };

  return (
    <div className="admin-container">
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0a192f 0%, #0f2b48 100%)',
          color: '#fff',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="admin-badge">Admin Headquarters</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Southern Railway Central Control</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.35rem' }}>
            Railway Officer & Operations Dashboard
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
            Manage train fleets, view live passenger reservations, update timetables, and download Excel data sheets.
          </p>
        </div>

        {/* Excel Export Button & Add Train Action */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-excel-export"
            onClick={handleExportExcel}
            title="Download complete passenger bookings in Excel (.xlsx) file"
          >
            <FileSpreadsheet size={18} />
            <span>Export Bookings to Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            className="btn-search-primary"
            style={{ margin: 0, height: '42px', padding: '0.5rem 1.25rem' }}
            onClick={handleOpenAddTrain}
          >
            <PlusCircle size={18} />
            <span>Add New Train</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Train size={26} />
          </div>
          <div>
            <div className="stat-val">{trains.length}</div>
            <div className="stat-lbl">Active Trains in Service</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Ticket size={26} />
          </div>
          <div>
            <div className="stat-val">{bookings.length}</div>
            <div className="stat-lbl">Total Reservations (PNRs)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-val">{totalConfirmedPassengers}</div>
            <div className="stat-lbl">Confirmed Passengers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <IndianRupee size={26} />
          </div>
          <div>
            <div className="stat-val">₹{totalRevenue.toLocaleString()}</div>
            <div className="stat-lbl">Total Railway Revenue</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          className={`nav-btn ${activeAdminTab === 'bookings' ? 'active' : ''}`}
          style={{ color: activeAdminTab === 'bookings' ? '#0f2b48' : '#64748b', fontWeight: 700 }}
          onClick={() => setActiveAdminTab('bookings')}
        >
          <FileSpreadsheet size={18} />
          <span>All Passenger Bookings ({bookings.length})</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${activeAdminTab === 'trains' ? 'active' : ''}`}
          style={{ color: activeAdminTab === 'trains' ? '#0f2b48' : '#64748b', fontWeight: 700 }}
          onClick={() => setActiveAdminTab('trains')}
        >
          <Train size={18} />
          <span>Train Fleet & Schedule Manager ({trains.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL PASSENGER BOOKINGS TABLE WITH EXCEL EXPORT */}
      {activeAdminTab === 'bookings' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2b48' }}>
                Master Passenger Reservations Manifest
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                All ticket bookings stored in database. Click "Export to Excel (.xlsx)" to download complete spreadsheet.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={16} className="input-icon" style={{ left: '0.75rem' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '0.5rem 0.75rem 0.5rem 2.2rem', fontSize: '0.85rem' }}
                  placeholder="Filter by PNR, Train, Passenger..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="form-select"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="CONFIRMED">Confirmed Only</option>
                <option value="CANCELLED">Cancelled Only</option>
              </select>

              {/* Excel Download button in table header */}
              <button
                type="button"
                className="btn-excel-export"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={handleExportExcel}
              >
                <FileSpreadsheet size={16} />
                <span>Save to Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PNR Number</th>
                  <th>Train Info</th>
                  <th>Route</th>
                  <th>Journey Date</th>
                  <th>Class</th>
                  <th>Passengers & Berths</th>
                  <th>Fare (₹)</th>
                  <th>Status</th>
                  <th>Booked On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No booking records match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.pnr}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0f2b48' }}>
                          {b.pnr}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {b.bookingId || 'BK-AUTO'}
                        </div>
                      </td>
                      <td>
                        <strong>{b.trainNumber}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.trainName}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700 }}>{b.fromStation}</span> ➔ <span style={{ fontWeight: 700 }}>{b.toStation}</span>
                      </td>
                      <td>{b.journeyDate}</td>
                      <td>
                        <span style={{ fontWeight: 800, background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                          {b.travelClass}
                        </span>
                      </td>
                      <td>
                        {b.passengers?.map((p, pIdx) => (
                          <div key={pIdx} style={{ fontSize: '0.8rem' }}>
                            <strong>{p.name}</strong> ({p.age}, {p.gender}) • <span style={{ color: '#0284c7' }}>Seat {p.berth}</span>
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>₹{b.totalFare?.toLocaleString()}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{b.paymentMode}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${b.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}`}>
                          {b.status === 'CONFIRMED' ? 'CONFIRMED' : 'CANCELLED'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.bookingDate}</td>
                      <td>
                        <button
                          type="button"
                          className="nav-btn"
                          style={{ padding: '0.35rem 0.65rem', background: '#0f2b48', color: '#fff', fontSize: '0.78rem' }}
                          onClick={() => onViewTicket(b)}
                          title="Print official E-Ticket"
                        >
                          <Printer size={14} />
                          <span>Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TRAIN FLEET MANAGEMENT (ADD, EDIT, DELETE) */}
      {activeAdminTab === 'trains' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2b48' }}>
                Train Timetable & Fleet Inventory
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Create new train routes, configure seat capacities, base fares, and timings.
              </p>
            </div>

            <button
              type="button"
              className="btn-search-primary"
              style={{ margin: 0, height: '38px', padding: '0.4rem 1.1rem', fontSize: '0.88rem' }}
              onClick={handleOpenAddTrain}
            >
              <PlusCircle size={16} />
              <span>Add New Train</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Train No</th>
                  <th>Train Name & Type</th>
                  <th>Route (From - To)</th>
                  <th>Timings & Duration</th>
                  <th>Classes & Fares</th>
                  <th>Live Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains.map((train) => (
                  <tr key={train.id || train.trainNumber}>
                    <td>
                      <span className="train-number-badge">{train.trainNumber}</span>
                    </td>
                    <td>
                      <strong>{train.trainName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#0284c7' }}>{train.trainType}</div>
                    </td>
                    <td>
                      <div>
                        <strong>{train.fromStation}</strong> ({train.departureTime}) ➔ <strong>{train.toStation}</strong> ({train.arrivalTime})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Distance: {train.distanceKm} km • {train.route?.length || 2} Stops
                      </div>
                    </td>
                    <td>
                      <div>{train.duration}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Runs: {train.runsOn?.join(', ') || 'Daily'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {train.classes?.map((c) => (
                          <span
                            key={c.code}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}
                          >
                            <strong>{c.code}:</strong> ₹{c.baseFare} ({c.availableSeats}/{c.totalSeats} seats)
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>
                        {train.liveStatus?.status || 'On Time'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="nav-btn"
                          style={{ padding: '0.35rem 0.6rem', background: '#f1f5f9', color: '#0f2b48' }}
                          onClick={() => handleOpenEditTrain(train)}
                          title="Edit train"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          className="nav-btn"
                          style={{ padding: '0.35rem 0.6rem', background: '#fee2e2', color: '#b91c1c' }}
                          onClick={() => handleDeleteTrain(train.id, train.trainName)}
                          title="Delete train"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Train Add / Edit Modal */}
      {isTrainModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTrainModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Train size={22} color="#0f2b48" />
                <span>{editingTrain ? `Edit Train: ${editingTrain.trainNumber}` : 'Add New Train Route'}</span>
              </div>
              <button className="modal-close-btn" onClick={() => setIsTrainModalOpen(false)}>
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTrain} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-field-group">
                  <label>Train Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    placeholder="e.g. 12675"
                    value={trainForm.trainNumber}
                    onChange={(e) => setTrainForm({ ...trainForm, trainNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="input-field-group">
                  <label>Train Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    placeholder="e.g. Cheran Superfast Express"
                    value={trainForm.trainName}
                    onChange={(e) => setTrainForm({ ...trainForm, trainName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-field-group">
                  <label>Train Type</label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '0.85rem' }}
                    value={trainForm.trainType}
                    onChange={(e) => setTrainForm({ ...trainForm, trainType: e.target.value })}
                  >
                    <option>Superfast Express</option>
                    <option>Vande Bharat Express</option>
                    <option>Shatabdi Express</option>
                    <option>Rajdhani Express</option>
                    <option>Mail / Express</option>
                  </select>
                </div>

                <div className="input-field-group">
                  <label>Origin Station</label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '0.85rem' }}
                    value={trainForm.fromStation}
                    onChange={(e) => setTrainForm({ ...trainForm, fromStation: e.target.value })}
                  >
                    {STATIONS.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.code} - {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field-group">
                  <label>Destination Station</label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '0.85rem' }}
                    value={trainForm.toStation}
                    onChange={(e) => setTrainForm({ ...trainForm, toStation: e.target.value })}
                  >
                    {STATIONS.map((st) => (
                      <option key={st.code} value={st.code}>
                        {st.code} - {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="input-field-group">
                  <label>Departure Time</label>
                  <input
                    type="time"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    value={trainForm.departureTime}
                    onChange={(e) => setTrainForm({ ...trainForm, departureTime: e.target.value })}
                    required
                  />
                </div>

                <div className="input-field-group">
                  <label>Arrival Time</label>
                  <input
                    type="time"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    value={trainForm.arrivalTime}
                    onChange={(e) => setTrainForm({ ...trainForm, arrivalTime: e.target.value })}
                    required
                  />
                </div>

                <div className="input-field-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    placeholder="7h 30m"
                    value={trainForm.duration}
                    onChange={(e) => setTrainForm({ ...trainForm, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="input-field-group">
                  <label>Distance (KM)</label>
                  <input
                    type="number"
                    className="form-input"
                    style={{ paddingLeft: '0.85rem' }}
                    placeholder="495"
                    value={trainForm.distanceKm}
                    onChange={(e) => setTrainForm({ ...trainForm, distanceKm: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="filter-pill"
                  style={{ padding: '0.65rem 1.25rem' }}
                  onClick={() => setIsTrainModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-search-primary"
                  style={{ margin: 0, padding: '0.65rem 1.5rem', height: '42px' }}
                >
                  <span>{editingTrain ? 'Save Changes' : 'Create Train'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
