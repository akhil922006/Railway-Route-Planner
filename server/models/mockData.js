/**
 * Mock Data Model - Station, Train, and Stop Datasets
 * 
 * Purpose:
 * Provides in-memory data for stations, trains, and scheduled stops.
 * In Phase 5, this will be replaced with MySQL database queries.
 */

export const MOCK_STATIONS = [
  { station_code: 'CLT', station_name: 'Calicut' },
  { station_code: 'CLX', station_name: 'Chirala' },
  { station_code: 'MAS', station_name: 'Chennai Central' },
  { station_code: 'SBC', station_name: 'Bangalore City' },
  { station_code: 'BZA', station_name: 'Vijayawada Jn' },
];

export const MOCK_TRAINS = [
  { train_no: '12602', train_name: 'Mangalore - Chennai Mail' },
  { train_no: '12842', train_name: 'Coromandel Express' },
  { train_no: '12028', train_name: 'Shatabdi Express' },
  { train_no: '12760', train_name: 'Charminar Express' },
  { train_no: '17230', train_name: 'Sabari Express' },
  { train_no: '12685', train_name: 'Chennai - Mangalore Express' },
  { train_no: '16382', train_name: 'Kanyakumari - Pune Express' },
];

export const MOCK_TRAIN_STOPS = [
  // Train 12602: CLT -> MAS
  { id: 1, train_no: '12602', station_code: 'CLT', stop_order: 1, arrival_time: '17:25', departure_time: '17:30' },
  { id: 2, train_no: '12602', station_code: 'MAS', stop_order: 2, arrival_time: '07:15', departure_time: '07:30' },

  // Train 12842: MAS -> CLX (Coromandel)
  { id: 3, train_no: '12842', station_code: 'MAS', stop_order: 1, arrival_time: '09:20', departure_time: '09:30' },
  { id: 4, train_no: '12842', station_code: 'CLX', stop_order: 2, arrival_time: '15:45', departure_time: '15:50' },

  // Train 12028: SBC -> MAS (Bangalore to Chennai)
  { id: 5, train_no: '12028', station_code: 'SBC', stop_order: 1, arrival_time: '06:00', departure_time: '06:00' },
  { id: 6, train_no: '12028', station_code: 'MAS', stop_order: 2, arrival_time: '11:00', departure_time: '11:15' },

  // Train 12760: MAS -> CLX (Charminar)
  { id: 7, train_no: '12760', station_code: 'MAS', stop_order: 1, arrival_time: '17:50', departure_time: '18:00' },
  { id: 8, train_no: '12760', station_code: 'CLX', stop_order: 2, arrival_time: '23:45', departure_time: '23:50' },

  // Train 17230: CLT -> CLX (Direct Train - Sabari Express)
  { id: 9, train_no: '17230', station_code: 'CLT', stop_order: 1, arrival_time: '12:00', departure_time: '12:05' },
  { id: 10, train_no: '17230', station_code: 'CLX', stop_order: 2, arrival_time: '23:30', departure_time: '23:35' },
  
  // Train 12685: CLT -> SBC
  { id: 11, train_no: '12685', station_code: 'CLT', stop_order: 1, arrival_time: '08:00', departure_time: '08:05' },
  { id: 12, train_no: '12685', station_code: 'SBC', stop_order: 2, arrival_time: '16:00', departure_time: '16:10' },

  // Train 16382: SBC -> CLX
  { id: 13, train_no: '16382', station_code: 'SBC', stop_order: 1, arrival_time: '17:00', departure_time: '17:15' },
  { id: 14, train_no: '16382', station_code: 'CLX', stop_order: 2, arrival_time: '23:55', departure_time: '23:59' },
];
