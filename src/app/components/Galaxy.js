"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const HOLDERS_API_URL = '/api/pumpfun/holders';

const GalaxyD3 = () => {
    const svgRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHolders, setFilteredHolders] = useState([]); // Start with an empty list
    const allHolders = useRef([]); // Store all fetched holders to filter dynamically
    const existingHolders = useRef(new Set()); // Track existing holder addresses
    const orbitDataRef = useRef([]); // Persistent holder orbit data to avoid resetting
    let tooltip
    // Function to fetch holders from the API
    const fetchHolders = async () => {
        try {
            const response = await fetch(HOLDERS_API_URL);
            const data = await response.json();

            // Add only new holders that aren't already in the existing set
            const newHolders = data.filter(holder => !existingHolders.current.has(holder.holder));

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
                orbitSpeed: 0.001 + Math.random() * 0.002,
                size: sizeScale(holder.amount),
                angle: Math.random() * 2 * Math.PI
            }));

            orbitDataRef.current = [...orbitDataRef.current, ...newOrbitData]; // Append without resetting

            // Append new holders to the allHolders list and update filteredHolders
            allHolders.current = [...allHolders.current, ...newHolders];
            setFilteredHolders(allHolders.current); // Show all holders initially
        } catch (error) {
            console.error("Error fetching holders:", error);
        }
    };

    // Initial fetch and periodic update
    useEffect(() => {
        fetchHolders(); // Initial fetch
        const intervalId = setInterval(fetchHolders, 3000); // Poll every 5 seconds
        
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

        // Tooltip setup
        tooltip = d3.select("body")
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

        // Function to render and update orbits
        const updateOrbits = () => {
            // Draw the trails
            svg.selectAll(".trail")
                .data(orbitDataRef.current)
                .join("circle")
                .attr("class", "trail")
                .attr("r", 3)
                .attr("fill", "rgba(255, 255, 255, 0.5)")
                .attr("cx", d => width / 2 + d.orbitRadius * Math.cos(d.angle))
                .attr("cy", d => height / 2 + d.orbitRadius * Math.sin(d.angle))
                .style("opacity", 0.2)
                .transition()
                .duration(3000)
                .style("opacity", 0)
                .remove();

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
                    tooltip.style("opacity", 1)
                        .html(`<strong>Address:</strong> ${d.holder}<br><strong>Amount:</strong> ${d.amount}`);
                })
                .on("mousemove", (event) => {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 10) + "px");
                })
                .on("mouseout", () => {
                    tooltip.style("opacity", 0);
                });

            // Update angle for each holder in orbit to create animation
            orbitDataRef.current.forEach(d => {
                d.angle += d.orbitSpeed;
            });
        };

        // Start the animation loop
        d3.timer(updateOrbits);

    }, [filteredHolders]);

    // Handle search input changes
    const handleSearchChange = (e) => {
        const query = e.target.value.trim().toLowerCase();
        setSearchQuery(query);

        // Filter holders based on search query
        setFilteredHolders(query ? allHolders.current.filter(holder => holder.holder.toLowerCase().includes(query)) : allHolders.current);
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
                    placeholder="Search for your address..."
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
                    {filteredHolders.length > 0 ? (
                        filteredHolders.map((holder, index) => (
                            <div key={index} style={{ marginBottom: '8px', padding: '5px', border: '1px solid #444', borderRadius: '5px' }}>
                                <div><strong>Address:</strong> {holder.holder}</div>
                                <div><strong>Amount:</strong> {holder.amount}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: '#888' }}>No results found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalaxyD3;
