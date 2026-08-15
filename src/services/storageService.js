import { INITIAL_TRAINS } from '../data/initialTrains';

const KEYS = {
  TRAINS: 'railway_trains_v1',
  BOOKINGS: 'railway_bookings_v1',
  USERS: 'railway_users_v1',
  ACTIVE_USER: 'railway_active_user_v1'
};

// Initial Seed Users
const INITIAL_USERS = [
  {
    id: 'usr_admin',
    name: 'Chief Commercial Manager (Admin)',
    email: 'admin@railways.gov.in',
    password: 'admin123',
    role: 'admin',
    phone: '+91 98401 23456',
    department: 'Southern Railway Headquarters, Chennai'
  },
  {
    id: 'usr_demo',
    name: 'Karthikeyan Raman',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    phone: '+91 94432 87654',
    city: 'Coimbatore'
  }
];

// Initial Seed Bookings for demonstration & immediate Excel export
const INITIAL_BOOKINGS = [
  {
    pnr: '452-8910243',
    bookingId: 'BK-98012',
    trainId: 'tr_12675',
    trainNumber: '12675',
    trainName: 'Kovai Superfast Express',
    fromStation: 'MAS',
    toStation: 'CBE',
    boardingStationName: 'Chennai Central (MAS)',
    droppingStationName: 'Coimbatore Junction (CBE)',
    journeyDate: '2026-08-20',
    departureTime: '06:10',
    arrivalTime: '14:05',
    travelClass: 'CC',
    quota: 'General',
    passengers: [
      { name: 'Karthikeyan Raman', age: 34, gender: 'Male', berth: '12', berthType: 'Window (W)', status: 'CNF' },
      { name: 'Priya Karthik', age: 31, gender: 'Female', berth: '13', berthType: 'Aisle (A)', status: 'CNF' }
    ],
    farePerPassenger: 615,
    baseFare: 1230,
    gst: 61.5,
    reservationFee: 40,
    totalFare: 1331.5,
    status: 'CONFIRMED',
    bookingDate: '2026-08-14 10:30:15',
    paymentMode: 'UPI (Google Pay)',
    transactionId: 'TXN893247190',
    bookedBy: {
      id: 'usr_demo',
      name: 'Karthikeyan Raman',
      email: 'user@example.com'
    }
  },
  {
    pnr: '614-3329018',
    bookingId: 'BK-98013',
    trainId: 'tr_20643',
    trainNumber: '20643',
    trainName: 'Coimbatore Vande Bharat Express',
    fromStation: 'MAS',
    toStation: 'CBE',
    boardingStationName: 'Chennai Central (MAS)',
    droppingStationName: 'Coimbatore Junction (CBE)',
    journeyDate: '2026-08-22',
    departureTime: '14:25',
    arrivalTime: '20:15',
    travelClass: 'CC',
    quota: 'General',
    passengers: [
      { name: 'Anand Kumar', age: 29, gender: 'Male', berth: '07', berthType: 'Window (W)', status: 'CNF' }
    ],
    farePerPassenger: 1265,
    baseFare: 1265,
    gst: 63.25,
    reservationFee: 40,
    totalFare: 1368.25,
    status: 'CONFIRMED',
    bookingDate: '2026-08-15 08:15:00',
    paymentMode: 'Credit Card (HDFC)',
    transactionId: 'TXN893247543',
    bookedBy: {
      id: 'usr_demo',
      name: 'Karthikeyan Raman',
      email: 'user@example.com'
    }
  },
  {
    pnr: '821-6549821',
    bookingId: 'BK-98014',
    trainId: 'tr_12637',
    trainNumber: '12637',
    trainName: 'Pandian Superfast Express',
    fromStation: 'MS',
    toStation: 'MDU',
    boardingStationName: 'Chennai Egmore (MS)',
    droppingStationName: 'Madurai Junction (MDU)',
    journeyDate: '2026-08-18',
    departureTime: '21:40',
    arrivalTime: '05:25',
    travelClass: '3A',
    quota: 'General',
    passengers: [
      { name: 'Suresh Narayanan', age: 45, gender: 'Male', berth: '21', berthType: 'Lower (L)', status: 'CNF' },
      { name: 'Meenakshi Suresh', age: 42, gender: 'Female', berth: '22', berthType: 'Middle (M)', status: 'CNF' }
    ],
    farePerPassenger: 895,
    baseFare: 1790,
    gst: 89.5,
    reservationFee: 40,
    totalFare: 1919.5,
    status: 'CANCELLED',
    cancellationDetails: {
      cancelledAt: '2026-08-15 11:20:00',
      cancellationCharge: 240,
      refundAmount: 1679.5,
      refundStatus: 'REFUND_PROCESSED'
    },
    bookingDate: '2026-08-10 14:00:22',
    paymentMode: 'Net Banking (SBI)',
    transactionId: 'TXN891102941',
    bookedBy: {
      id: 'usr_external_1',
      name: 'Suresh Narayanan',
      email: 'suresh@example.com'
    }
  }
];

