import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TrainSearch } from './components/TrainSearch';
import { TrainCard } from './components/TrainCard';
import { AuthModal } from './components/AuthModal';
import { TrainLocationModal } from './components/TrainLocationModal';
import { SeatSelectionModal } from './components/SeatSelectionModal';
import { PaymentModal } from './components/PaymentModal';
import { TicketModal } from './components/TicketModal';
import { MyBookings } from './components/MyBookings';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { storageService } from './services/storageService';
import { STATIONS } from './data/stations';
import { Train, ShieldCheck, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export function App() {
  // Navigation tab: 'search', 'bookings', 'admin'
  const [activeTab, setActiveTab] = useState('search');

  // Persistence State
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  // Search Parameters
  const [searchParams, setSearchParams] = useState({
    fromStation: 'MAS',
    toStation: 'CBE',
    journeyDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    travelClass: 'ALL'
  });

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('user-login');

  const [selectedTrainForLocation, setSelectedTrainForLocation] = useState(null);
  const [selectedTrainForBooking, setSelectedTrainForBooking] = useState(null);
  const [bookingClass, setBookingClass] = useState('CC');

  const [bookingDraft, setBookingDraft] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [activeTicket, setActiveTicket] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load initial data
  useEffect(() => {
    const loadedTrains = storageService.getTrains();
    const loadedBookings = storageService.getBookings();
    const activeUser = storageService.getActiveUser();

    setTrains(loadedTrains);
    setBookings(loadedBookings);
    setUser(activeUser);
  }, []);

  // Filtered Trains based on Search Parameters
  const filteredTrains = trains.filter(train => {
    const matchesFrom = !searchParams.fromStation || train.fromStation === searchParams.fromStation;
    const matchesTo = !searchParams.toStation || train.toStation === searchParams.toStation;
    const matchesClass = searchParams.travelClass === 'ALL' || train.classes.some(c => c.code === searchParams.travelClass);

    return matchesFrom && matchesTo && matchesClass;
  });

  // Auth Handlers
  const handleOpenAuth = (mode = 'user-login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser, message) => {
    setUser(authenticatedUser);
    addToast('success', message);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    addToast('info', 'Logged out successfully.');
    if (activeTab === 'admin') {
      setActiveTab('search');
    }
  };

  // Start Booking Flow
  const handleSelectTrainForBooking = (train, classCode) => {
    setSelectedTrainForBooking(train);
    setBookingClass(classCode);
  };

  // Proceed to Payment from Seat Selection
  const handleProceedToPayment = (draft) => {
    setBookingDraft(draft);
    setSelectedTrainForBooking(null); // close seat selection modal
    setIsPaymentOpen(true); // open payment modal
  };

  // Booking Confirmation Handler
  const handleBookingSuccess = (newBooking) => {
    setIsPaymentOpen(false);
    setBookings(storageService.getBookings());
    setTrains(storageService.getTrains());
    setActiveTicket(newBooking); // open printable e-ticket modal immediately
    addToast('success', `Ticket Confirmed! PNR: ${newBooking.pnr}`);
  };

  // Cancellation Handler
  const handleCancelSuccess = (cancelledBooking, message) => {
    setBookings(storageService.getBookings());
    setTrains(storageService.getTrains());
    addToast('info', message);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        bookingCount={bookings.filter(b => b.status === 'CONFIRMED').length}
      />

      {/* VIEW 1: SEARCH & BOOK TRAINS */}
      {activeTab === 'search' && (
        <>
          {/* Hero Banner */}
          <div className="hero-banner">
            <h1 className="hero-title">
              Fast, Reliable & Modern <span>Railway Ticket Booking</span>
            </h1>
            <p className="hero-subtitle">
              Search express trains, check live seat availability across coaches, track live routes, print official E-Tickets, and manage reservations easily.
            </p>
          </div>

          {/* Search Box */}
          <TrainSearch
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            onSearch={() => {
              addToast('info', `Searching available trains for ${searchParams.journeyDate}...`);
            }}
          />

          {/* Results Section */}
          <main className="main-content">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  Available Trains ({filteredTrains.length} Found)
                </h2>
                <p className="section-subtitle">
                  Showing scheduled express trains from{' '}
                  <strong>{STATIONS.find(s => s.code === searchParams.fromStation)?.name || searchParams.fromStation || 'All Origins'}</strong> to{' '}
                  <strong>{STATIONS.find(s => s.code === searchParams.toStation)?.name || searchParams.toStation || 'All Destinations'}</strong> on{' '}
                  <strong>{searchParams.journeyDate}</strong>
                </p>
              </div>
            </div>

            {filteredTrains.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <Train size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2b48', marginBottom: '0.5rem' }}>
                  No Direct Trains Found
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  There are no scheduled trains matching this exact origin and destination filter. Try searching for popular routes like Chennai to Coimbatore or Chennai to Madurai!
                </p>
                <button
                  type="button"
                  className="btn-search-primary"
                  style={{ display: 'inline-flex', margin: '0 auto' }}
                  onClick={() => setSearchParams({ fromStation: 'MAS', toStation: 'CBE', journeyDate: searchParams.journeyDate, travelClass: 'ALL' })}
                >
                  <span>Show Chennai ➔ Coimbatore Trains</span>
                </button>
              </div>
            ) : (
              <div>
                {filteredTrains.map((train) => (
                  <TrainCard
                    key={train.id || train.trainNumber}
                    train={train}
                    selectedClassFilter={searchParams.travelClass}
                    onSelectTrainForBooking={handleSelectTrainForBooking}
                    onViewLiveLocation={(tr) => setSelectedTrainForLocation(tr)}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* VIEW 2: MY BOOKINGS & CANCEL / PRINT */}
      {activeTab === 'bookings' && (
        <MyBookings
          bookings={bookings}
          user={user}
          onViewTicket={(b) => setActiveTicket(b)}
          onCancelSuccess={handleCancelSuccess}
        />
      )}

      {/* VIEW 3: ADMIN PORTAL WITH EXCEL EXPORT */}
      {activeTab === 'admin' && (
        <AdminDashboard
          trains={trains}
          bookings={bookings}
          user={user}
          onUpdateTrains={(updated) => setTrains(updated)}
          onViewTicket={(b) => setActiveTicket(b)}
          onNotify={(type, msg) => addToast(type, msg)}
        />
      )}

      {/* MODAL 1: AUTHENTICATION (USER / ADMIN) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* MODAL 2: LIVE TRAIN LOCATION & ROUTE */}
      <TrainLocationModal
        isOpen={!!selectedTrainForLocation}
        train={selectedTrainForLocation}
        onClose={() => setSelectedTrainForLocation(null)}
      />

      {/* MODAL 3: SEAT SELECTION & COACH MAP */}
      <SeatSelectionModal
        isOpen={!!selectedTrainForBooking}
        train={selectedTrainForBooking}
        selectedClass={bookingClass}
        journeyDate={searchParams.journeyDate}
        fromStation={searchParams.fromStation}
        toStation={searchParams.toStation}
        onClose={() => setSelectedTrainForBooking(null)}
        onProceedToPayment={handleProceedToPayment}
      />

      {/* MODAL 4: PAYMENT CHECKOUT */}
      <PaymentModal
        isOpen={isPaymentOpen}
        bookingDraft={bookingDraft}
        user={user}
        onClose={() => setIsPaymentOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* MODAL 5: PRINTABLE OFFICIAL E-TICKET */}
      <TicketModal
        isOpen={!!activeTicket}
        booking={activeTicket}
        onClose={() => setActiveTicket(null)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
