"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const sampleData = [
    { holder: "EdgbDEq3C3LwJtpyaDwNEFEtgMtBu1ut1nRTqRwssDmx", amount: 962962497062 },
    { holder: "orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8", amount: 4105 },
    { holder: "2j3MGgjTZnf5woD1dV9XScaSy5SxPeKh5eTTzcpZ142z", amount: 4345849279 },
    { holder: "6SddZZqxxmtm4eJdCES9NGwbFUi4Cc2p4Ab98Z92xjmz", amount: 432696907620 },
    { holder: "DZ5yXxMnw5gTNpQJeMrxxPKMi4jQd75zFTKHnFBLDun7", amount: 42624410933 },
    { holder: "9FSmH9CNCzcinZF5xZ1DoPzfmBb46im4Z6pC8bc6w753", amount: 848328652847 },
    { holder: "7cNbxqMa1JSXmJJ5YUczzfXCCHCpCg6ZAa2ATTXbYx9R", amount: 24245391509 },
    { holder: "9Buh5t6fSAVMq61jwHbWSa3EcuqMnQXfCfpePiZ9ExiS", amount: 10775475459 },
    { holder: "5niysgHXFoa8apmrgeBNRXJ6yPiz4WnMnVnAobUXoaMh", amount: 294817123 },
    { holder: "FYQW3hDBeQhRrfPSjzpTY5p4fwgHekHwqJN12b6GbyDQ", amount: 339822580445 },
    { holder: "C4CaZDQyBxn3RG8mdkP6LaxwqmugbZgywvthX3S1Yv44", amount: 21290876118 },
    { holder: "Ds5jCefMDMCbwjrypDVqUvXn3wqTgHyvwD6iCrJYkWYy", amount: 2700 },
    { holder: "5nSr2XJ3pcmCUZsbYDxG277rYn8dYikPkaDJqbcgdDeE", amount: 565839871670 },
    { holder: "ATomG2gRJcB2jNvwcjo2zBMoyLsHZzLgwqy651zzYoCq", amount: 343223807 },
    { holder: "H4dWNS7ydys4Je2G4WgsmJDSmqGtNmf8CT99r9rDnacf", amount: 2000240452 },
    { holder: "4xu2vjQoXh4cArYQTMtWCPRGmZKkJL6WAW1chY9aNiqD", amount: 225636709 },
    { holder: "8o9Gc3pSGh6m8paVsFxz2AVfDTNPfSPQoUWn5bwWkbvQ", amount: 5560929234684 },
    { holder: "BmanDqQELF7QY5uRPw8vg3eMjR74WZnszKmNbLJKkay3", amount: 195927620767 },
    { holder: "F9HEW9cgXMzKrdQArWnsmjKjYGcggaTtfXug44AsAYav", amount: 2750180547995 },
    { holder: "DQeJQ91Uzcuyk4iAtpQ9FwD8Ddwr62NeWd8hoE1kgLLs", amount: 343333954 },
    { holder: "2krMXtrTSNzaa8o5v3a1ZuUoo3BNjA171Saj3jzVjR7R", amount: 428170397 },
    { holder: "CaShxDq2Vbdp2XryjDdUZthbTzwYsvKuH6Knn9pPi4xU", amount: 228889979 },
    { holder: "C9nCVfP8YbC57DVrv6uR3aVXKHeBevNJjEPFux4pvz53", amount: 727452881 },
    { holder: "ZG98FUCjb8mJ824Gbs6RsgVmr1FhXb2oNiJHa2dwmPd", amount: 430549605 },
    { holder: "DkU8TPGMeVE9A2j7agq56frbvsXwKSVCNtxk9uJcB7Bi", amount: 1042917726019 },
    { holder: "1atR7daiYbwZf5MdBABdgiTTJKTNPufXMjsdDJSRL99", amount: 592237777008 },
    { holder: "6T32SDAeD5u1oMF9hKn6W9KKUwBsX5i8TgVBSZzSqEBN", amount: 26467490151608 },
    { holder: "HVajxfNTWqLGxsfJA9DFThnvddveKfJLK8re1kNpeCVv", amount: 10}
  ];

