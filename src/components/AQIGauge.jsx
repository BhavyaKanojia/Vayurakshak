import React from 'react';
import { Wind, Activity, Flame, Droplets, ShieldCheck, Zap, Info } from 'lucide-react';

export default function AQIGauge({ data, school }) {
  if (!data) return null;

  const { naqi, telemetry, timestamp } = data;
  const aqi = naqi?.aqi || 0;
  const category = naqi?.category || {};

  // Dial calculations (0 to 500 AQI maps to -110deg to 110deg)
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const angle = -110 + (clampedAqi / 500) * 220;

  const pollutants = [
    {
      key: 'pm2_5',
      name: 'PM2.5',
      value: telemetry.pm2_5,
      unit: 'µg/m³',
      safeLimit: 60,
      icon: Flame
    },
    {
      key: 'pm10',
      name: 'PM10',
      value: telemetry.pm10,
      unit: 'µg/m³',
      safeLimit: 100,
      icon: Wind
    },
    {
      key: 'no2',
      name: 'NO₂',
      value: telemetry.no2,
      unit: 'µg/m³',
      safeLimit: 80,
      icon: Activity
    },
    {
      key: 'co',
      name: 'CO',
      value: telemetry.co,
      unit: 'mg/m³',
      safeLimit: 2.0,
      icon: Droplets
    },
    {
      key: 'so2',
      name: 'SO₂',
      value: telemetry.so2 || 14,
      unit: 'µg/m³',
      safeLimit: 80,
      icon: Zap
    },
    {
      key: 'o3',
      name: 'O₃',
      value: telemetry.o3 || 36,
      unit: 'µg/m³',
      safeLimit: 100,
      icon: ShieldCheck
    }
  ];

  return (
    <div className="aqi-overview-grid">
      
      {/* Primary AQI Dial Card */}
      <div className="glass-card gauge-card">
        <div 
          className="gauge-glow-bg" 
          style={{ backgroundColor: category.color || '#3b82f6' }}
        />

        <div>
          <div className="gauge-meta-top">
            <div className="gauge-meta-tag">
              <span className="live-dot" style={{ background: '#06b6d4' }} />
              <span>CPCB National AQI</span>
            </div>
            <span className="gauge-sync-time">
              Sync: {timestamp}
            </span>
          </div>

          <div className="station-badge">
            Station: <strong>{school.stationName}</strong>
          </div>
        </div>

        {/* Semi-circular Dial Gauge */}
        <div className="dial-container">
          <svg className="dial-svg" viewBox="0 0 200 115">
            <defs>
              <linearGradient id="aqiArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="20%" stopColor="#84cc16" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="80%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Gradient Gauge Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#aqiArcGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Needle */}
            <g transform={`rotate(${angle} 100 100)`} style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="7" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
            </g>

            {/* Range markers */}
            <text x="18" y="114" fill="#64748b" fontSize="9" fontWeight="bold">0</text>
            <text x="96" y="15" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">250</text>
            <text x="176" y="114" fill="#64748b" fontSize="9" fontWeight="bold">500+</text>
          </svg>

          <div className="dial-center-box">
            <div className="dial-aqi-number">
              {aqi}
              <span className="dial-aqi-unit">AQI</span>
            </div>

            <div 
              className="dial-category-pill"
              style={{
                borderColor: category.color || '#3b82f6',
                background: category.bgGlow || 'rgba(59, 130, 246, 0.15)',
                color: category.color || '#3b82f6'
              }}
            >
              <span className="live-dot" style={{ background: category.color }} />
              <span>{category.label} ({category.hindiLabel})</span>
            </div>
          </div>
        </div>

        <div className="gauge-footer">
          <div className="dominant-tag">
            <span>Dominant Pollutant:</span>
            <span className="dominant-pill">{naqi?.dominantPollutant || 'PM2.5'}</span>
          </div>
          <span style={{ color: '#64748b', fontStyle: 'italic' }}>Indian CPCB NAQI Standard</span>
        </div>

      </div>

      {/* Atmospheric Telemetry Grid */}
      <div className="glass-card telemetry-card">
        <div>
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <div className="card-title-group">
              <Activity size={18} color="#06b6d4" />
              <div>
                <h3 className="card-title">Atmospheric Telemetry & Exposure Metrics</h3>
                <p className="card-subtitle">Real-time monitored concentrations</p>
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Campus: <strong style={{ color: '#f8fafc' }}>{school.shortName}</strong>
            </span>
          </div>

          <div className="pollutant-grid">
            {pollutants.map((item) => {
              const Icon = item.icon;
              const isOver = item.value > item.safeLimit;
              const ratio = Math.round((item.value / item.safeLimit) * 100);

              return (
                <div key={item.key} className={`pollutant-box ${isOver ? 'danger' : ''}`}>
                  <div className="pollutant-box-header">
                    <span className="pollutant-name">{item.name}</span>
                    <Icon size={14} color={isOver ? '#f87171' : '#94a3b8'} />
                  </div>

                  <div className="pollutant-val-row">
                    <span className="pollutant-val">{item.value}</span>
                    <span className="pollutant-unit">{item.unit}</span>
                  </div>

                  <div className="pollutant-limit-row">
                    <span>Limit: {item.safeLimit}</span>
                    <span className={`pollutant-pct ${isOver ? 'danger' : 'safe'}`}>{ratio}%</span>
                  </div>

                  <div className="mini-bar-track">
                    <div 
                      className="mini-bar-fill" 
                      style={{ 
                        width: `${Math.min(100, (item.value / (item.safeLimit * 2)) * 100)}%`,
                        background: isOver ? 'linear-gradient(90deg, #f97316, #ef4444)' : '#10b981'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="health-insight-banner">
          <Info size={18} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Campus Impact: </strong>
            <span>{category.description}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
