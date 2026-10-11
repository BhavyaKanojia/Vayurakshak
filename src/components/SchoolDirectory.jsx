import React, { useState } from 'react';
import { School, MapPin, Users, Bus, ArrowRight, ShieldCheck, Activity, Layers, Navigation, AlertTriangle, Wind } from 'lucide-react';
import { DELHI_NCR_SCHOOLS } from '../services/schoolsData';

export default function SchoolDirectory({ selectedSchool, onSelectSchool }) {
  const [showInversionPlume, setShowInversionPlume] = useState(true);
  const [hoveredPin, setHoveredPin] = useState(null);

  // Geographic bounds of Delhi-NCR to project onto SVG viewBox (0 0 800 480)
  // Lat: 28.40 to 28.80 (Span 0.40)
  // Lon: 76.95 to 77.42 (Span 0.47)
  const mapCoords = (lat, lon) => {
    const minLat = 28.40;
    const maxLat = 28.80;
    const minLon = 76.95;
    const maxLon = 77.42;

    const x = ((lon - minLon) / (maxLon - minLon)) * 720 + 40;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 400 + 40;
    return { x, y };
  };

  // Mock regional AQIs for spatial heatmap pins
  const getSchoolAqiMock = (id) => {
    switch (id) {
      case 'anand-vihar': return { aqi: 442, color: '#be123c', stage: 'GRAP III', label: 'Severe' };
      case 'dtu-bawana': return { aqi: 418, color: '#be123c', stage: 'GRAP III', label: 'Severe' };
      case 'ito-delhi': return { aqi: 368, color: '#e11d48', stage: 'GRAP II', label: 'Very Poor' };
      case 'noida-sec62': return { aqi: 345, color: '#e11d48', stage: 'GRAP II', label: 'Very Poor' };
      case 'rk-puram': return { aqi: 312, color: '#e11d48', stage: 'GRAP II', label: 'Very Poor' };
      case 'gurugram-cyber': return { aqi: 284, color: '#ea580c', stage: 'GRAP I', label: 'Poor' };
      default: return { aqi: 320, color: '#e11d48', stage: 'GRAP II', label: 'Very Poor' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Directory & Geo-Map Header */}
      <div className="glass-card">
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div className="card-title-group">
            <Navigation size={22} color="#0284c7" />
            <div>
              <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
                Delhi-NCR Interactive AQI Geo-Map & Monitored Campuses
              </h2>
              <p className="card-subtitle">
                Live spatial positioning across CPCB / DPCC CAAQMS air quality telemetry hubs
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowInversionPlume(!showInversionPlume)}
              className="btn-icon-refresh"
              style={{
                background: showInversionPlume ? '#f0f9ff' : '#ffffff',
                borderColor: showInversionPlume ? '#0284c7' : 'var(--border-subtle)',
                color: showInversionPlume ? '#0284c7' : 'var(--text-muted)'
              }}
            >
              <Layers size={14} />
              <span>{showInversionPlume ? 'Smog Plume Layer ON' : 'Smog Plume Layer OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Delhi-NCR Geo-Map SVG Canvas */}
      <div className="glass-card" style={{ padding: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Wind size={15} color="#0284c7" />
            <span>Interactive Spatial Telemetry Grid • Click any campus pin to switch active monitoring</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }} /> GRAP I (201-300)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48' }} /> GRAP II (301-400)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#be123c' }} /> GRAP III (401-450)
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '380px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          
          <svg viewBox="0 0 800 480" style={{ width: '100%', height: '100%' }}>
            <defs>
              {/* Smog Inversion Gradient Overlay */}
              <radialGradient id="smogPlumeEast" cx="75%" cy="35%" r="40%">
                <stop offset="0%" stopColor="#be123c" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#e11d48" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="smogPlumeNorth" cx="35%" cy="20%" r="35%">
                <stop offset="0%" stopColor="#be123c" stopOpacity="0.28" />
                <stop offset="70%" stopColor="#f8fafc" stopOpacity="0" />
              </radialGradient>

              {/* Grid pattern */}
              <pattern id="geoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="800" height="480" fill="url(#geoGrid)" />

            {/* Yamuna River Curve Simulation */}
            <path
              d="M 390 10 Q 420 120 460 210 T 510 350 T 560 470"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
            <text x="500" y="270" fill="#0284c7" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6" transform="rotate(45, 500, 270)">
              Yamuna River Corridor
            </text>

            {/* Delhi State Boundary Mock Outline */}
            <path
              d="M 220 80 L 450 60 L 580 160 L 620 280 L 520 420 L 320 410 L 210 280 Z"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text x="240" y="110" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="var(--font-mono)">
              DELHI NCT BORDER
            </text>

            {/* Smog Inversion Plume Layer (Toggleable) */}
            {showInversionPlume && (
              <>
                <circle cx="560" cy="180" r="140" fill="url(#smogPlumeEast)" pointerEvents="none" />
                <circle cx="280" cy="100" r="120" fill="url(#smogPlumeNorth)" pointerEvents="none" />
                <text x="540" y="150" fill="#be123c" fontSize="9" fontWeight="bold" opacity="0.75" pointerEvents="none">
                  HIGH SMOG TRAPPING (ANAND VIHAR CHOKE)
                </text>
              </>
            )}

            {/* Regional Zone Labels */}
            <text x="290" y="65" fill="#64748b" fontSize="10" fontWeight="bold">NORTH DELHI (BAWANA)</text>
            <text x="610" y="210" fill="#64748b" fontSize="10" fontWeight="bold">NOIDA (NCR)</text>
            <text x="140" y="420" fill="#64748b" fontSize="10" fontWeight="bold">GURUGRAM (NCR)</text>
            <text x="360" y="220" fill="#64748b" fontSize="10" fontWeight="bold">CENTRAL (ITO)</text>

            {/* School Campus Geo-Pins */}
            {DELHI_NCR_SCHOOLS.map((school) => {
              const { x, y } = mapCoords(school.lat, school.lon);
              const isSelected = school.id === selectedSchool.id;
              const aqiInfo = getSchoolAqiMock(school.id);

              return (
                <g 
                  key={school.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectSchool(school)}
                  onMouseEnter={() => setHoveredPin(school)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  {/* Radar Pulse for Active or Severe School */}
                  <circle
                    r={isSelected ? "22" : "15"}
                    fill={aqiInfo.color}
                    opacity={isSelected ? "0.35" : "0.2"}
                  >
                    <animate attributeName="r" values="10;28;10" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Core Marker Pin */}
                  <circle
                    r={isSelected ? "11" : "8"}
                    fill={isSelected ? "#0284c7" : aqiInfo.color}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
                  />

                  {/* AQI Badge on Pin */}
                  <rect
                    x="12"
                    y="-14"
                    width="60"
                    height="20"
                    rx="4"
                    fill="#ffffff"
                    stroke={isSelected ? "#0284c7" : "#cbd5e1"}
                    strokeWidth={isSelected ? "1.5" : "1"}
                    filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.06))"
                  />
                  <text
                    x="18"
                    y="0"
                    fontSize="9.5"
                    fontWeight="800"
                    fill={aqiInfo.color}
                    fontFamily="var(--font-mono)"
                  >
                    {aqiInfo.aqi} AQI
                  </text>

                  {/* Campus Short Name */}
                  <text
                    x="12"
                    y="16"
                    fontSize="9"
                    fontWeight="700"
                    fill="#0f172a"
                    fontFamily="var(--font-heading)"
                  >
                    {school.shortName}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Hover Details Floating Card */}
          {hoveredPin && (
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                minWidth: '240px',
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#0284c7', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {hoveredPin.zone}
              </div>
              <h4 style={{ fontSize: '0.9rem', color: '#0f172a', margin: '2px 0 6px' }}>
                {hoveredPin.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                Station: <strong>{hoveredPin.stationName}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>
                Strength: <strong>{hoveredPin.studentStrength} students</strong> • Buses: <strong>{hoveredPin.transportBuses}</strong>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Schools Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {DELHI_NCR_SCHOOLS.map((school) => {
          const isSelected = school.id === selectedSchool.id;
          const aqiInfo = getSchoolAqiMock(school.id);

          return (
            <div
              key={school.id}
              onClick={() => onSelectSchool(school)}
              className="glass-card"
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? '#0284c7' : 'var(--border-subtle)',
                background: isSelected ? '#f0f9ff' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(2, 132, 199, 0.15)' : 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'var(--bg-card-inner)', borderRadius: '4px', color: '#0284c7', border: '1px solid rgba(2,132,199,0.2)' }}>
                    {school.zone}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: aqiInfo.color, background: '#ffffff', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${aqiInfo.color}40` }}>
                      {aqiInfo.aqi} AQI
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} /> ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {school.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <MapPin size={14} color="#64748b" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Activity size={14} color="#0284c7" style={{ flexShrink: 0 }} />
                    <span>Station: <strong style={{ color: 'var(--text-primary)' }}>{school.stationName}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} />
                    <span>{school.studentStrength.toLocaleString()} Students</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bus size={14} />
                    <span>{school.transportBuses} Buses</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                <span>Principal: {school.principal}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Select Campus</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
