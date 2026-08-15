// Generates a standard Indian Railways-style 10-digit PNR (e.g., 423-8910452)
export const generatePNR = () => {
  const zonePrefix = ['41', '42', '43', '44', '61', '62', '82', '24'][Math.floor(Math.random() * 8)];
  const randomMiddle = Math.floor(1000 + Math.random() * 9000).toString();
  const randomSuffix = Math.floor(100 + Math.random() * 900).toString();
  
  const fullPnr = `${zonePrefix}${randomMiddle}${randomSuffix}`;
  return `${fullPnr.slice(0, 3)}-${fullPnr.slice(3)}`;
};

export const formatPNR = (pnr) => {
  if (!pnr) return '';
  const clean = pnr.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return pnr;
};
