import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';

export default function HourlyForecast({ hourlyForecast = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  const aqiValues = hourlyForecast.map(p => p.aqi);
  const maxAqi = Math.max(...aqiValues);
  const avgAqi = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
  const peakHourPoint = hourlyForecast.find(p => p.aqi === maxAqi);

  return (
    <div className="glass-card">
      
      {/* Header */}
      <div className="card-header">
        <div className="card-title-group">
          <Clock size={20} color="#06b6d4" />
          <div>
            <h3 className="card-title">24-Hour Diurnal Forecast & Student Transit Windows</h3>
            <p className="card-subtitle">Diurnal inversion peak modeling covering student morning arrival & afternoon dispersal</p>
          </div>
        </div>

        <div className="hourly-stats-row">
          <div className="hourly-stat-pill">
            <span>24h Peak: </span>
            <strong style={{ color: '#f87171' }}>{maxAqi} AQI</strong> ({peakHourPoint?.time})
          </div>
          <div className="hourly-stat-pill">
            <span>24h Avg: </span>
            <strong style={{ color: '#38bdf8' }}>{avgAqi} AQI</strong>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="forecast-legend">
        <div className="legend-tag">
          <span className="legend-swatch" style={{ background: '#f59e0b' }} />
          <span style={{ color: '#fde68a' }}>Morning Arrival Rush (07:00 AM – 09:00 AM)</span>
        </div>
        <div className="legend-tag">
          <span className="legend-swatch" style={{ background: '#3b82f6' }} />
          <span style={{ color: '#bfdbfe' }}>Afternoon Dispersal (01:00 PM – 03:00 PM)</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
          <Info size={14} />
          <span>Hover column for hourly telemetry details</span>
        </div>
      </div>

      {/* 24-Hour Bar Graph */}
      <div className="bar-chart-track">
        {hourlyForecast.slice(0, 24).map((pt, idx) => {
          const heightPct = Math.max(12, Math.min(100, (pt.aqi / 500) * 100));
          const isMorning = pt.isMorningRush;
          const isAfternoon = pt.isAfternoonRush;

          let barBg = '#475569';
          if (pt.aqi <= 100) barBg = 'linear-gradient(180deg, #10b981, #059669)';
          else if (pt.aqi <= 200) barBg = 'linear-gradient(180deg, #eab308, #d97706)';
          else if (pt.aqi <= 300) barBg = 'linear-gradient(180deg, #f97316, #ea580c)';
          else if (pt.aqi <= 400) barBg = 'linear-gradient(180deg, #ef4444, #dc2626)';
          else barBg = 'linear-gradient(180deg, #b91c1c, #7f1d1d)';

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="bar-col"
            >
              {isMorning && <span className="bar-tag-top morning">Arrival</span>}
              {isAfternoon && <span className="bar-tag-top afternoon">Exit</span>}

              <div
                className="vertical-bar"
                style={{
                  height: `${heightPct}%`,
                  background: barBg,
                  boxShadow: isMorning 
                    ? '0 0 10px rgba(245, 158, 11, 0.5)' 
                    : isAfternoon 
                    ? '0 0 10px rgba(59, 130, 246, 0.5)' 
                    : 'none'
                }}
              />

              <span className="bar-time-label">
                {pt.time.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Hover Detail Card */}
      {hoveredPoint ? (
        <div className="hover-detail-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} color="#06b6d4" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ color: 'white', fontSize: '0.95rem' }}>{hoveredPoint.time}</strong>
                {hoveredPoint.isMorningRush && (
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.2)', color: '#fde68a', borderRadius: '4px', fontWeight: 700 }}>
                    MORNING ARRIVAL
                  </span>
                )}
                {hoveredPoint.isAfternoonRush && (
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(59, 130, 246, 0.2)', color: '#bfdbfe', borderRadius: '4px', fontWeight: 700 }}>
                    AFTERNOON DISPERSAL
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Category: <strong style={{ color: 'white' }}>{hoveredPoint.category?.label}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>AQI: </span>
              <strong style={{ color: 'white' }}>{hoveredPoint.aqi}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>PM2.5: </span>
              <strong style={{ color: '#f87171' }}>{hoveredPoint.pm2_5} µg/m³</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>PM10: </span>
              <strong style={{ color: '#fbbf24' }}>{hoveredPoint.pm10} µg/m³</strong>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '14px', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
          <span>💡 Early morning winter smog in Delhi peaks between 06:00 AM and 09:00 AM due to nocturnal temperature inversions.</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>Open-Meteo Hourly API</span>
        </div>
      )}

    </div>
  );
}
