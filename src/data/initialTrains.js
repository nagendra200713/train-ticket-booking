export const INITIAL_TRAINS = [
  {
    id: 'tr_12675',
    trainNumber: '12675',
    trainName: 'Kovai Superfast Express',
    trainType: 'Superfast Express',
    fromStation: 'MAS',
    toStation: 'CBE',
    departureTime: '06:10',
    arrivalTime: '14:05',
    duration: '7h 55m',
    distanceKm: 495,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', baseFare: 615, totalSeats: 48, availableSeats: 32 },
      { code: '2S', baseFare: 195, totalSeats: 60, availableSeats: 45 }
    ],
    route: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: 'Source', departure: '06:10', halt: '-', day: 1, distance: 0, platform: '10' },
      { stationCode: 'AJJ', stationName: 'Arakkonam Jn', arrival: '07:08', departure: '07:10', halt: '2m', day: 1, distance: 69, platform: '1' },
      { stationCode: 'KPD', stationName: 'Katpadi Jn (Vellore)', arrival: '07:58', departure: '08:00', halt: '2m', day: 1, distance: 130, platform: '1' },
      { stationCode: 'JTJ', stationName: 'Jolarpettai Jn', arrival: '09:08', departure: '09:10', halt: '2m', day: 1, distance: 214, platform: '2' },
      { stationCode: 'SA', stationName: 'Salem Jn', arrival: '10:32', departure: '10:35', halt: '3m', day: 1, distance: 335, platform: '4' },
      { stationCode: 'ED', stationName: 'Erode Jn', arrival: '11:32', departure: '11:35', halt: '3m', day: 1, distance: 395, platform: '2' },
      { stationCode: 'TUP', stationName: 'Tiruppur', arrival: '12:18', departure: '12:20', halt: '2m', day: 1, distance: 445, platform: '1' },
      { stationCode: 'CBE', stationName: 'Coimbatore Jn', arrival: '14:05', departure: 'Destination', halt: '-', day: 1, distance: 495, platform: '3' }
    ],
    liveStatus: {
      currentStation: 'SA',
      status: 'Running on Time',
      delayMinutes: 0,
      nextStation: 'ED',
      estimatedArrival: '11:32'
    }
  },
  {
    id: 'tr_20643',
    trainNumber: '20643',
    trainName: 'Coimbatore Vande Bharat Express',
    trainType: 'Vande Bharat Express',
    fromStation: 'MAS',
    toStation: 'CBE',
    departureTime: '14:25',
    arrivalTime: '20:15',
    duration: '5h 50m',
    distanceKm: 495,
    runsOn: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', baseFare: 1265, totalSeats: 52, availableSeats: 18 },
      { code: '1A', baseFare: 2405, totalSeats: 24, availableSeats: 8 }
    ],
    route: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: 'Source', departure: '14:25', halt: '-', day: 1, distance: 0, platform: '2A' },
      { stationCode: 'SA', stationName: 'Salem Jn', arrival: '17:48', departure: '17:50', halt: '2m', day: 1, distance: 335, platform: '1' },
      { stationCode: 'ED', stationName: 'Erode Jn', arrival: '18:32', departure: '18:35', halt: '3m', day: 1, distance: 395, platform: '2' },
      { stationCode: 'TUP', stationName: 'Tiruppur', arrival: '19:13', departure: '19:15', halt: '2m', day: 1, distance: 445, platform: '1' },
      { stationCode: 'CBE', stationName: 'Coimbatore Jn', arrival: '20:15', departure: 'Destination', halt: '-', day: 1, distance: 495, platform: '1B' }
    ],
    liveStatus: {
      currentStation: 'MAS',
      status: 'Departing Soon',
      delayMinutes: 0,
      nextStation: 'SA',
      estimatedArrival: '17:48'
    }
  },
  {
    id: 'tr_12637',
    trainNumber: '12637',
    trainName: 'Pandian Superfast Express',
    trainType: 'Superfast Express',
    fromStation: 'MS',
    toStation: 'MDU',
    departureTime: '21:40',
    arrivalTime: '05:25',
    duration: '7h 45m',
    distanceKm: 497,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: '1A', baseFare: 2150, totalSeats: 18, availableSeats: 6 },
      { code: '2A', baseFare: 1280, totalSeats: 36, availableSeats: 14 },
      { code: '3A', baseFare: 895, totalSeats: 64, availableSeats: 29 },
      { code: 'SL', baseFare: 330, totalSeats: 72, availableSeats: 42 }
    ],
    route: [
      { stationCode: 'MS', stationName: 'Chennai Egmore', arrival: 'Source', departure: '21:40', halt: '-', day: 1, distance: 0, platform: '4' },
      { stationCode: 'TBM', stationName: 'Tambaram', arrival: '22:08', departure: '22:10', halt: '2m', day: 1, distance: 25, platform: '8' },
      { stationCode: 'CGL', stationName: 'Chengalpattu Jn', arrival: '22:38', departure: '22:40', halt: '2m', day: 1, distance: 56, platform: '6' },
      { stationCode: 'VM', stationName: 'Villupuram Jn', arrival: '00:05', departure: '00:10', halt: '5m', day: 2, distance: 159, platform: '3' },
      { stationCode: 'VRI', stationName: 'Vriddhachalam Jn', arrival: '00:50', departure: '00:52', halt: '2m', day: 2, distance: 213, platform: '3' },
      { stationCode: 'TPJ', stationName: 'Tiruchchirappalli Jn', arrival: '02:40', departure: '02:45', halt: '5m', day: 2, distance: 337, platform: '1' },
      { stationCode: 'DG', stationName: 'Dindigul Jn', arrival: '03:57', departure: '04:00', halt: '3m', day: 2, distance: 431, platform: '2' },
      { stationCode: 'MDU', stationName: 'Madurai Jn', arrival: '05:25', departure: 'Destination', halt: '-', day: 2, distance: 497, platform: '1' }
    ],
    liveStatus: {
      currentStation: 'TPJ',
      status: 'Running Late by 5 mins',
      delayMinutes: 5,
      nextStation: 'DG',
      estimatedArrival: '04:02'
    }
  },
  {
    id: 'tr_12631',
    trainNumber: '12631',
    trainName: 'Nellai Superfast Express',
    trainType: 'Superfast Express',
    fromStation: 'MS',
    toStation: 'TEN',
    departureTime: '20:10',
    arrivalTime: '06:40',
    duration: '10h 30m',
    distanceKm: 650,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: '1A', baseFare: 2680, totalSeats: 18, availableSeats: 4 },
      { code: '2A', baseFare: 1590, totalSeats: 36, availableSeats: 11 },
      { code: '3A', baseFare: 1120, totalSeats: 64, availableSeats: 22 },
      { code: 'SL', baseFare: 410, totalSeats: 72, availableSeats: 38 }
    ],
    route: [
      { stationCode: 'MS', stationName: 'Chennai Egmore', arrival: 'Source', departure: '20:10', halt: '-', day: 1, distance: 0, platform: '5' },
      { stationCode: 'VM', stationName: 'Villupuram Jn', arrival: '22:28', departure: '22:30', halt: '2m', day: 1, distance: 159, platform: '2' },
      { stationCode: 'TPJ', stationName: 'Tiruchchirappalli Jn', arrival: '01:10', departure: '01:15', halt: '5m', day: 2, distance: 337, platform: '2' },
      { stationCode: 'MDU', stationName: 'Madurai Jn', arrival: '03:40', departure: '03:45', halt: '5m', day: 2, distance: 497, platform: '3' },
      { stationCode: 'VPT', stationName: 'Virudhunagar Jn', arrival: '04:23', departure: '04:25', halt: '2m', day: 2, distance: 540, platform: '2' },
      { stationCode: 'CVP', stationName: 'Kovilpatti', arrival: '05:08', departure: '05:10', halt: '2m', day: 2, distance: 588, platform: '1' },
      { stationCode: 'TEN', stationName: 'Tirunelveli Jn', arrival: '06:40', departure: 'Destination', halt: '-', day: 2, distance: 650, platform: '1' }
    ],
    liveStatus: {
      currentStation: 'MS',
      status: 'On Time',
      delayMinutes: 0,
      nextStation: 'VM',
      estimatedArrival: '22:28'
    }
  },
  {
    id: 'tr_12007',
    trainNumber: '12007',
    trainName: 'Mysuru Shatabdi Express',
    trainType: 'Shatabdi Express',
    fromStation: 'MAS',
    toStation: 'SBC',
    departureTime: '06:00',
    arrivalTime: '10:55',
    duration: '4h 55m',
    distanceKm: 360,
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: 'CC', baseFare: 985, totalSeats: 56, availableSeats: 25 },
      { code: '1A', baseFare: 1850, totalSeats: 24, availableSeats: 9 }
    ],
    route: [
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: 'Source', departure: '06:00', halt: '-', day: 1, distance: 0, platform: '2' },
      { stationCode: 'KPD', stationName: 'Katpadi Jn', arrival: '07:33', departure: '07:35', halt: '2m', day: 1, distance: 130, platform: '1' },
      { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrival: '10:18', departure: '10:20', halt: '2m', day: 1, distance: 346, platform: '4' },
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrival: '10:55', departure: 'Destination', halt: '-', day: 1, distance: 360, platform: '7' }
    ],
    liveStatus: {
      currentStation: 'KPD',
      status: 'On Time',
      delayMinutes: 0,
      nextStation: 'KJM',
      estimatedArrival: '10:18'
    }
  },
  {
    id: 'tr_12622',
    trainNumber: '12622',
    trainName: 'Tamil Nadu Superfast Express',
    trainType: 'Superfast Express',
    fromStation: 'NDLS',
    toStation: 'MAS',
    departureTime: '21:05',
    arrivalTime: '06:35',
    duration: '33h 30m',
    distanceKm: 2182,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { code: '1A', baseFare: 5490, totalSeats: 18, availableSeats: 5 },
      { code: '2A', baseFare: 3210, totalSeats: 36, availableSeats: 12 },
      { code: '3A', baseFare: 2240, totalSeats: 64, availableSeats: 28 },
      { code: 'SL', baseFare: 840, totalSeats: 72, availableSeats: 40 }
    ],
    route: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrival: 'Source', departure: '21:05', halt: '-', day: 1, distance: 0, platform: '3' },
      { stationCode: 'AGC', stationName: 'Agra Cantt', arrival: '23:25', departure: '23:27', halt: '2m', day: 1, distance: 195, platform: '1' },
      { stationCode: 'GWL', stationName: 'Gwalior Jn', arrival: '01:13', departure: '01:15', halt: '2m', day: 2, distance: 313, platform: '1' },
      { stationCode: 'VGLJ', stationName: 'V Lakshmibai (Jhansi)', arrival: '02:35', departure: '02:43', halt: '8m', day: 2, distance: 410, platform: '2' },
      { stationCode: 'BPL', stationName: 'Bhopal Jn', arrival: '06:45', departure: '06:50', halt: '5m', day: 2, distance: 702, platform: '1' },
      { stationCode: 'NGP', stationName: 'Nagpur Jn', arrival: '13:05', departure: '13:10', halt: '5m', day: 2, distance: 1092, platform: '2' },
      { stationCode: 'BPQ', stationName: 'Balharshah', arrival: '16:25', departure: '16:30', halt: '5m', day: 2, distance: 1301, platform: '1' },
      { stationCode: 'BZA', stationName: 'Vijayawada Jn', arrival: '23:15', departure: '23:25', halt: '10m', day: 2, distance: 1751, platform: '4' },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrival: '06:35', departure: 'Destination', halt: '-', day: 3, distance: 2182, platform: '4' }
    ],
    liveStatus: {
      currentStation: 'BZA',
      status: 'On Time',
      delayMinutes: 0,
      nextStation: 'MAS',
      estimatedArrival: '06:35'
    }
  }
];
