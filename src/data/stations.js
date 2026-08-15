export const STATIONS = [
  { code: 'MAS', name: 'Chennai Central (Puratchi Thalaivar Dr. MGR)', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu' },
  { code: 'TPJ', name: 'Tiruchchirappalli Junction (Trichy)', city: 'Tiruchchirappalli', state: 'Tamil Nadu' },
  { code: 'SA', name: 'Salem Junction', city: 'Salem', state: 'Tamil Nadu' },
  { code: 'ED', name: 'Erode Junction', city: 'Erode', state: 'Tamil Nadu' },
  { code: 'TEN', name: 'Tirunelveli Junction', city: 'Tirunelveli', state: 'Tamil Nadu' },
  { code: 'CAPE', name: 'Kanyakumari', city: 'Kanyakumari', state: 'Tamil Nadu' },
  { code: 'RMM', name: 'Rameswaram', city: 'Rameswaram', state: 'Tamil Nadu' },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'CSMT', name: 'Mumbai Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala' },
  { code: 'ERS', name: 'Ernakulam Junction (South)', city: 'Kochi', state: 'Kerala' }
];

export const getClassDetails = (classCode) => {
  const classes = {
    '1A': { name: 'First AC (1A)', multiplier: 3.5, description: 'Coupe/Cabin with full luxury, bedding & meals' },
    '2A': { name: 'AC 2-Tier (2A)', multiplier: 2.2, description: 'Air-conditioned 2-tier berths with curtains' },
    '3A': { name: 'AC 3-Tier (3A)', multiplier: 1.6, description: 'Air-conditioned 3-tier berths with bedding' },
    'SL': { name: 'Sleeper Class (SL)', multiplier: 1.0, description: 'Standard non-AC 3-tier sleeper berths' },
    'CC': { name: 'AC Chair Car (CC)', multiplier: 1.4, description: 'Air-conditioned push-back comfortable seats' },
    '2S': { name: 'Second Sitting (2S)', multiplier: 0.6, description: 'Reserved cushioned sitting accommodation' }
  };
  return classes[classCode] || { name: classCode, multiplier: 1.0, description: 'General' };
};
