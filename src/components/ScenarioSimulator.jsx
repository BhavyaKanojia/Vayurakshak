import React, { useState } from 'react';
import { Sliders, RotateCcw, Play } from 'lucide-react';

export default function ScenarioSimulator({ 
  currentAqi, 
  isSimulated, 
  onSimulate, 
  onResetLive 
}) {
  const [customVal, setCustomVal] = useState(currentAqi || 345);

  const presets = [
    { label: 'Normal / Safe', aqi: 75, stage: 'Stage 0', border: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(6, 78, 59, 0.25)', color: '#6ee7b7' },
    { label: 'GRAP I (Poor)', aqi: 245, stage: 'Stage 1', border: 'rgba(249, 115, 22, 0.4)', bg: 'rgba(124, 45, 18, 0.25)', color: '#fdba74' },
    { label: 'GRAP II (Very Poor)', aqi: 345, stage: 'Stage 2', border: 'rgba(239, 68, 68, 0.4)', bg: 'rgba(153, 27, 27, 0.25)', color: '#fca5a5' },
    { label: 'GRAP III (Severe)', aqi: 425, stage: 'Stage 3', border: 'rgba(244, 63, 94, 0.45)', bg: 'rgba(136, 19, 55, 0.3)', color: '#fda4af' },
    { label: 'GRAP IV (Hazardous)', aqi: 485, stage: 'Stage 4', border: 'rgba(220, 38, 38, 0.6)', bg: 'rgba(127, 29, 29, 0.45)', color: '#fecaca' },
  ];

  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title-group">
          <Sliders size={20} color="#f59e0b" />
          <div>
            <h3 className="card-title">Hackathon Evaluation & Scenario Simulator</h3>
            <p className="card-subtitle">Inject live statutory thresholds to test automated stage transitions</p>
          </div>
        </div>

        {isSimulated && (
          <button
            onClick={onResetLive}
            className="btn-icon-refresh"
            style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.4)' }}
          >
            <RotateCcw size={14} />
            <span>Reset to Live Feeds</span>
          </button>
        )}
      </div>

      {/* Preset Quick Buttons */}
      <div className="presets-grid">
        {presets.map((p) => (
          <button
            key={p.stage}
            onClick={() => onSimulate(p.aqi, p.label)}
            className="preset-btn"
            style={{
              borderColor: p.border,
              background: p.bg,
              color: p.color
            }}
          >
            <div className="preset-stage-tag">{p.stage}</div>
            <div className="preset-label">{p.label}</div>
            <div className="preset-aqi">AQI: {p.aqi}</div>
          </button>
        ))}
      </div>

      {/* Custom Slider Input */}
      <div className="slider-action-row">
        <div className="slider-group">
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            Custom AQI:
          </span>
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={customVal}
            onChange={(e) => setCustomVal(Number(e.target.value))}
            className="custom-slider"
          />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'white', minWidth: '40px' }}>
            {customVal}
          </span>
        </div>

        <button
          onClick={() => onSimulate(customVal, `Custom AQI ${customVal}`)}
          className="btn-broadcast-cta"
          style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)' }}
        >
          <Play size={14} />
          <span>Apply Ingestion</span>
        </button>
      </div>

    </div>
  );
}
