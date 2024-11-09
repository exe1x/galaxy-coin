"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const HOLDERS_API_URL = '/api/pumpfun/holders';
const EXCLUDED_ADDRESS = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1';

const GalaxyD3 = () => {
    const svgRef = useRef();
    const tooltipRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [allHolders, setAllHolders] = useState([]);
    const existingHolders = useRef(new Set()); // Track existing holder addresses
    const orbitDataRef = useRef([]); // Persistent holder orbit data to avoid resetting
    let currentHighlightedHolder = useRef(null); // Track the current highlighted holder for tooltip

    // Function to fetch holders from the API
    const fetchHolders = async () => {
        try {
            const response = await fetch(HOLDERS_API_URL);
            const data = await response.json();

            // Exclude the specific address and add only new holders that aren't already in the existing set
            const newHolders = data.filter(holder => 
                holder.holder !== EXCLUDED_ADDRESS && !existingHolders.current.has(holder.holder)
            );

            // Update the set with new holder addresses
            newHolders.forEach(holder => existingHolders.current.add(holder.holder));

            // Add new holders to orbitDataRef with unique orbit properties
            const width = window.innerWidth * 0.7;
            const height = window.innerHeight;

            const sizeScale = d3.scaleLinear()
                .domain([Math.min(...data.map(h => h.amount)), Math.max(...data.map(h => h.amount))])
                .range([2, 20]);

            const newOrbitData = newHolders.map(holder => ({
                ...holder,
                orbitRadius: 50 + Math.random() * (Math.min(width, height) / 2 - 50),
                orbitSpeed: 0.0005 + Math.random() * 0.001, // Slower speed
                size: sizeScale(holder.amount),
                angle: Math.random() * 2 * Math.PI
            }));

            orbitDataRef.current = [...orbitDataRef.current, ...newOrbitData]; // Append without resetting
            setAllHolders(prev => [...prev, ...newHolders]); // Store all holders for sidebar display
        } catch (error) {
            console.error("Error fetching holders:", error);
        }
    };

    // Initial fetch and periodic update
    useEffect(() => {
        fetchHolders(); // Initial fetch
        const intervalId = setInterval(fetchHolders, 5000); // Poll every 5 seconds
        
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        const width = window.innerWidth * 0.7;
        const height = window.innerHeight;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("background", "linear-gradient(135deg, #1f1c2c, #928dab)");

        svg.selectAll("*").remove(); // Clear previous drawings

        // Draw the central sun
        const sun = svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", 15)
            .attr("fill", "yellow")
            .style("filter", "drop-shadow(0 0 10px rgba(255, 255, 0, 1))");

        function pulsate() {
            sun.transition()
                .duration(1000)
                .attr("r", 20)
                .style("filter", "drop-shadow(0 0 20px rgba(255, 255, 0, 1))")
                .transition()
                .duration(1000)
                .attr("r", 19)
                .style("filter", "drop-shadow(0 0 10px rgba(255, 255, 0, 1))")
                .on("end", pulsate);
        }

        pulsate(); // Start the pulsating effect

        // Initialize tooltip only once
        if (!tooltipRef.current) {
            tooltipRef.current = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "rgba(0, 0, 0, 0.85)")
                .style("color", "#00ff00")
                .style("padding", "2px 4px")
                .style("border-radius", "2px")
                .style("font-family", "'Press Start 2P', sans-serif")
                .style("font-size", "8px")
                .style("pointer-events", "none")
                .style("opacity", 0)
                .style("transition", "opacity 0.2s ease");
        }

        // Function to render and update orbits
        const updateOrbits = () => {
            // Draw the planets
            svg.selectAll(".planet")
                .data(orbitDataRef.current, d => d.holder)
                .join("circle")
                .attr("class", "planet")
                .attr("r", d => d.size)
                .attr("fill", (d, i) => `hsl(${(i * 40) % 360}, 100%, 50%)`)
                .attr("cx", d => width / 2 + d.orbitRadius * Math.cos(d.angle))
                .attr("cy", d => height / 2 + d.orbitRadius * Math.sin(d.angle))
                .on("mouseover", (event, d) => {
                    currentHighlightedHolder.current = d;
                    tooltipRef.current
                        .style("opacity", 1)
                        .html(`<strong>Address:</strong> ${d.holder}<br><strong>Amount:</strong> ${d.amount}`);
                })
                .on("mouseout", () => {
                    currentHighlightedHolder.current = null;
                    tooltipRef.current.style("opacity", 0);
                });

            // Update angle for each holder in orbit and tooltip position if highlighted
            orbitDataRef.current.forEach(d => {
                d.angle += d.orbitSpeed;
                if (currentHighlightedHolder.current === d) {
                    tooltipRef.current
                        .style("left", `${width / 2 + d.orbitRadius * Math.cos(d.angle) + 10}px`)
                        .style("top", `${height / 2 + d.orbitRadius * Math.sin(d.angle) - 10}px`);
                }
            });
        };

        // Start the animation loop
        d3.timer(updateOrbits);

    }, [allHolders]);

    // Handle search input changes to highlight the specified address
    const handleSearchChange = (e) => {
        const query = e.target.value.trim().toLowerCase();
        setSearchQuery(query);

        // Highlight the specified address if it matches
        const holderToHighlight = allHolders.find(holder => holder.holder.toLowerCase() === query);
        if (holderToHighlight) {
            currentHighlightedHolder.current = holderToHighlight;
            tooltipRef.current
                .style("opacity", 1)
                .html(`<strong>Address:</strong> ${holderToHighlight.holder}<br><strong>Amount:</strong> ${holderToHighlight.amount}`);
        } else {
            // Hide tooltip if no match found
            currentHighlightedHolder.current = null;
            tooltipRef.current.style("opacity", 0);
        }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#000' }}>
            {/* Visualization */}
            <div style={{ flex: 7, position: 'relative' }}>
                <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Sidebar for Search and Holder List */}
            <div style={{ flex: 3, padding: '10px', color: 'white', overflowY: 'auto', maxHeight: '100vh' }}>
                {/* Search Input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Enter address to highlight..."
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        fontFamily: "'Press Start 2P'",
                        background: 'black',
                        color: '#00ff00',
                        borderRadius: '5px',
                        border: '2px solid rgba(0, 255, 0, 0.8)',
                        boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                        marginBottom: '10px',
                        outline: 'none',
                    }}
                />

                {/* Holder List */}
                <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
                    {allHolders.length > 0 ? (
                        allHolders.map((holder, index) => (
                            <div key={index} style={{ marginBottom: '8px', padding: '5px', border: '1px solid #444', borderRadius: '5px' }}>
                                <div><strong>Address:</strong> {holder.holder}</div>
                                <div><strong>Amount:</strong> {holder.amount}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: '#888' }}>Loading holders...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalaxyD3;
