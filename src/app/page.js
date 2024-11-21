"use client";

import React, { useState } from "react";
import SoldierField from "./components/SoldierField";

export default function Home() {
  const [showDialog, setShowDialog] = useState(true);

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header-container">
        <h1 className="title">Trench Soldier Battlefield</h1>
        <div>
          <button
            className="button"
            onClick={() => window.open("https://x.com/TrenchCoin", "_blank")}
          >
            [Twitter]
          </button>
          <button
            className="button"
            onClick={() => window.open("https://pump.fun", "_blank")}
          >
            [Pump.fun]
          </button>
        </div>
      </div>

      {/* Performance Tip Dialog */}
      {showDialog && (
        <div className="dialog">
          <p>If the page becomes unresponsive, try refreshing to improve performance.</p>
          <button
            className="dialog-button"
            onClick={() => setShowDialog(false)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main SoldierField Component */}
      <SoldierField />

      {/* Footer */}
      <footer style={{ marginTop: "20px", color: "gray", textAlign: "center" }}>
        <p>&copy; {new Date().getFullYear()} Trench Soldier Coin</p>
      </footer>
    </div>
  );
}