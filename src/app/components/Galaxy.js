"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const WS_URL = 'wss://galaxy-back-9a36e3ecdac2.herokuapp.com/';
const EXCLUDED_ADDRESS = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1';

const GalaxyD3 = () => {
    const svgRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [allHolders, setAllHolders] = useState([]);
    const [selectedHolders, setSelectedHolders] = useState([]);
    const [hoveredHolder, setHoveredHolder] = useState(null);
    const existingHolders = useRef(new Set());
    const orbitDataRef = useRef([]);
    const tooltipRefs = useRef(new Map());
    const retryInterval = useRef(null);

    // Generate a consistent color based on the holder's address
    const getColor = (holderAddress) => {
        let hash = 0;
        for (let i = 0; i < holderAddress.length; i++) {
            hash = holderAddress.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 100%, 50%)`;
    };

    const connectWebSocket = () => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            clearInterval(retryInterval.current); // Clear any retry interval on successful connection
            retryInterval.current = null;
        };

        let lastUpdate = Date.now();

        ws.onmessage = (event) => {
            const now = Date.now();
            if (now - lastUpdate < 500) return; // Throttle updates to every 500ms
            lastUpdate = now;

            try {
                const data = JSON.parse(event.data);
                const newHolders = data.filter(holder => holder.holder !== EXCLUDED_ADDRESS);
                const newHoldersSet = new Set(newHolders.map(h => h.holder));

                orbitDataRef.current = orbitDataRef.current.filter(d => newHoldersSet.has(d.holder));

                setAllHolders(newHolders);
                existingHolders.current = new Set(newHolders.map(holder => holder.holder));

                const width = window.innerWidth * 0.7;
                const height = window.innerHeight;
                const sizeScale = d3.scaleLinear()
                    .domain([Math.min(...newHolders.map(h => h.amount)), Math.max(...newHolders.map(h => h.amount))])
                    .range([2, 20]);

                newHolders.forEach(holder => {
                    if (!orbitDataRef.current.some(d => d.holder === holder.holder)) {
                        orbitDataRef.current.push({
                            ...holder,
                            orbitRadius: 50 + Math.random() * (Math.min(width, height) / 2 - 50),
                            orbitSpeed: 0.00009,
                            size: 1.5 * sizeScale(holder.amount),
                            angle: Math.random() * 2 * Math.PI
                        });
                    }
                });
            } catch (error) {
                console.error('Error parsing WebSocket data:', error);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');

            // Attempt reconnection every 5 seconds if the connection is closed
            if (!retryInterval.current) {
                retryInterval.current = setInterval(() => {
                    console.log("Attempting reconnection...");
                    connectWebSocket();
                }, 5000);
            }
        };
    };

    useEffect(() => {
        connectWebSocket(); // Initial connection
        return () => {
            clearInterval(retryInterval.current); // Clear interval on unmount
        };
    }, []);

    // D3 rendering and other code remains the same
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
            .attr("r", 18) // Start with a slightly larger size to avoid large animation jumps
            .attr("fill", "yellow")
            .style("filter", "drop-shadow(0 0 15px rgba(255, 255, 0, 0.8))");

        // Apply CSS animation for a smoother, more efficient pulsate effect
        sun.style("animation", "pulsate-animation 2s infinite ease-in-out")
            .style("transform-origin", "center");

        // Add CSS animation using D3
        svg.append("style").html(`
      @keyframes pulsate-animation {
        0% { r: 18; filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.8)); }
        50% { r: 20; filter: drop-shadow(0 0 20px rgba(255, 255, 0, 1)); }
        100% { r: 18; filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.8)); }
      }
    `);


        const updateOrbits = () => {
            svg.selectAll(".planet")
                .data(orbitDataRef.current, d => d.holder)
                .join("circle")
                .attr("class", "planet")
                .attr("r", d => d.size)
                .attr("fill", d => getColor(d.holder)) // Keep color consistent
                .attr("cx", d => width / 2 + d.orbitRadius * Math.cos(d.angle))
                .attr("cy", d => height / 2 + d.orbitRadius * Math.sin(d.angle))
                .style("filter", d =>
                    selectedHolders.some(holder => holder.holder === d.holder)
                        ? "drop-shadow(0 0 15px rgba(255, 255, 255, 1))"
                        : "none"
                )
                .on("mouseover", (event, d) => setHoveredHolder(d))
                .on("mouseout", () => setHoveredHolder(null))
                .transition()
                .duration(1000)
                .attr("r", d =>
                    selectedHolders.some(holder => holder.holder === d.holder)
                        ? d.size * 1.5
                        : d.size
                )
                .style("filter", d =>
                    selectedHolders.some(holder => holder.holder === d.holder)
                        ? "drop-shadow(0 0 25px rgba(255, 255, 255, 1))"
                        : "none"
                )
                .transition()
                .duration(1000)
                .attr("r", d => d.size)
                .style("filter", d =>
                    selectedHolders.some(holder => holder.holder === d.holder)
                        ? "drop-shadow(0 0 15px rgba(255, 255, 255, 1))"
                        : "none"
                );

            orbitDataRef.current.forEach(d => {
                d.angle += d.orbitSpeed;
            });

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

    const handleHolderClick = (holder) => {
        setSelectedHolders(prevSelected => {
            if (prevSelected.some(selected => selected.holder === holder.holder)) {
                return prevSelected.filter(selected => selected.holder !== holder.holder);
            } else {
                return [...prevSelected, holder];
            }
        });
    };

    const renderTooltip = (holder, index) => (
        <div
            key={`${holder.holder}-${index}`} // Make key unique by adding index
            ref={(el) => el && tooltipRefs.current.set(holder.holder, el)}
            className="tooltip"
            style={{
                position: "absolute",
                background: "rgba(0, 0, 0, 0.85)",
                color: "#ffffff",
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

                {hoveredHolder && renderTooltip(hoveredHolder)}

                {selectedHolders.map((holder, index) => renderTooltip(holder, index))}
            </div>

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
                        color: '#ffffff',
                        borderRadius: '5px',
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                        marginBottom: '10px',
                        outline: 'none',
                    }}
                />

                <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
                    {allHolders.length > 0 ? (
                        allHolders
                            .filter(holder => holder.holder.toLowerCase().startsWith(searchQuery))
                            .map((holder, index) => (
                                <div
                                    key={`${holder.holder}-${index}`}
                                    onClick={() => handleHolderClick(holder)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '5px',
                                        marginBottom: '5px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedHolders.some(selected => selected.holder === holder.holder) ? 'white' : 'transparent',
                                        color: selectedHolders.some(selected => selected.holder === holder.holder) ? 'black' : 'inherit',
                                    }}
                                >
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
