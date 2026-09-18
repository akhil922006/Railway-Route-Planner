import React from 'react';
import './App.css';
import SearchPage from './pages/SearchPage';

/**
 * App Component
 * 
 * Purpose:
 * Root component that defines the core layout structure of the client application.
 * 
 * Responsibility:
 * - Renders global header navigation (logo, title, mode badge).
 * - Implements main page container grid / alignment.
 * - Renders the footer with copyright information.
 * - Mounts the SearchPage component.
 * 
 * Interaction:
 * - Imports and mounts SearchPage from ./pages/SearchPage.
 * - Styled by App.css and index.css variables.
 */
function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <span className="logo-icon">🚄</span>
            <span className="logo-text">Railway Route Planner</span>
          </div>
          <span className="mentor-badge"></span>
        </div>
      </header>

      <main className="main-content">
        <SearchPage />
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Railway Route Planner. All rights reserved. Designed for CS Internship Preparation.</p>
      </footer>
    </div>
  );
}

export default App;