export const storageService = {
  // TRAINS
  getTrains: () => {
    try {
      const stored = localStorage.getItem(KEYS.TRAINS);
      if (!stored) {
        localStorage.setItem(KEYS.TRAINS, JSON.stringify(INITIAL_TRAINS));
        return INITIAL_TRAINS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching trains', e);
      return INITIAL_TRAINS;
    }
  },

  saveTrains: (trains) => {
    localStorage.setItem(KEYS.TRAINS, JSON.stringify(trains));
  },

  addTrain: (train) => {
    const trains = storageService.getTrains();
    const newTrain = {
      ...train,
      id: `tr_${train.trainNumber || Date.now()}`,
      liveStatus: train.liveStatus || {
        currentStation: train.fromStation,
        status: 'Scheduled',
        delayMinutes: 0,
        nextStation: train.route && train.route[1] ? train.route[1].stationCode : train.toStation,
        estimatedArrival: train.departureTime
      }
    };
    const updated = [newTrain, ...trains];
    storageService.saveTrains(updated);
    return newTrain;
  },

  updateTrain: (updatedTrain) => {
    const trains = storageService.getTrains();
    const updated = trains.map(t => t.id === updatedTrain.id ? updatedTrain : t);
    storageService.saveTrains(updated);
    return updatedTrain;
  },

  deleteTrain: (trainId) => {
    const trains = storageService.getTrains();
    const updated = trains.filter(t => t.id !== trainId);
    storageService.saveTrains(updated);
    return updated;
  },

  // BOOKINGS
  getBookings: () => {
    try {
      const stored = localStorage.getItem(KEYS.BOOKINGS);
      if (!stored) {
        localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching bookings', e);
      return INITIAL_BOOKINGS;
    }
  },

  saveBooking: (newBooking) => {
    const bookings = storageService.getBookings();
    const updatedBookings = [newBooking, ...bookings];
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updatedBookings));

    // Deduct available seats on the train
    const trains = storageService.getTrains();
    const seatCount = newBooking.passengers ? newBooking.passengers.length : 1;
    
    const updatedTrains = trains.map(train => {
      if (train.id === newBooking.trainId || train.trainNumber === newBooking.trainNumber) {
        const updatedClasses = train.classes.map(cls => {
          if (cls.code === newBooking.travelClass) {
            return {
              ...cls,
              availableSeats: Math.max(0, cls.availableSeats - seatCount)
            };
          }
          return cls;
        });
        return { ...train, classes: updatedClasses };
      }
      return train;
    });
    storageService.saveTrains(updatedTrains);

    return newBooking;
  },

  cancelBooking: (pnr) => {
    const bookings = storageService.getBookings();
    let cancelledBooking = null;

    const updatedBookings = bookings.map(b => {
      if (b.pnr === pnr) {
        const cancelCharge = Math.min(b.totalFare * 0.15 + 60, b.totalFare);
        const refundAmt = Math.max(0, b.totalFare - cancelCharge);
        cancelledBooking = {
          ...b,
          status: 'CANCELLED',
          cancellationDetails: {
            cancelledAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            cancellationCharge: Number(cancelCharge.toFixed(2)),
            refundAmount: Number(refundAmt.toFixed(2)),
            refundStatus: 'REFUND_PROCESSED'
          }
        };
        return cancelledBooking;
      }
      return b;
    });

    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(updatedBookings));

    // Restore seats to the train
    if (cancelledBooking) {
      const trains = storageService.getTrains();
      const seatCount = cancelledBooking.passengers ? cancelledBooking.passengers.length : 1;
      
      const updatedTrains = trains.map(train => {
        if (train.id === cancelledBooking.trainId || train.trainNumber === cancelledBooking.trainNumber) {
          const updatedClasses = train.classes.map(cls => {
            if (cls.code === cancelledBooking.travelClass) {
              return {
                ...cls,
                availableSeats: Math.min(cls.totalSeats, cls.availableSeats + seatCount)
              };
            }
            return cls;
          });
          return { ...train, classes: updatedClasses };
        }
        return train;
      });
      storageService.saveTrains(updatedTrains);
    }

    return cancelledBooking;
  },

  // USERS & AUTH
  getUsers: () => {
    try {
      const stored = localStorage.getItem(KEYS.USERS);
      if (!stored) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_USERS;
    }
  },

  registerUser: ({ name, email, password, phone, role = 'user' }) => {
    const users = storageService.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'user',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  loginUser: (email, password) => {
    const users = storageService.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }
    storageService.setActiveUser(user);
    return user;
  },

  getActiveUser: () => {
    try {
      const stored = localStorage.getItem(KEYS.ACTIVE_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setActiveUser: (user) => {
    if (user) {
      localStorage.setItem(KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.ACTIVE_USER);
    }
  },

  logout: () => {
    localStorage.removeItem(KEYS.ACTIVE_USER);
  },

  resetToDefault: () => {
    localStorage.setItem(KEYS.TRAINS, JSON.stringify(INITIAL_TRAINS));
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
};
