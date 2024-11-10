// pages/index.js
"use client";

import GalaxyD3 from './components/Galaxy';

export default function Home() {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="header-container">
        <h1 className="title">Generative Solar System</h1>
        <div>
          <button className="button" onClick={() => window.open('https://twitter.com', '_blank')}>[Twitter]</button>
          <button className="button" onClick={() => window.open('https://pump.fun', '_blank')}>[Pump.fun]</button>
        </div>
      </div>

      {/* Main GalaxyD3 Component */}
      <GalaxyD3 />

      {/* Footer Section */}
      <footer style={{ marginTop: '20px', color: 'gray', textAlign: 'center' }}>
      </footer>
    </div>
  );
}
