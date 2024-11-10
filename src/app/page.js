// pages/index.js
"use client";

import React, { useState } from 'react';
import GalaxyD3 from './components/Galaxy';

export default function Home() {
  const [showDialog, setShowDialog] = useState(true);

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header-container">
        <h1 className="title">Generative Solar System</h1>
        <div>
          <button className="button" onClick={() => window.open('https://x.com/GenSolarSystem', '_blank')}>[Twitter]</button>
          <button className="button" onClick={() => window.open('https://pump.fun', '_blank')}>[Pump.fun]</button>
        </div>
      </div>

      {/* Centered Performance Tip Dialog */}
      {showDialog && (
        <div className="dialog">
          <p>If the page becomes unresponsive, try refreshing to improve performance.</p>
          <button className="dialog-button" onClick={() => setShowDialog(false)}>Dismiss</button>
        </div>
      )}

      {/* Main GalaxyD3 Component */}
      <GalaxyD3 />

      {/* Footer Section */}
      <footer style={{ marginTop: '20px', color: 'gray', textAlign: 'center' }}>
      </footer>
    </div>
  );
}
