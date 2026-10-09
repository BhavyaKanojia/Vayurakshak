import React from 'react';
import { Shield, Server, RefreshCw, Send, School as SchoolIcon } from 'lucide-react';
import { DELHI_NCR_SCHOOLS } from '../services/schoolsData';

export default function Header({
  selectedSchool,
  onSelectSchool,
  isSimulated,
  scenarioName,
  onRefresh,
  loading,
  activeTab,
  setActiveTab,
  onOpenBroadcast,
  grapStage
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        
        {/* Brand Group */}
        <div className="brand-group">
          <div className="brand-icon-box">
            <Shield size={24} />
            <div className="pulse-dot" />
          </div>
          <div className="brand-title-box">
            <h1>
              <span>VayuRakshak</span>
              <span className="brand-badge">AWS v1.0</span>
            </h1>
            <p className="brand-tagline">Delhi-NCR Automated School GRAP Compliance Platform</p>
          </div>
        </div>

        {/* Center: School Selector */}
        <div className="school-selector-wrap">
          <div className="select-container">
            <SchoolIcon className="select-icon" size={16} />
            <select
              value={selectedSchool.id}
              onChange={(e) => {
                const found = DELHI_NCR_SCHOOLS.find(s => s.id === e.target.value);
                if (found) onSelectSchool(found);
              }}
              className="custom-select"
            >
              {DELHI_NCR_SCHOOLS.map((school) => (
                <option key={school.id} value={school.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                  {school.shortName} ({school.zone})
                </option>
              ))}
            </select>
            <span className="select-arrow">▼</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-icon-refresh"
            title="Sync with live Open-Meteo & CPCB stations"
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} />
            <span>Sync</span>
          </button>
        </div>

        {/* Navigation & CTAs */}
        <div className="header-actions">
          {/* Live Status Pill */}
          <div className="live-feed-pill" style={{ color: isSimulated ? '#fbbf24' : '#34d399' }}>
            <span 
              className="live-dot" 
              style={{ background: isSimulated ? '#fbbf24' : '#34d399' }} 
            />
            <span>{isSimulated ? `SIM: ${scenarioName}` : 'LIVE FEED'}</span>
          </div>

          {/* Navigation Pill Group */}
          <div className="nav-pill-group">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`nav-pill-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`nav-pill-btn ${activeTab === 'directory' ? 'active' : ''}`}
            >
              Schools Map
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`nav-pill-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            >
              <Server size={14} />
              <span>AWS Cloud</span>
            </button>
          </div>

          {/* Parent Broadcast CTA */}
          <button
            onClick={onOpenBroadcast}
            className="btn-broadcast-cta"
          >
            <Send size={15} />
            <span>Parent Notice</span>
          </button>
        </div>

      </div>
    </header>
  );
}
