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

export default function GRAPActionCenter({ aqi, school, onOpenBroadcast, onOpenBedrock }) {
  const grapData = getGRAPStage(aqi);
  const [completedTasks, setCompletedTasks] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');

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

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onOpenBedrock}
            className="btn-icon-refresh"
            style={{ color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.3)' }}
          >
            <Sparkles size={14} />
            <span>AI Copilot</span>
          </button>
          <button
            onClick={markAllComplete}
            className="btn-icon-refresh"
            style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}
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
            <span style={{ fontWeight: 800, color: isAllCompleted ? '#34d399' : '#38bdf8' }}>
              {progressPercent}%
            </span>
            {isAllCompleted && (
              <span style={{ 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                color: '#34d399', 
                background: 'rgba(16, 185, 129, 0.15)', 
                padding: '2px 8px', 
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Award size={12} /> 100% COMPLIANT
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
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <Circle size={18} color="#64748b" />
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
          <Bus size={18} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Transport Fleet Rule: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>{grapData.transportRule}</span>
          </div>
        </div>

        <div className="directive-card">
          <Wind size={18} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Mask Protection Protocol: </strong>
            <span style={{ color: 'var(--text-secondary)' }}>{grapData.maskRecommendation}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
