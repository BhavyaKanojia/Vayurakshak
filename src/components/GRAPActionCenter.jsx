import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  CheckSquare, 
  Bus, 
  Wind, 
  Award 
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function GRAPActionCenter({ 
  aqi, 
  school, 
  onOpenBroadcast, 
  onOpenBedrock,
  onOpenOfficialCircular,
  onOpenCertificate
}) {
  const grapData = getGRAPStage(aqi);
  const [completedTasks, setCompletedTasks] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');
  const [activeDispersalBay, setActiveDispersalBay] = useState('primary');

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const tasks = grapData.checklist || [];
  const completedCount = tasks.filter(t => completedTasks[t.id]).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  const markAllComplete = () => {
    const updated = {};
    tasks.forEach(t => {
      updated[t.id] = true;
    });
    setCompletedTasks(updated);
  };

  const categories = ['All', ...new Set(tasks.map(t => t.category))];
  const filteredTasks = filterCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === filterCategory);

  return (
    <div className="glass-card">
      
      {/* GRAP Status Hero Banner */}
      <div className={`grap-status-hero stage-${grapData.stage}`}>
        <div className="grap-hero-top">
          
          <div className="grap-stage-title-box">
            <div className="grap-stage-icon-box">
              <ShieldAlert size={28} color={grapData.color} />
            </div>

            <div>
              <div className="grap-badge-row">
                <span className="grap-badge">{grapData.badge}</span>
                <span className="grap-threshold">{grapData.threshold}</span>
              </div>
              <h2 className="grap-stage-name">{grapData.name}</h2>
              <p className="grap-authority-text">
                Statutory Order: <span>{grapData.statutoryOrder}</span>
              </p>
            </div>
          </div>

          <div className="grap-school-mode-box">
            <div className="grap-mode-label">Operational Mode Mandate</div>
            <div className="grap-mode-val">
              <span className="ping-dot" />
              <span>{grapData.schoolMode}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Campus: <strong style={{ color: 'var(--text-primary)' }}>{school.shortName}</strong>
            </span>
          </div>

        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>CAQM Directives: </strong>
          <span>{grapData.overview}</span>
        </div>
      </div>

      {/* Compliance Header & Action Controls */}
      <div className="card-header">
        <div className="card-title-group">
          <CheckSquare size={20} color="#06b6d4" />
          <div>
            <h3 className="card-title">School Principal Statutory Compliance Checklist</h3>
            <p className="card-subtitle">Mandatory directives legally required under CAQM & Directorate of Education</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenOfficialCircular}
            className="btn-icon-refresh"
            style={{ color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.3)', background: '#f0f9ff' }}
            title="Generate printable signed official school circular"
          >
            <Award size={14} />
            <span>Official Letterhead PDF</span>
          </button>

          <button
            onClick={() => onOpenCertificate({ completedCount, totalCount })}
            className="btn-icon-refresh"
            style={{ color: '#059669', borderColor: 'rgba(16, 185, 129, 0.3)', background: '#ecfdf5' }}
            title="View tamper-evident compliance audit certificate"
          >
            <ShieldAlert size={14} />
            <span>Audit Certificate</span>
          </button>

          <button
            onClick={onOpenBedrock}
            className="btn-icon-refresh"
            style={{ color: '#7c3aed', borderColor: 'rgba(124, 58, 237, 0.3)', background: '#f5f3ff' }}
          >
            <Sparkles size={14} />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={markAllComplete}
            className="btn-icon-refresh"
            style={{ color: '#059669', borderColor: 'rgba(16, 185, 129, 0.3)', background: '#ecfdf5' }}
          >
            <CheckCircle2 size={14} />
            <span>Mark All Complied</span>
          </button>
        </div>
      </div>

      {/* Compliance Progress Bar */}
      <div className="compliance-progress-box">
        <div className="progress-header-row">
          <span style={{ color: 'var(--text-muted)' }}>
            Action Items: <strong style={{ color: 'var(--text-primary)' }}>{completedCount} of {totalCount} Complied</strong>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: isAllCompleted ? '#059669' : '#0284c7' }}>
              {progressPercent}%
            </span>
            {isAllCompleted ? (
              <button
                onClick={() => onOpenCertificate({ completedCount, totalCount })}
                style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  color: '#059669', 
                  background: '#ecfdf5', 
                  padding: '3px 10px', 
                  borderRadius: '4px',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <Award size={13} /> 100% COMPLIANT • VIEW CERTIFICATE
              </button>
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Complete all items to certify
              </span>
            )}
          </div>
        </div>

        <div className="progress-bar-track">
          <div 
            className={`progress-bar-fill ${isAllCompleted ? 'complete' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="category-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Checklist Tasks Grid */}
      <div className="checklist-grid">
        {filteredTasks.map((task) => {
          const isDone = !!completedTasks[task.id];
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`task-item-card ${isDone ? 'completed' : ''}`}
            >
              <div className="task-check-icon">
                {isDone ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : (
                  <Circle size={18} color="#94a3b8" />
                )}
              </div>

              <div className="task-content-box">
                <div className="task-meta-row">
                  <span className="task-tag">{task.category}</span>
                  {task.mandatory && (
                    <span className="task-mandatory-badge">Mandatory</span>
                  )}
                </div>
                <p className="task-text">{task.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transport & Mask Directives Row */}
      <div className="directives-two-col">
        <div className="directive-card">
          <Bus size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Transport Fleet Rule: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>{grapData.transportRule}</span>
          </div>
        </div>

        <div className="directive-card">
          <Wind size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Mask Protection Protocol: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>{grapData.maskRecommendation}</span>
          </div>
        </div>
      </div>

      {/* Staggered Bus Dispersal Scheduler (Anti-Idle Smog Mitigation) */}
      <div style={{ marginTop: '18px', padding: '16px 18px', background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bus size={18} color="#0284c7" />
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>Staggered Bus Fleet Dispersal Scheduler</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                Prevents exhaust cloud accumulation across campus parking bays ({school.transportBuses} Fleet Buses)
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '4px' }}>
            0-Minute Engine Idling Rule Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div 
            onClick={() => setActiveDispersalBay('primary')}
            style={{ 
              padding: '12px', 
              background: activeDispersalBay === 'primary' ? '#ffffff' : 'transparent',
              border: `1px solid ${activeDispersalBay === 'primary' ? '#0284c7' : 'var(--border-subtle)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: activeDispersalBay === 'primary' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
            }}
          >
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 800 }}>WINDOW 1 • 01:15 PM</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>Primary Wing (Nursery - 5)</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bays 1 to 12 • Priority departure</div>
          </div>

          <div 
            onClick={() => setActiveDispersalBay('middle')}
            style={{ 
              padding: '12px', 
              background: activeDispersalBay === 'middle' ? '#ffffff' : 'transparent',
              border: `1px solid ${activeDispersalBay === 'middle' ? '#0284c7' : 'var(--border-subtle)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: activeDispersalBay === 'middle' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
            }}
          >
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 800 }}>WINDOW 2 • 01:45 PM</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>Middle Wing (Classes 6 - 8)</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bays 13 to 24 • Controlled departure</div>
          </div>

          <div 
            onClick={() => setActiveDispersalBay('senior')}
            style={{ 
              padding: '12px', 
              background: activeDispersalBay === 'senior' ? '#ffffff' : 'transparent',
              border: `1px solid ${activeDispersalBay === 'senior' ? '#0284c7' : 'var(--border-subtle)'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: activeDispersalBay === 'senior' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
            }}
          >
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 800 }}>WINDOW 3 • 02:15 PM</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0' }}>Senior Wing (Classes 9 - 12)</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bays 25 to 38 • Final dispersal</div>
          </div>
        </div>
      </div>

    </div>
  );
}
