import * as XLSX from 'xlsx';

/**
 * Exports railway booking records to an Excel (.xlsx) file with professional formatting.
 * @param {Array} bookings - List of booking objects
 * @param {string} fileNamePrefix - Custom file name prefix
 */
export const exportBookingsToExcel = (bookings, fileNamePrefix = 'Indian_Railways_Bookings_Report') => {
  if (!bookings || bookings.length === 0) {
    throw new Error('No booking records available to export.');
  }

  // 1. Prepare detailed Passenger Level Data
  const passengerRows = [];

  bookings.forEach((b, bookingIdx) => {
    const passengers = b.passengers && b.passengers.length > 0 
      ? b.passengers 
      : [{ name: 'N/A', age: '-', gender: '-', berth: '-', berthType: '-', status: b.status }];

    passengers.forEach((p, pIdx) => {
      passengerRows.push({
        'S.No': passengerRows.length + 1,
        'PNR Number': b.pnr,
        'Booking ID': b.bookingId || `BK-${bookingIdx + 1000}`,
        'Booking Status': b.status,
        'Train Number': b.trainNumber,
        'Train Name': b.trainName,
        'From Station': b.boardingStationName || b.fromStation,
        'To Station': b.droppingStationName || b.toStation,
        'Journey Date': b.journeyDate,
        'Departure Time': b.departureTime || '-',
        'Arrival Time': b.arrivalTime || '-',
        'Class': b.travelClass,
        'Quota': b.quota || 'General',
        'Passenger Name': p.name,
        'Age': p.age,
        'Gender': p.gender,
        'Coach / Seat No': p.berth || 'Allocated on Chart',
        'Berth Type': p.berthType || 'Standard',
        'Seat Status': p.status || b.status,
        'Total Ticket Fare (₹)': pIdx === 0 ? b.totalFare : 0, // avoid double counting in sum
        'Payment Mode': b.paymentMode || 'UPI',
        'Transaction ID': b.transactionId || 'N/A',
        'Booking Timestamp': b.bookingDate || 'N/A',
        'Booked By (User)': b.bookedBy ? `${b.bookedBy.name} (${b.bookedBy.email})` : 'Self',
        'Refund Status': b.cancellationDetails ? b.cancellationDetails.refundStatus : (b.status === 'CANCELLED' ? 'PROCESSED' : 'N/A'),
        'Refund Amount (₹)': b.cancellationDetails ? b.cancellationDetails.refundAmount : 0
      });
    });
  });

  // 2. Prepare Booking Summary Data (Aggregated per PNR)
  const summaryRows = bookings.map((b, idx) => ({
    'S.No': idx + 1,
    'PNR': b.pnr,
    'Train': `${b.trainNumber} - ${b.trainName}`,
    'Route': `${b.fromStation} ➔ ${b.toStation}`,
    'Journey Date': b.journeyDate,
    'Class': b.travelClass,
    'Passenger Count': b.passengers ? b.passengers.length : 1,
    'Total Amount (₹)': b.totalFare,
    'Status': b.status,
    'Booked On': b.bookingDate,
    'Booked By': b.bookedBy ? b.bookedBy.name : 'User'
  }));

  // Create a new Workbook
  const workbook = XLSX.utils.book_new();

  // Create Sheet 1: Detailed Passenger Bookings
  const wsDetailed = XLSX.utils.json_to_sheet(passengerRows);
  
  // Set Column Widths for readability
  wsDetailed['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 15 }, // PNR
    { wch: 12 }, // Booking ID
    { wch: 14 }, // Status
    { wch: 12 }, // Train No
    { wch: 28 }, // Train Name
    { wch: 24 }, // From
    { wch: 24 }, // To
    { wch: 14 }, // Journey Date
    { wch: 14 }, // Departure
    { wch: 14 }, // Arrival
    { wch: 8 },  // Class
    { wch: 10 }, // Quota
    { wch: 22 }, // Passenger Name
    { wch: 6 },  // Age
    { wch: 8 },  // Gender
    { wch: 18 }, // Seat No
    { wch: 16 }, // Berth Type
    { wch: 12 }, // Seat Status
    { wch: 20 }, // Total Ticket Fare
    { wch: 18 }, // Payment Mode
    { wch: 18 }, // Transaction ID
    { wch: 20 }, // Booking Timestamp
    { wch: 30 }, // Booked By
    { wch: 16 }, // Refund Status
    { wch: 18 }  // Refund Amount
  ];

  // Create Sheet 2: High Level Summary
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary['!cols'] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 30 },
    { wch: 20 },
    { wch: 14 },
    { wch: 8 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 20 },
    { wch: 22 }
  ];

  // Append Sheets to Workbook
  XLSX.utils.book_append_sheet(workbook, wsDetailed, 'Passenger Bookings');
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'PNR Summary');

  // Generate Date-stamped File Name
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const fileName = `${fileNamePrefix}_${dateStr}_${timeStr}.xlsx`;

  // Write and trigger browser download
  XLSX.writeFile(workbook, fileName);
  return fileName;
};
