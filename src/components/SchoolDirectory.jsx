import React, { useState, useMemo } from 'react';
import { 
  School, 
  MapPin, 
  Users, 
  Bus, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Navigation, 
  AlertTriangle, 
  Wind,
  Search,
  Filter,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { DELHI_NCR_SCHOOLS } from '../services/schoolsData';

export default function SchoolDirectory({ selectedSchool, onSelectSchool }) {
  const [showInversionPlume, setShowInversionPlume] = useState(true);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');

  // Geographic bounds of Delhi-NCR to project onto SVG viewBox (0 0 820 480)
  // Lat: 28.38 to 28.78 (Span 0.40)
  // Lon: 76.98 to 77.44 (Span 0.46)
  const mapCoords = (lat, lon) => {
    const minLat = 28.38;
    const maxLat = 28.78;
    const minLon = 76.98;
    const maxLon = 77.44;

    const x = ((lon - minLon) / (maxLon - minLon)) * 740 + 40;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 400 + 40;
    return { x: Math.max(30, Math.min(790, x)), y: Math.max(30, Math.min(450, y)) };
  };

  // Dynamic regional AQI computation for spatial pins
  const getSchoolAqiMock = (school) => {
    const zone = school.zone || '';
    let aqi = 320;
    if (zone.includes('East') || school.id.includes('anand') || zone.includes('Ghaziabad')) aqi = 442;
    else if (zone.includes('North') || school.id.includes('bawana') || school.id.includes('rohini')) aqi = 418;
    else if (zone.includes('Central') || school.id.includes('ito')) aqi = 368;
    else if (zone.includes('Noida')) aqi = 345;
    else if (zone.includes('Gurugram')) aqi = 284;
    else if (zone.includes('Faridabad')) aqi = 352;
    else if (zone.includes('West')) aqi = 328;
    else aqi = 315;

    if (aqi >= 450) return { aqi, color: '#991b1b', stage: 'GRAP IV', label: 'Severe+' };
    if (aqi >= 401) return { aqi, color: '#be123c', stage: 'GRAP III', label: 'Severe' };
    if (aqi >= 301) return { aqi, color: '#e11d48', stage: 'GRAP II', label: 'Very Poor' };
    if (aqi >= 201) return { aqi, color: '#ea580c', stage: 'GRAP I', label: 'Poor' };
    return { aqi, color: '#059669', stage: 'Normal', label: 'Moderate' };
  };

  // Distinct Zones for Filter Tabs
  const zones = useMemo(() => {
    const unique = Array.from(new Set(DELHI_NCR_SCHOOLS.map(s => s.zone)));
    return ['All', ...unique];
  }, []);

  // Filtered schools
  const filteredSchools = useMemo(() => {
    return DELHI_NCR_SCHOOLS.filter(s => {
      const matchesZone = selectedZone === 'All' || s.zone === selectedZone;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        s.name.toLowerCase().includes(query) ||
        s.shortName.toLowerCase().includes(query) ||
        s.zone.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        s.principal.toLowerCase().includes(query) ||
        s.stationName.toLowerCase().includes(query);
      return matchesZone && matchesQuery;
    });
  }, [searchQuery, selectedZone]);

  // Aggregate stats
  const totalStudents = useMemo(() => DELHI_NCR_SCHOOLS.reduce((sum, s) => sum + s.studentStrength, 0), []);
  const totalBuses = useMemo(() => DELHI_NCR_SCHOOLS.reduce((sum, s) => sum + s.transportBuses, 0), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Directory & Geo-Map Header */}
      <div className="glass-card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <div className="card-title-group">
            <Navigation size={22} color="#0284c7" />
            <div>
              <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
                Delhi-NCR Interactive AQI Geo-Map & Monitored Campuses
              </h2>
              <p className="card-subtitle">
                Live spatial positioning across 56 premier educational institutions & CPCB / DPCC CAAQMS telemetry hubs
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

        {/* Aggregate Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Monitored Campuses</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0284c7', fontFamily: 'var(--font-heading)' }}>
              {DELHI_NCR_SCHOOLS.length} Top Schools
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Enrolled Students Protected</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#059669', fontFamily: 'var(--font-heading)' }}>
              {totalStudents.toLocaleString()}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>School Bus Fleet Tracked</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#d97706', fontFamily: 'var(--font-heading)' }}>
              {totalBuses.toLocaleString()} Buses
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Statutory Coverage</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#7c3aed', fontFamily: 'var(--font-heading)' }}>
              100% CAQM GRAP
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Delhi-NCR Geo-Map SVG Canvas */}
      <div className="glass-card" style={{ padding: '20px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '0.78rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <Wind size={15} color="#0284c7" />
            <span>Interactive Spatial Telemetry Grid • Click any of the 56 campus pins to switch active monitoring</span>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#991b1b' }} /> GRAP IV (&gt;450)
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '420px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          
          <svg viewBox="0 0 820 480" style={{ width: '100%', height: '100%' }}>
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
            <rect width="820" height="480" fill="url(#geoGrid)" />

            {/* Yamuna River Curve Simulation */}
            <path
              d="M 400 10 Q 430 120 470 210 T 520 350 T 570 470"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
            <text x="510" y="270" fill="#0284c7" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6" transform="rotate(45, 510, 270)">
              Yamuna River Corridor
            </text>

            {/* Delhi State Boundary Mock Outline */}
            <path
              d="M 230 80 L 460 60 L 590 160 L 630 280 L 530 420 L 330 410 L 220 280 Z"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text x="250" y="110" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="var(--font-mono)">
              DELHI NCT BORDER
            </text>

            {/* Smog Inversion Plume Layer (Toggleable) */}
            {showInversionPlume && (
              <>
                <circle cx="580" cy="180" r="140" fill="url(#smogPlumeEast)" pointerEvents="none" />
                <circle cx="290" cy="100" r="120" fill="url(#smogPlumeNorth)" pointerEvents="none" />
                <text x="550" y="150" fill="#be123c" fontSize="9" fontWeight="bold" opacity="0.75" pointerEvents="none">
                  HIGH SMOG TRAPPING (ANAND VIHAR / GHAZIABAD CHOKE)
                </text>
              </>
            )}

            {/* Regional Zone Labels */}
            <text x="300" y="65" fill="#64748b" fontSize="10" fontWeight="bold">NORTH DELHI (BAWANA / ROHINI)</text>
            <text x="630" y="210" fill="#64748b" fontSize="10" fontWeight="bold">NOIDA & EXPRESSWAY (NCR)</text>
            <text x="140" y="420" fill="#64748b" fontSize="10" fontWeight="bold">GURUGRAM (NCR)</text>
            <text x="370" y="220" fill="#64748b" fontSize="10" fontWeight="bold">CENTRAL DELHI (ITO / CP)</text>
            <text x="360" y="360" fill="#64748b" fontSize="10" fontWeight="bold">SOUTH DELHI (RK PURAM / VK)</text>

            {/* All 56 School Campus Geo-Pins */}
            {DELHI_NCR_SCHOOLS.map((school) => {
              const { x, y } = mapCoords(school.lat, school.lon);
              const isSelected = school.id === selectedSchool.id;
              const isHovered = hoveredPin && hoveredPin.id === school.id;
              const aqiInfo = getSchoolAqiMock(school);

              // Check if school is in active filter
              const isZoneMatch = selectedZone === 'All' || school.zone === selectedZone;
              const opacity = isZoneMatch ? 1 : 0.25;

              return (
                <g 
                  key={school.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease', opacity }}
                  onClick={() => onSelectSchool(school)}
                  onMouseEnter={() => setHoveredPin(school)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  {/* Radar Pulse for Active Selected School */}
                  {isSelected && (
                    <circle r="22" fill="#0284c7" opacity="0.35">
                      <animate attributeName="r" values="10;28;10" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Core Pin Dot */}
                  <circle
                    r={isSelected ? 10 : isHovered ? 8 : 5.5}
                    fill={isSelected ? "#0284c7" : aqiInfo.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.25))"
                  />

                  {/* Pin Badge on Selected or Hovered */}
                  {(isSelected || isHovered) && (
                    <g transform="translate(12, -14)">
                      <rect
                        width={isSelected ? "110" : "85"}
                        height="32"
                        rx="5"
                        fill="#ffffff"
                        stroke={isSelected ? "#0284c7" : aqiInfo.color}
                        strokeWidth="1.5"
                        filter="drop-shadow(0px 2px 6px rgba(0,0,0,0.12))"
                      />
                      <text
                        x="8"
                        y="13"
                        fontSize="9"
                        fontWeight="800"
                        fill={aqiInfo.color}
                        fontFamily="var(--font-mono)"
                      >
                        {aqiInfo.aqi} AQI • {aqiInfo.stage}
                      </text>
                      <text
                        x="8"
                        y="25"
                        fontSize="8.5"
                        fontWeight="700"
                        fill="#0f172a"
                        fontFamily="var(--font-heading)"
                      >
                        {school.shortName.length > 18 ? school.shortName.slice(0, 16) + '..' : school.shortName}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Details Card */}
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
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                minWidth: '260px',
                pointerEvents: 'none',
                zIndex: 10
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#0284c7', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {hoveredPin.zone}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: getSchoolAqiMock(hoveredPin).color, fontFamily: 'var(--font-mono)' }}>
                  {getSchoolAqiMock(hoveredPin).aqi} AQI
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', color: '#0f172a', margin: '4px 0 6px' }}>
                {hoveredPin.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                Station: <strong>{hoveredPin.stationName}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>
                Strength: <strong>{hoveredPin.studentStrength.toLocaleString()} students</strong> • Fleet: <strong>{hoveredPin.transportBuses} buses</strong>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Directory Search & Filter Controls */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Search bar and counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 56 schools by name, zone, address, or principal..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: '#ffffff',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Showing <strong style={{ color: '#0284c7' }}>{filteredSchools.length}</strong> of {DELHI_NCR_SCHOOLS.length} Campuses
            </div>
          </div>

          {/* Zone Chips Filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#64748b', marginRight: '4px' }}>
              <Filter size={12} />
              <span>Zone:</span>
            </div>
            {zones.map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.72rem',
                  fontWeight: selectedZone === zone ? 700 : 500,
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedZone === zone ? '#0284c7' : 'var(--border-subtle)',
                  background: selectedZone === zone ? '#f0f9ff' : '#ffffff',
                  color: selectedZone === zone ? '#0284c7' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {zone === 'All' ? `All Zones (${DELHI_NCR_SCHOOLS.length})` : zone}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Schools Cards Grid (56 Schools) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {filteredSchools.map((school) => {
          const isSelected = school.id === selectedSchool.id;
          const aqiInfo = getSchoolAqiMock(school);

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
                padding: '18px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
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

                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
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

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                <span>Principal: {school.principal}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{isSelected ? 'Currently Selected' : 'Select Campus'}</span>
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