const SoldierField = () => {
  const svgRef = useRef();
  const [allHolders, setAllHolders] = useState(sampleData);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const battlefieldData = useRef([]);

  const sortedAmounts = sampleData.map((d) => d.amount).sort((a, b) => a - b);

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

  // Calculate top 1% threshold
  const topOnePercentThreshold = d3.quantile(sortedAmounts, 0.99);

  const generateEntity = (holder) => {
    const rank = calculateRank(holder.amount);
  
    // Handle General Tate explicitly
    if (holder.holder === "HVajxfNTWqLGxsfJA9DFThnvddveKfJLK8re1kNpeCVv") {
      return {
        ...holder,
        type: "general-tate", // Unique type for General Tate
        traits: {
          color: determineColorByAddress(holder.holder),
          rank: "general-tate", // Explicit rank
        },
        x: 0, // Center position adjusted later
        y: 0, // Center position adjusted later
      };
    }
  
    // Handle other ranks
    return {
      ...holder,
      type: rank === "tank" ? "tank" : "soldier", // Tanks are distinct
      traits: {
        color: determineColorByAddress(holder.holder),
        size: rank === "tank" ? 50 : 20, // Larger size for tanks
        rank: rank, // Assign rank for tooltip
      },
      x: Math.random() * (window.innerWidth * 0.8 - 100) + 50,
      y: Math.random() * (window.innerHeight * 0.8 - 100) + 50,
    };
  };

  useEffect(() => {
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
      .style("animation", "battlefield 10s infinite linear")

    battlefieldData.current = allHolders.map(generateEntity);
    const generalTateEntity = battlefieldData.current.find((d) => d.type === "general-tate");
    if (generalTateEntity) {
      generalTateEntity.x = width / 2;
      generalTateEntity.y = height / 2;
    }
    svg.selectAll("*").remove();

    const entities = svg
      .selectAll(".entity")
      .data(battlefieldData.current)
      .join("g")
      .attr("class", "entity")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .on("mouseover", (event, d) => setHoveredEntity(d))
      .on("mouseout", () => setHoveredEntity(null));
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
// Render tanks
const tanks = entities.filter((d) => d.type === "tank");

// Tank Body (Base)
tanks
  .append("rect")
  .attr("x", -50)
  .attr("y", -25)
  .attr("width", 100)
  .attr("height", 50)
  .attr("fill", (d) => d.traits.color)
  .attr("stroke", "black") // Add outline
  .attr("stroke-width", 3); // Thickness of the outline

// Tank Turret (Rotating Top)
tanks
  .append("rect")
  .attr("x", -20)
  .attr("y", -40)
  .attr("width", 40)
  .attr("height", 20)
  .attr("fill", "#666")
  .attr("stroke", "black") // Add outline
  .attr("stroke-width", 3); // Thickness of the outline

// Tank Barrel
tanks
  .append("rect")
  .attr("x", 20)
  .attr("y", -35)
  .attr("width", 60)
  .attr("height", 10)
  .attr("fill", "#444")
  .attr("stroke", "black") // Add outline
  .attr("stroke-width", 2); // Thickness of the outline

// Tank Wheels
const wheelPositions = [-35, -15, 5, 25]; // X-coordinates for wheels
wheelPositions.forEach((x) => {
  tanks
    .append("circle")
    .attr("cx", x)
    .attr("cy", 30) // Position wheels below the tank body
    .attr("r", 10) // Radius of each wheel
    .attr("fill", "#222")
    .attr("stroke", "black") // Add outline
    .attr("stroke-width", 2); // Thickness of the outline
});

// Tank Tracks
tanks
  .append("rect")
  .attr("x", -50)
  .attr("y", 25)
  .attr("width", 100)
  .attr("height", 10)
  .attr("fill", "#444")
  .attr("stroke", "black") // Add outline
  .attr("stroke-width", 2); // Thickness of the outline

// Tank Details (Decorative Elements)
tanks
  .append("circle") // Hatch
  .attr("cx", 0)
  .attr("cy", -30)
  .attr("r", 10)
  .attr("fill", "#333")
  .attr("stroke", "black") // Add outline
  .attr("stroke-width", 2); // Thickness of the outline

tanks
  .append("rect") // Exhaust pipe
  .attr("x", -60)
  .attr("y", -15)
  .attr("width", 10)
  .attr("height", 5)
  .attr("fill", "#888")
  .attr("stroke", "black") // Add outline
  .attr("stroke-width", 1.5); // Thickness of the outline

    // Render General Tate
    const general = entities.filter((d) => d.type === "general");
    general
      .append("image")
      .attr("xlink:href", "./tate.png")
      .attr("width", 60)
      .attr("height", 60)
      .attr("x", -30)
      .attr("y", -30);

    general
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .text("General Tate");
  }, [allHolders]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <svg ref={svgRef} />

      {/* Tooltip */}
      {hoveredEntity && (
        <div
          style={{
            position: "absolute",
            left: hoveredEntity.x + 10,
            top: hoveredEntity.y - 20,
            padding: "5px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "5px",
            fontSize: "12px",
            pointerEvents: "none",
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
  );
};

export default SoldierField;