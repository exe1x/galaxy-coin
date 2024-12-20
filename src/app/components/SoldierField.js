"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const WS_URL = "wss://galaxy-back-9a36e3ecdac2.herokuapp.com/";

const SoldierField = () => {
  const svgRef = useRef();
  const [allHolders, setAllHolders] = useState([]);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedHolders, setHighlightedHolders] = useState([]);
  const battlefieldData = useRef([]);
  const retryInterval = useRef(null);

  const sortedAmounts = allHolders.map((d) => d.amount).sort((a, b) => a - b);

  const calculateRank = (amount) => {
    if (amount >= d3.quantile(sortedAmounts, 0.99)) return "tank"; // Top 1%
    if (amount >= d3.quantile(sortedAmounts, 0.9)) return "general"; // Top 10%
    if (amount >= d3.quantile(sortedAmounts, 0.8)) return "captain"; // Top 20%
    if (amount >= d3.quantile(sortedAmounts, 0.5)) return "lieutenant"; // Top 50%
    return "soldier"; // Bottom 50%
  };

  const determineColorByAddress = (address) => {
    const startChar = address[0].toLowerCase();
    const colors = {
      "0": "#e63946",
      "1": "#e63946",
      "2": "#f4a261",
      "3": "#f4a261",
      "4": "#2a9d8f",
      "5": "#2a9d8f",
      "6": "#264653",
      "7": "#264653",
      "8": "#457b9d",
      "9": "#457b9d",
      a: "#8e44ad",
      b: "#8e44ad",
      c: "#f39c12",
      d: "#f39c12",
      e: "#d4ac0d",
      f: "#d4ac0d",
      g: "#28b463",
      h: "#28b463",
      i: "#c0392b",
      j: "#c0392b",
      k: "#3498db",
      l: "#3498db",
      m: "#1abc9c",
      n: "#1abc9c",
      o: "#9b59b6",
      p: "#9b59b6",
      q: "#e74c3c",
      r: "#e74c3c",
      s: "#2980b9",
      t: "#2980b9",
      u: "#16a085",
      v: "#16a085",
      w: "#7f8c8d",
      x: "#7f8c8d",
      y: "#34495e",
      z: "#34495e",
    };
    return colors[startChar];
  };
  const hashStringToPosition = (str, maxX, maxY) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const normalizedHash = Math.abs(hash);
    return {
      x: (normalizedHash % maxX) + 50, // Ensure padding
      y: ((normalizedHash >> 16) % maxY) + 50, // Ensure padding
    };
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update the search query
  };

  const handleHolderClick = (holderAddress) => {
    // Toggle the highlight for the clicked holder
    if (highlightedHolders.includes(holderAddress)) {
      setHighlightedHolders([]); // Deselect if already highlighted
    } else {
      setHighlightedHolders([holderAddress]); // Highlight only the clicked holder
    }
  };


  const generateEntity = (holder, width, height) => {
    const rank = calculateRank(holder.amount);
    const { x, y } = hashStringToPosition(holder.holder, width - 100, height - 100); // Use hashed positions

    // Handle General Tate explicitly

    // Handle other ranks
    return {
      ...holder,
      type: rank === "tank" ? "tank" : "soldier", // Tanks are distinct
      traits: {
        color: determineColorByAddress(holder.holder),
        size: rank === "tank" ? 50 : 20, // Larger size for tanks
        rank: rank, // Assign rank for tooltip
      },
      x, // Deterministic x position
      y, // Deterministic y position
    };
  };


  const connectWebSocket = () => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      clearInterval(retryInterval.current); // Clear retry interval on success
      retryInterval.current = null;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data from WebSocket:", data); // Debugging
        setAllHolders(data);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");

      if (!retryInterval.current) {
        retryInterval.current = setInterval(() => {
          console.log("Attempting reconnection...");
          connectWebSocket();
        }, 5000);
      }
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      clearInterval(retryInterval.current);
    };
  }, []);

  useEffect(() => {
    if (allHolders.length === 0) return;

    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style(
        "background",
        `
          repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 50px),
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 50px),
          radial-gradient(circle at 20% 30%, #4a3b27, #2e2618 80%),
          radial-gradient(circle at 80% 70%, #3b2f1e, #1a1410 90%),
          linear-gradient(135deg, rgba(50, 50, 50, 0.2), rgba(0, 0, 0, 0.5))
        `
      )
      .style("background-size", "100px 100px, 100px 100px, cover, cover, cover")
      .style("animation", "battlefield 10s infinite linear");

    battlefieldData.current = allHolders.map((holder) =>
      generateEntity(holder, width, height)
    );
    const generalTateEntity = battlefieldData.current.find((d) => d.type === "general-tate");
    if (generalTateEntity) {
      generalTateEntity.x = width / 2;
      generalTateEntity.y = height / 2;
    }
    svg.selectAll("*").remove();
    svg.append("defs")
      .append("style")
      .text(`
      .highlighted {
        animation: pulse 1s infinite alternate;
        filter: url(#glow); /* Apply glow effect */
      }
      @keyframes pulse {
        from {
          stroke-width: 2;
          stroke: rgba(255, 255, 255, 0.7);
        }
        to {
          stroke-width: 6;
          stroke: rgba(255, 255, 255, 1);
        }
      }
    `);

    // Add a filter for the glow effect
    svg.append("defs")
      .append("filter")
      .attr("id", "glow")
      .html(`
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    `);

    const entities = svg
      .selectAll(".entity")
      .data(battlefieldData.current)
      .join("g")
      .attr("class", "entity")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    entities
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 20)
      .attr("fill", (d) => d.traits.color)
      .attr("class", (d) =>
        highlightedHolders.includes(d.holder) ? "highlighted" : ""
      )
      .attr("stroke", "black");

    entities.on("mouseover", function (event, d) {
      setHoveredEntity(d);

      // Add scaling effect
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200) // Smooth transition
        .attr("r", 25); // Increase radius
    });

    entities.on("mouseout", function () {
      setHoveredEntity(null);

      // Reset size
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200)
        .attr("r", 20); // Reset to original size
    });



    const generalTate = entities.filter((d) => d.type === "general-tate");
    generalTate
      .append("image")
      .attr("xlink:href", "./tate.png")
      .attr("width", 60)
      .attr("height", 60)
      .attr("x", -30)
      .attr("y", -30);

    generalTate
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .text("General Tate");

    // Render soldiers
    const soldiers = entities.filter(
      (d) => d.type === "soldier" || d.type === "general" || d.type === "captain" || d.type === "lieutenant"
    );
    soldiers
      .append("rect")
      .attr("x", -10)
      .attr("y", -20)
      .attr("width", 20)
      .attr("height", 40)
      .attr("fill", (d) => d.traits.color)
      .attr("stroke", "black") // Add black outline
      .attr("stroke-width", 2); // Thickness of the outline

    soldiers
      .append("circle")
      .attr("cx", 0)
      .attr("cy", -30)
      .attr("r", 10)
      .attr("fill", "#ffe0bd")
      .attr("stroke", "black") // Add black outline
      .attr("stroke-width", 2);

    soldiers
      .append("rect")
      .attr("x", -12)
      .attr("y", -40)
      .attr("width", 24)
      .attr("height", 8)
      .attr("fill", "#333")
      .attr("stroke", "black") // Add black outline
      .attr("stroke-width", 2);

    soldiers
      .append("rect")
      .attr("x", 10)
      .attr("y", -10)
      .attr("width", 20)
      .attr("height", 4)
      .attr("fill", "#444")
      .attr("stroke", "black") // Add black outline
      .attr("stroke-width", 2);

    // Render tanks
    const tanks = entities.filter((d) => d.type === "tank");

    tanks
      .append("rect")
      .attr("x", -50)
      .attr("y", -25)
      .attr("width", 100)
      .attr("height", 50)
      .attr("fill", (d) => d.traits.color)
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    tanks
      .append("rect")
      .attr("x", -20)
      .attr("y", -40)
      .attr("width", 40)
      .attr("height", 20)
      .attr("fill", "#666")
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    tanks
      .append("rect")
      .attr("x", 20)
      .attr("y", -35)
      .attr("width", 60)
      .attr("height", 10)
      .attr("fill", "#444")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    const wheelPositions = [-35, -15, 5, 25];
    wheelPositions.forEach((x) => {
      tanks
        .append("circle")
        .attr("cx", x)
        .attr("cy", 30)
        .attr("r", 10)
        .attr("fill", "#222")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    });

    tanks
      .append("rect")
      .attr("x", -50)
      .attr("y", 25)
      .attr("width", 100)
      .attr("height", 10)
      .attr("fill", "#444")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }, [allHolders]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#2e2618" }}>
      {/* Battlefield (SVG Grid) */}
      <div style={{ flex: "4", position: "relative" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        {hoveredEntity && (
          <div
            style={{
              position: "absolute",
              left: hoveredEntity.x + 10,
              top: hoveredEntity.y - 20,
              padding: "10px",
              background: "rgba(50, 50, 50, 0.9)",
              color: "white",
              borderRadius: "8px",
              fontSize: "12px",
              pointerEvents: "none",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div>
              <strong>Address:</strong> {hoveredEntity.holder}
            </div>
            <div>
              <strong>Amount:</strong> {hoveredEntity.amount}
            </div>
            <div>
              <strong>Type:</strong> {hoveredEntity.traits.rank}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar Sidebar */}
      <div
        style={{
          flex: "1",
          background: "#1f1a13",
          color: "#fff",
          padding: "20px",
          borderLeft: "1px solid #3b2f1e",
          boxShadow: "-3px 0 10px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by address..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#2e2618",
            color: "#fff",
            outline: "none",
            fontSize: "14px",
          }}
        />

        {/* Filtered List */}
        <ul
          style={{
            listStyle: "none",
            margin: "0",
            padding: "0",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            background: "#2e2618",
            border: "1px solid #3b2f1e",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            scrollbarWidth: "none", // For Firefox
          }}
        >
          {allHolders
            .filter((holder) =>
              holder.holder.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .map((holder) => (
              <li
                key={holder.holder}
                onClick={() => handleHolderClick(holder.holder)} // Highlight on click
                style={{
                  padding: "12px",
                  cursor: "pointer",
                  backgroundColor: highlightedHolders.includes(holder.holder)
                    ? "#444" // Highlight color
                    : "transparent",
                  color: "#fff",
                  borderBottom: "1px solid #3b2f1e",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {holder.holder}
                </div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  Amount: {holder.amount}
                </div>
              </li>
            ))}
        </ul>

      </div>
    </div>
  );
};

export default SoldierField;
