import React from 'react';
import { School, MapPin, Users, Bus, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { DELHI_NCR_SCHOOLS } from '../services/schoolsData';

export default function SchoolDirectory({ selectedSchool, onSelectSchool }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Directory Header */}
      <div className="glass-card">
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div className="card-title-group">
            <School size={22} color="#06b6d4" />
            <div>
              <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
                Delhi-NCR Monitored Schools & CAAQMS Stations Network
              </h2>
              <p className="card-subtitle">
                Automated compliance monitoring coverage across key industrial and educational hubs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {DELHI_NCR_SCHOOLS.map((school) => {
          const isSelected = school.id === selectedSchool.id;

          return (
            <div
              key={school.id}
              onClick={() => onSelectSchool(school)}
              className="glass-card"
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? '#06b6d4' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'rgba(15,23,42,0.9)', borderRadius: '4px', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                    {school.zone}
                  </span>
                  {isSelected && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.35)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} /> ACTIVE
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', color: 'white', marginBottom: '8px' }}>
                  {school.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                    <MapPin size={14} color="#64748b" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                    <Activity size={14} color="#06b6d4" style={{ flexShrink: 0 }} />
                    <span>Station: <strong style={{ color: '#e2e8f0' }}>{school.stationName}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
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

              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>
                <span>Principal: {school.principal}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Switch Campus</span>
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
