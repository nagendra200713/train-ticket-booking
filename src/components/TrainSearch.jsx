import React from 'react';
import { MapPin, Calendar, Users, ArrowLeftRight, Search, Train, Sparkles } from 'lucide-react';
import { STATIONS } from '../data/stations';

export const TrainSearch = ({
  searchParams,
  setSearchParams,
  onSearch,
  quickFilter,
  setQuickFilter
}) => {
  // Swap From and To stations
  const handleSwapStations = () => {
    setSearchParams(prev => ({
      ...prev,
      fromStation: prev.toStation,
      toStation: prev.fromStation
    }));
  };

  const handleQuickRoute = (from, to) => {
    setSearchParams(prev => ({
      ...prev,
      fromStation: from,
      toStation: to
    }));
  };

  return (
    <div className="search-container">
      <div className="search-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <div className="search-grid">
            {/* From Station */}
            <div className="input-field-group">
              <label>
                <MapPin size={14} color="#f59e0b" /> Boarding Point (From)
              </label>
              <div className="input-wrapper">
                <Train size={18} className="input-icon" />
                <select
                  className="form-select"
                  value={searchParams.fromStation}
                  onChange={(e) => setSearchParams({ ...searchParams, fromStation: e.target.value })}
                >
                  <option value="">-- All Source Stations --</option>
                  {STATIONS.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="search-swap-col">
              <button
                type="button"
                className="swap-btn"
                onClick={handleSwapStations}
                title="Swap Stations"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            {/* To Station */}
            <div className="input-field-group">
              <label>
                <MapPin size={14} color="#10b981" /> Booking / Dropping Point (To)
              </label>
              <div className="input-wrapper">
                <Train size={18} className="input-icon" />
                <select
                  className="form-select"
                  value={searchParams.toStation}
                  onChange={(e) => setSearchParams({ ...searchParams, toStation: e.target.value })}
                >
                  <option value="">-- All Destination Stations --</option>
                  {STATIONS.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Journey Date */}
            <div className="input-field-group">
              <label>
                <Calendar size={14} color="#2563eb" /> Travel Date
              </label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  className="form-input"
                  value={searchParams.journeyDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSearchParams({ ...searchParams, journeyDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Class & Quota */}
            <div className="input-field-group">
              <label>
                <Users size={14} color="#8b5cf6" /> Travel Class
              </label>
              <div className="input-wrapper">
                <select
                  className="form-select"
                  value={searchParams.travelClass}
                  onChange={(e) => setSearchParams({ ...searchParams, travelClass: e.target.value })}
                  style={{ paddingLeft: '0.85rem' }}
                >
                  <option value="ALL">All Classes (SL, AC, 2S)</option>
                  <option value="1A">AC First Class (1A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="SL">Sleeper (SL)</option>
                  <option value="2S">Second Sitting (2S)</option>
                </select>
              </div>
            </div>

            {/* Search Submit Button */}
            <div>
              <button type="submit" className="btn-search-primary">
                <Search size={18} />
                <span>Search Trains</span>
              </button>
            </div>
          </div>
        </form>

        {/* Quick Popular Tamil Nadu & National Routes */}
        <div className="quick-filter-row">
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#f59e0b" /> POPULAR ROUTES:
          </span>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleQuickRoute('MAS', 'CBE')}
          >
            Chennai ➔ Coimbatore
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleQuickRoute('MS', 'MDU')}
          >
            Chennai Egmore ➔ Madurai
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleQuickRoute('MAS', 'SBC')}
          >
            Chennai ➔ Bengaluru
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleQuickRoute('MS', 'TEN')}
          >
            Chennai ➔ Tirunelveli
          </button>
          <button
            type="button"
            className="filter-pill"
            onClick={() => handleQuickRoute('NDLS', 'MAS')}
          >
            New Delhi ➔ Chennai
          </button>
        </div>
      </div>
    </div>
  );
};
