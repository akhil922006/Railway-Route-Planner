import React, { useState, useEffect } from 'react';
import './SearchPage.css';
import { fetchStations, searchTrainRoutes } from '../services/api';

function SearchPage() {
  // Dynamic Stations Data from Backend API
  const [stations, setStations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form Input State Variables
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [interchange1, setInterchange1] = useState('');
  const [interchange2, setInterchange2] = useState('');
  const [interchange3, setInterchange3] = useState('');
  const [buffer, setBuffer] = useState(2); // Default 2 hours

  // Query Result & UI States
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [directResults, setDirectResults] = useState([]);
  const [connectingResults, setConnectingResults] = useState({});

  // 1. Fetch available stations from Express API on component mount
  useEffect(() => {
    async function loadStations() {
      try {
        setInitialLoading(true);
        setApiError('');
        const data = await fetchStations();
        setStations(data);

        // Set initial defaults if stations returned
        if (data && data.length >= 2) {
          setSource(data[0].station_code); // Default Calicut (CLT)
          setDestination(data[1].station_code); // Default Chirala (CLX)
          if (data.length >= 3) {
            setInterchange1(data[2].station_code); // Default Chennai Central (MAS)
          }
        }
      } catch (err) {
        setApiError('Unable to connect to Express API. Ensure server is running on http://localhost:5000.');
      } finally {
        setInitialLoading(false);
      }
    }

    loadStations();
  }, []);

  // 2. Form Submit & API Search Handler
  const handleSearch = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setValidationError('');
    setApiError('');

    // Input Validations
    if (!source || !destination) {
      setValidationError('Please select both Source and Destination stations.');
      return;
    }

    if (source === destination) {
      setValidationError('Source and Destination stations must be different.');
      return;
    }

    const interchanges = [interchange1, interchange2, interchange3].filter(Boolean);
    const allSelected = [source, destination, ...interchanges];
    const uniqueSelected = new Set(allSelected);

    if (allSelected.length !== uniqueSelected.size) {
      setValidationError('Stations cannot be duplicated in your selections.');
      return;
    }

    if (buffer < 0 || buffer > 24) {
      setValidationError('Layover buffer time must be between 0 and 24 hours.');
      return;
    }

    // Call Backend Express API
    try {
      setLoading(true);
      const searchPayload = {
        source,
        destination,
        interchanges,
        buffer,
      };

      const result = await searchTrainRoutes(searchPayload);
      setDirectResults(result.directResults || []);
      setConnectingResults(result.connectingResults || {});
      setSearched(true);
    } catch (err) {
      setApiError(err.message || 'Failed to communicate with the route search server.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to resolve Station Code to Name
  const getStationName = (code) => {
    const st = stations.find((s) => s.station_code === code);
    return st ? `${st.station_name} (${st.station_code})` : code;
  };

  return (
    <div className="search-page animate-fade-in">
      {/* Left Column: Form Panel */}
      <aside className="search-panel">
        <h2 className="panel-title">
          <span className="logo-icon">🗺️</span> Plan Route
        </h2>

        {initialLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            ⏳ Loading stations from Express API...
          </div>
        ) : (
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-group">
              <label htmlFor="source">Source Station *</label>
              <div className="input-container">
                <span className="input-icon">🏁</span>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="">Select Source</option>
                  {stations.map((s) => (
                    <option key={s.station_code} value={s.station_code}>
                      {s.station_name} ({s.station_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination Station *</label>
              <div className="input-container">
                <span className="input-icon">🎯</span>
                <select
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">Select Destination</option>
                  {stations.map((s) => (
                    <option key={s.station_code} value={s.station_code}>
                      {s.station_name} ({s.station_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-divider">Interchanges (Optional)</div>

            <div className="form-group">
              <label htmlFor="interchange1">Interchange Station 1</label>
              <div className="input-container">
                <span className="input-icon">🔄</span>
                <select
                  id="interchange1"
                  value={interchange1}
                  onChange={(e) => setInterchange1(e.target.value)}
                >
                  <option value="">None</option>
                  {stations.map((s) => (
                    <option key={s.station_code} value={s.station_code}>
                      {s.station_name} ({s.station_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="interchange2">Interchange Station 2</label>
              <div className="input-container">
                <span className="input-icon">🔄</span>
                <select
                  id="interchange2"
                  value={interchange2}
                  onChange={(e) => setInterchange2(e.target.value)}
                >
                  <option value="">None</option>
                  {stations.map((s) => (
                    <option key={s.station_code} value={s.station_code}>
                      {s.station_name} ({s.station_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="interchange3">Interchange Station 3</label>
              <div className="input-container">
                <span className="input-icon">🔄</span>
                <select
                  id="interchange3"
                  value={interchange3}
                  onChange={(e) => setInterchange3(e.target.value)}
                >
                  <option value="">None</option>
                  {stations.map((s) => (
                    <option key={s.station_code} value={s.station_code}>
                      {s.station_name} ({s.station_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-divider">Buffer Settings</div>

            <div className="form-group">
              <label htmlFor="buffer">Min Buffer Time (Hours)</label>
              <div className="input-container">
                <span className="input-icon">⏱️</span>
                <input
                  type="number"
                  id="buffer"
                  min="0"
                  max="24"
                  value={buffer}
                  onChange={(e) => setBuffer(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {validationError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ {validationError}
              </div>
            )}

            {apiError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                ❌ {apiError}
              </div>
            )}

            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? (
                <span>⏳ Querying Express API...</span>
              ) : (
                <>
                  <span>🔍</span> Find Trains
                </>
              )}
            </button>
          </form>
        )}
      </aside>

      {/* Right Column: Results Section */}
      <main className="results-area">
        {loading ? (
          <div className="cards-grid animate-fade-in">
            <div className="skeleton-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skeleton-bar title"></div>
                <div className="skeleton-bar badge"></div>
              </div>
              <div className="skeleton-bar timeline"></div>
              <div className="skeleton-bar timeline"></div>
            </div>
            <div className="skeleton-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="skeleton-bar title"></div>
                <div className="skeleton-bar badge"></div>
              </div>
              <div className="skeleton-bar timeline"></div>
            </div>
          </div>
        ) : !searched ? (
          <div className="empty-state">
            <span className="empty-icon">🗺️</span>
            <h3>Plan Your Train Journey</h3>
            <p>Select your source, destination, preferred interchanges, layover buffer time, and click "Find Trains".</p>
          </div>
        ) : (
          <>
            {/* 1. Direct Trains Section */}
            <section>
              <div className="section-header">
                <h2><span>🟢</span> Direct Trains</h2>
                <span className="results-count">
                  {directResults.length} Option{directResults.length !== 1 ? 's' : ''} Found
                </span>
              </div>

              {directResults.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🚆</span>
                  <p>No direct trains available between {getStationName(source)} and {getStationName(destination)}.</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {directResults.map((route, i) => (
                    <div key={i} className="train-card direct-route">
                      <div className="card-header">
                        <div className="train-info">
                          <span className="train-number">Train {route.train_no}</span>
                          <h3 className="train-name">{route.train_name}</h3>
                        </div>
                        <span className="route-type-badge direct">Direct</span>
                      </div>

                      <div className="timeline-container">
                        <div className="timeline-node">
                          <span className="node-time">{route.departure_time}</span>
                          <span className="node-station">{getStationName(source)}</span>
                        </div>

                        <div className="timeline-line">
                          <span className="timeline-duration">{route.duration}</span>
                        </div>

                        <div className="timeline-node" style={{ alignItems: 'flex-end' }}>
                          <span className="node-time">{route.arrival_time}</span>
                          <span className="node-station">{getStationName(destination)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 2. Connecting Trains Sections */}
            {[interchange1, interchange2, interchange3].filter(Boolean).map((intCode) => {
              const routes = connectingResults[intCode] || [];
              return (
                <section key={intCode}>
                  <div className="section-header">
                    <h2><span>🟡</span> Connecting Routes via {getStationName(intCode)}</h2>
                    <span className="results-count">
                      {routes.length} Route{routes.length !== 1 ? 's' : ''} Found
                    </span>
                  </div>

                  {routes.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">🚆</span>
                      <p>No valid connecting trains found matching layover buffer times through {getStationName(intCode)}.</p>
                    </div>
                  ) : (
                    <div className="cards-grid">
                      {routes.map((route, index) => (
                        <div key={index} className="train-card">
                          <div className="card-header">
                            <div className="train-info">
                              <span className="train-number">Connecting Route #{index + 1}</span>
                              <h3 className="train-name">Via {getStationName(intCode)}</h3>
                            </div>
                            <span className={`route-type-badge ${index === 0 ? 'fastest' : 'connecting'}`}>
                              {index === 0 ? '✨ Fastest Option' : 'Connecting'}
                            </span>
                          </div>

                          {/* Train A */}
                          <div className="timeline-container">
                            <div className="timeline-node">
                              <span className="node-time">{route.trainA.departure_time}</span>
                              <span className="node-station">{getStationName(source)}</span>
                            </div>
                            <div className="timeline-line">
                              <span className="timeline-duration">Train {route.trainA.train_no} ({route.trainA.duration})</span>
                            </div>
                            <div className="timeline-node" style={{ alignItems: 'flex-end' }}>
                              <span className="node-time">{route.trainA.arrival_time}</span>
                              <span className="node-station">{getStationName(intCode)}</span>
                            </div>
                          </div>

                          {/* Layover detail */}
                          <div className="connecting-summary">
                            <span>Layover Interchange: <strong>{getStationName(intCode)}</strong></span>
                            <span className="layover-pill">Waiting: {route.waitingTimeText}</span>
                          </div>

                          {/* Train B */}
                          <div className="timeline-container">
                            <div className="timeline-node">
                              <span className="node-time">{route.trainB.departure_time}</span>
                              <span className="node-station">{getStationName(intCode)}</span>
                            </div>
                            <div className="timeline-line">
                              <span className="timeline-duration">Train {route.trainB.train_no} ({route.trainB.duration})</span>
                            </div>
                            <div className="timeline-node" style={{ alignItems: 'flex-end' }}>
                              <span className="node-time">{route.trainB.arrival_time}</span>
                              <span className="node-station">{getStationName(destination)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
