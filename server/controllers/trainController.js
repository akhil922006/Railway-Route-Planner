import { MOCK_STATIONS, MOCK_TRAINS, MOCK_TRAIN_STOPS } from '../models/mockData.js';
import { dbPool } from '../config/db.js';

// Helper Functions for Time Calculations
function timeToMinutes(timeStr) {
  const [h, m] = String(timeStr).split(':').map(Number);
  return h * 60 + m;
}

function getLayoverMinutes(arrivalTimeA, departureTimeB) {
  const arr = timeToMinutes(arrivalTimeA);
  const dep = timeToMinutes(departureTimeB);
  if (dep >= arr) {
    return dep - arr;
  } else {
    // Overnight calculation: add 24 hours (1440 minutes)
    return (dep + 1440) - arr;
  }
}

function formatMinutes(totalMins) {
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hrs}h ${mins}m`;
}

/**
 * Direct Train Search SQL Query Helper (Phase 6 & 9)
 * Sorted by s1.departure_time ASC
 */
async function getDirectTrainsFromDB(source, destination) {
  const sql = `
    SELECT 
      t.train_no,
      t.train_name,
      s1.departure_time,
      s2.arrival_time
    FROM train_stops s1
    JOIN train_stops s2 ON s1.train_no = s2.train_no
    JOIN trains t ON t.train_no = s1.train_no
    WHERE s1.station_code = ? 
      AND s2.station_code = ? 
      AND s1.stop_order < s2.stop_order
    ORDER BY s1.departure_time ASC;
  `;

  const [rows] = await dbPool.query(sql, [source, destination]);
  return rows.map((r) => {
    const depTime = String(r.departure_time).substring(0, 5);
    const arrTime = String(r.arrival_time).substring(0, 5);
    const durationMins = getLayoverMinutes(depTime, arrTime);

    return {
      train_no: r.train_no,
      train_name: r.train_name,
      departure_time: depTime,
      arrival_time: arrTime,
      duration: formatMinutes(durationMins),
    };
  });
}

/**
 * Connecting Train Search SQL Query Helper (Phase 7, 8 & 9)
 * Sorted by waiting_time_mins ASC directly inside MySQL engine.
 */
async function getConnectingTrainsFromDB(source, destination, interchangeCode, buffer) {
  const sql = `
    SELECT 
      tA.train_no AS trainA_no,
      tA.train_name AS trainA_name,
      s1.departure_time AS trainA_dep,
      s2.arrival_time AS trainA_arr,
      tB.train_no AS trainB_no,
      tB.train_name AS trainB_name,
      s3.departure_time AS trainB_dep,
      s4.arrival_time AS trainB_arr,
      ROUND(
        CASE 
          WHEN TIME_TO_SEC(s3.departure_time) >= TIME_TO_SEC(s2.arrival_time) 
          THEN (TIME_TO_SEC(s3.departure_time) - TIME_TO_SEC(s2.arrival_time)) / 60
          ELSE ((TIME_TO_SEC(s3.departure_time) + 86400) - TIME_TO_SEC(s2.arrival_time)) / 60
        END
      ) AS waiting_time_mins
    FROM train_stops s1
    JOIN train_stops s2 ON s1.train_no = s2.train_no
    JOIN trains tA ON tA.train_no = s1.train_no
    JOIN train_stops s3 ON s3.station_code = s2.station_code
    JOIN train_stops s4 ON s3.train_no = s4.train_no
    JOIN trains tB ON tB.train_no = s3.train_no
    WHERE s1.station_code = ?
      AND s2.station_code = ?
      AND s1.stop_order < s2.stop_order
      AND s3.station_code = ?
      AND s4.station_code = ?
      AND s3.stop_order < s4.stop_order
    HAVING waiting_time_mins >= (? * 60)
    ORDER BY waiting_time_mins ASC;
  `;

  const bufferHours = parseFloat(buffer) || 0;
  const [rows] = await dbPool.query(sql, [source, interchangeCode, interchangeCode, destination, bufferHours]);

  return rows.map((r) => {
    const trainADep = String(r.trainA_dep).substring(0, 5);
    const trainAArr = String(r.trainA_arr).substring(0, 5);
    const trainBDep = String(r.trainB_dep).substring(0, 5);
    const trainBArr = String(r.trainB_arr).substring(0, 5);

    const layoverMins = Number(r.waiting_time_mins);
    const durationAMins = getLayoverMinutes(trainADep, trainAArr);
    const durationBMins = getLayoverMinutes(trainBDep, trainBArr);

    return {
      trainA: {
        train_no: r.trainA_no,
        train_name: r.trainA_name,
        departure_time: trainADep,
        arrival_time: trainAArr,
        duration: formatMinutes(durationAMins),
      },
      trainB: {
        train_no: r.trainB_no,
        train_name: r.trainB_name,
        departure_time: trainBDep,
        arrival_time: trainBArr,
        duration: formatMinutes(durationBMins),
      },
      waitingTimeMins: layoverMins,
      waitingTimeText: formatMinutes(layoverMins),
    };
  });
}

/**
 * Controller: Get List of Stations
 * GET /api/stations
 */
export const getStations = async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT station_code, station_name FROM stations ORDER BY station_name ASC');
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: MOCK_STATIONS,
    });
  }
};

/**
 * Controller: Search Routes
 * POST /api/search
 * Request Body: { source, destination, interchanges: [], buffer: 2 }
 */
export const searchRoutes = async (req, res) => {
  try {
    const { source, destination, interchanges = [], buffer = 2 } = req.body;

    // 1. Validation Logic
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and Destination stations are required.',
      });
    }

    if (source === destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and Destination stations must be different.',
      });
    }

    const validInterchanges = interchanges.filter(Boolean);
    const allSelected = [source, destination, ...validInterchanges];
    const uniqueSelected = new Set(allSelected);

    if (allSelected.length !== uniqueSelected.size) {
      return res.status(400).json({
        success: false,
        message: 'Stations cannot be duplicated in selections.',
      });
    }

    // 2. Direct Train Search (SQL query with ORDER BY departure_time ASC)
    let directResults = [];
    try {
      directResults = await getDirectTrainsFromDB(source, destination);
    } catch (dbErr) {
      MOCK_TRAINS.forEach((train) => {
        const sourceStop = MOCK_TRAIN_STOPS.find(
          (stop) => stop.train_no === train.train_no && stop.station_code === source
        );
        const destStop = MOCK_TRAIN_STOPS.find(
          (stop) => stop.train_no === train.train_no && stop.station_code === destination
        );

        if (sourceStop && destStop && sourceStop.stop_order < destStop.stop_order) {
          const durationMins = getLayoverMinutes(sourceStop.departure_time, destStop.arrival_time);
          directResults.push({
            train_no: train.train_no,
            train_name: train.train_name,
            departure_time: sourceStop.departure_time,
            arrival_time: destStop.arrival_time,
            duration: formatMinutes(durationMins),
          });
        }
      });
      directResults.sort((a, b) => timeToMinutes(a.departure_time) - timeToMinutes(b.departure_time));
    }

    // 3. Connecting Train Search (SQL query with ORDER BY waiting_time_mins ASC)
    const connectingResults = {};
    for (const intCode of validInterchanges) {
      let routes = [];
      try {
        routes = await getConnectingTrainsFromDB(source, destination, intCode, buffer);
      } catch (dbErr) {
        MOCK_TRAINS.forEach((trainA) => {
          const startStop = MOCK_TRAIN_STOPS.find(
            (stop) => stop.train_no === trainA.train_no && stop.station_code === source
          );
          const midStopA = MOCK_TRAIN_STOPS.find(
            (stop) => stop.train_no === trainA.train_no && stop.station_code === intCode
          );

          if (startStop && midStopA && startStop.stop_order < midStopA.stop_order) {
            MOCK_TRAINS.forEach((trainB) => {
              const midStopB = MOCK_TRAIN_STOPS.find(
                (stop) => stop.train_no === trainB.train_no && stop.station_code === intCode
              );
              const endStop = MOCK_TRAIN_STOPS.find(
                (stop) => stop.train_no === trainB.train_no && stop.station_code === destination
              );

              if (midStopB && endStop && midStopB.stop_order < endStop.stop_order) {
                const layoverMins = getLayoverMinutes(midStopA.arrival_time, midStopB.departure_time);
                const bufferMins = buffer * 60;

                if (layoverMins >= bufferMins) {
                  const durationAMins = getLayoverMinutes(startStop.departure_time, midStopA.arrival_time);
                  const durationBMins = getLayoverMinutes(midStopB.departure_time, endStop.arrival_time);

                  routes.push({
                    trainA: {
                      train_no: trainA.train_no,
                      train_name: trainA.train_name,
                      departure_time: startStop.departure_time,
                      arrival_time: midStopA.arrival_time,
                      duration: formatMinutes(durationAMins),
                    },
                    trainB: {
                      train_no: trainB.train_no,
                      train_name: trainB.train_name,
                      departure_time: midStopB.departure_time,
                      arrival_time: endStop.arrival_time,
                      duration: formatMinutes(durationBMins),
                    },
                    waitingTimeMins: layoverMins,
                    waitingTimeText: formatMinutes(layoverMins),
                  });
                }
              }
            });
          }
        });
        routes.sort((a, b) => a.waitingTimeMins - b.waitingTimeMins);
      }
      connectingResults[intCode] = routes;
    }

    return res.status(200).json({
      success: true,
      data: {
        directResults,
        connectingResults,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error processing train route search.',
    });
  }
};
