"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const HOLDERS_API_URL = '/api/pumpfun/holders';
const EXCLUDED_ADDRESS = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1';

const GalaxyD3 = () => {
    const svgRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [allHolders, setAllHolders] = useState([]);
    const [selectedHolders, setSelectedHolders] = useState([]); // Track multiple selected holders
    const [hoveredHolder, setHoveredHolder] = useState(null); // Track the current hovered holder for tooltip
    const existingHolders = useRef(new Set());
    const orbitDataRef = useRef([]);
    const tooltipRefs = useRef(new Map()); // Map for dynamic tooltip references by holder address

    // Function to fetch holders from the API
    const fetchHolders = async () => {
        try {
            const response = await fetch(HOLDERS_API_URL);
            const data = await response.json();

            const newHolders = data.filter(holder =>
                holder.holder !== EXCLUDED_ADDRESS && !existingHolders.current.has(holder.holder)
            );

            newHolders.forEach(holder => existingHolders.current.add(holder.holder));

            const width = window.innerWidth * 0.7;
            const height = window.innerHeight;

            const sizeScale = d3.scaleLinear()
                .domain([Math.min(...data.map(h => h.amount)), Math.max(...data.map(h => h.amount))])
                .range([2, 20]);

            const newOrbitData = newHolders.map(holder => ({
                ...holder,
                orbitRadius: 50 + Math.random() * (Math.min(width, height) / 2 - 50),
                orbitSpeed: 0.0002 + Math.random() * 0.00000001,
                size: sizeScale(holder.amount * 15),
                angle: Math.random() * 2 * Math.PI
            }));

            orbitDataRef.current = [...orbitDataRef.current, ...newOrbitData];
            setAllHolders(prev => [...prev, ...newHolders]);
        } catch (error) {
            console.error("Error fetching holders:", error);
        }
    };

    useEffect(() => {
        fetchHolders();
        const intervalId = setInterval(fetchHolders, 5000);
        
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const width = window.innerWidth * 0.7;
        const height = window.innerHeight;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("background", "linear-gradient(135deg, #1f1c2c, #928dab)");

        svg.selectAll("*").remove();

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

        pulsate();

        const updateOrbits = () => {
            svg.selectAll(".planet")
                .data(orbitDataRef.current, d => d.holder)
                .join("circle")
                .attr("class", "planet")
                .attr("r", d => d.size)
                .attr("fill", (d, i) => `hsl(${(i * 40) % 360}, 100%, 50%)`)
                .attr("cx", d => width / 2 + d.orbitRadius * Math.cos(d.angle))
                .attr("cy", d => height / 2 + d.orbitRadius * Math.sin(d.angle))
                .on("mouseover", (event, d) => setHoveredHolder(d))
                .on("mouseout", () => setHoveredHolder(null));

            orbitDataRef.current.forEach(d => {
                d.angle += d.orbitSpeed;
            });

            // Update tooltip positions dynamically for selected holders
            selectedHolders.forEach(holder => {
                const orbitData = orbitDataRef.current.find(d => d.holder === holder.holder);
                if (orbitData) {
                    const tooltipEl = tooltipRefs.current.get(holder.holder);
                    if (tooltipEl) {
                        tooltipEl.style.left = `${width / 2 + orbitData.orbitRadius * Math.cos(orbitData.angle) + 10}px`;
                        tooltipEl.style.top = `${height / 2 + orbitData.orbitRadius * Math.sin(orbitData.angle) - 10}px`;
                    }
                }
            });

            // Update tooltip position for hovered holder
            if (hoveredHolder) {
                const hoveredOrbitData = orbitDataRef.current.find(d => d.holder === hoveredHolder.holder);
                if (hoveredOrbitData) {
                    const tooltipEl = tooltipRefs.current.get(hoveredHolder.holder);
                    if (tooltipEl) {
                        tooltipEl.style.left = `${width / 2 + hoveredOrbitData.orbitRadius * Math.cos(hoveredOrbitData.angle) + 10}px`;
                        tooltipEl.style.top = `${height / 2 + hoveredOrbitData.orbitRadius * Math.sin(hoveredOrbitData.angle) - 10}px`;
                    }
                }
            }
        };

        d3.timer(updateOrbits);

    }, [allHolders, selectedHolders, hoveredHolder]);

    const handleCheckboxChange = (holder) => {
        setSelectedHolders(prevSelected => {
            if (prevSelected.some(selected => selected.holder === holder.holder)) {
                return prevSelected.filter(selected => selected.holder !== holder.holder);
            } else {
                return [...prevSelected, holder];
            }
        });
    };

    const renderTooltip = (holder) => (
        <div
            key={holder.holder}
            ref={(el) => el && tooltipRefs.current.set(holder.holder, el)}
            className="tooltip"
            style={{
                position: "absolute",
                background: "rgba(0, 0, 0, 0.85)",
                color: "#00ff00",
                padding: "2px 4px",
                borderRadius: "2px",
                fontFamily: "'Press Start 2P', sans-serif",
                fontSize: "8px",
                pointerEvents: "none",
                opacity: 1,
                transition: "opacity 0.2s ease",
            }}
        >
            <strong>Address:</strong> {holder.holder}<br />
            <strong>Amount:</strong> {holder.amount}
        </div>
    );

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#000' }}>
            <div style={{ flex: 7, position: 'relative' }}>
                <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
                
                {/* Tooltip for hovered holder */}
                {hoveredHolder && renderTooltip(hoveredHolder)}
                
                {/* Tooltips for selected holders */}
                {selectedHolders.map(holder => renderTooltip(holder))}
            </div>

            {/* Sidebar for Search and Holder List */}
            <div style={{ flex: 3, padding: '10px', color: 'white', overflowY: 'auto', maxHeight: '100vh' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                    placeholder="Enter address to filter..."
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

                <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
                    {allHolders.length > 0 ? (
                        allHolders
                            .filter(holder => holder.holder.toLowerCase().startsWith(searchQuery))
                            .map(holder => (
                                <div key={holder.holder} style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
                                    <input
                                        type="checkbox"
                                        style={{ marginRight: '8px' }}
                                        checked={selectedHolders.some(selected => selected.holder === holder.holder)}
                                        onChange={() => handleCheckboxChange(holder)}
                                    />
                                    <div>
                                        <div>Address: {holder.holder}</div>
                                        <div>Amount: {holder.amount}</div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div>Loading holders...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalaxyD3;
