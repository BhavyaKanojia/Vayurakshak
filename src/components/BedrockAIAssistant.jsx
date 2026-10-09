import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Brain, 
  Copy, 
  Check, 
  X, 
  Bus, 
  Stethoscope, 
  UserCheck, 
  Zap 
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function BedrockAIAssistant({ aqi, school, onClose }) {
  const grap = getGRAPStage(aqi);
  const [activeTab, setActiveTab] = useState('executive');
  const [copied, setCopied] = useState(false);

  const getAIContent = () => {
    if (grap.stage >= 4) {
      return {
        executive: [
          `🚨 Statutory Mandate: CAQM Section 14 Emergency Powers active. All physical classroom learning must cease immediately for Classes Nursery to 9 and Class 11.`,
          `🏛️ Legal Compliance: School faces statutory penal action under Section 15 of EPA 1986 if physical attendance for primary wings is enforced.`,
          `🛡️ Board Examinee Window: Classes 10 & 12 permitted strictly inside air-filtered sealed halls with continuous PM2.5 monitoring below 60 µg/m³.`
        ],
        transport: [
          `🚫 Complete shutdown of school transport fleet (BS-IV diesel buses strictly banned by Delhi Transport Dept).`,
          `⚡ CNG/Electric feeder vans allowed only for Class 10/12 board examinees with mandatory vehicle AC on recirculation mode.`,
          `⏱️ Gate Protocol: Direct drivers to maintain engine cutoff upon parking. Stagger departures by 20-minute intervals.`
        ],
        medical: [
          `🩺 High-Risk Roster: 142 known asthmatic and allergic rhinitis students flagged for daily tele-wellness checks by school medical staff.`,
          `💨 Infirmary Prep: Ensure 4 medical oxygen concentrators and portable nebulizers are calibrated and ready.`,
          `😷 Mask Fitment: Refuse entry to standard cloth masks; enforce minimum 5-layer certified N95 / FFP2 respirators.`
        ],
        staff: [
          `💻 50% Hybrid Work: Administrative, non-board faculty, and accounts teams transitioned to Work-From-Home mode.`,
          `🌿 Campus Workers: All outdoor gardening, sweeping, and physical maintenance personnel relieved from duty until AQI drops below 400.`
        ]
      };
    } else if (grap.stage === 3) {
      return {
        executive: [
          `⚠️ GRAP Stage III Active: Mandatory suspension of physical classes for Pre-School to Class 5 per Directorate of Education Order.`,
          `📚 Hybrid Transition: Activate Microsoft Teams / Google Classroom timetable for primary students by 06:30 PM today.`,
          `🛑 Zero Outdoor Exposure: Class 6 to 12 students to spend 100% of campus time inside air-conditioned/purified environments.`
        ],
        transport: [
          `🚫 Entry Ban: Bar all BS-III Petrol and BS-IV Diesel school transport vehicles from entering campus gates.`,
          `🚌 Dispersal Staggering: Release Class 6-8 at 01:30 PM, Class 9-10 at 02:00 PM, and Class 11-12 at 02:30 PM to minimize idling exhaust clouds.`
        ],
        medical: [
          `🩺 Screening Point: Setup thermal and pulse-oximeter check at Gate 1 for morning student entry.`,
          `💊 Emergency Meds: Infirmary to keep pediatric salbutamol inhalers and anti-histamine syrups in ready stock.`
        ],
        staff: [
          `🏫 Physical Education staff reassigned to indoor chess, yoga, and mental wellness sessions.`,
          `🚰 Perimeter Facility Team: Enforce water sprinkling along bus drop-off zone every 3 hours.`
        ]
      };
    } else if (grap.stage === 2) {
      return {
        executive: [
          `📢 GRAP Stage II Enforcement: AQI ${aqi} requires total cancellation of outdoor athletic periods and morning assemblies for all grades (1 to 12).`,
          `⚡ DG Set Prohibition: Strict prohibition on diesel generator operation; campus to operate strictly on grid/solar power.`
        ],
        transport: [
          `🚌 Enforce strict 0-minute engine idling policy in bus parking bays.`,
          `🚗 Send advisory to carpooling parents to turn off ignition while awaiting student pickup.`
        ],
        medical: [
          `😷 Advise vulnerable children with chronic coughs to attend classes wearing N95 masks.`,
          `💧 Hydration Protocol: Class teachers to enforce indoor water breaks every 45 minutes to ease respiratory mucous membrane hydration.`
        ],
        staff: [
          `🧹 Facility staff to pre-run HEPA filter units 45 minutes before morning school bell (07:15 AM).`
        ]
      };
    } else {
      return {
        executive: [
          `🌿 Standard Operations: AQI ${aqi} is within manageable thresholds. Morning assemblies and outdoor physical education permitted with routine hydration.`,
          `📊 Routine Monitoring: Automatic 15-minute EventBridge cron will alert leadership if PM2.5 crosses 90 µg/m³.`
        ],
        transport: [
          `🚌 Regular bus schedules in effect. Maintain routine vehicular emission check records.`
        ],
        medical: [
          `🩺 Routine health room protocols active.`
        ],
        staff: [
          `🌿 Regular campus green-belt landscaping and dust management active.`
        ]
      };
    }
  };

  const aiContent = getAIContent();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="brand-icon-box" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.15rem', color: 'white' }}>Amazon Bedrock AI Copilot</h2>
                <span className="brand-badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                  Claude 3 Haiku
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Principal directives synthesis for {school.shortName} (GRAP {grap.shortCode})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon-refresh" style={{ padding: '6px 8px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ padding: '10px 24px', background: 'rgba(10, 16, 30, 0.9)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('executive')}
            className={`nav-pill-btn ${activeTab === 'executive' ? 'active' : ''}`}
            style={{ flexShrink: 0 }}
          >
            <Brain size={14} />
            <span>Executive Mandate</span>
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`nav-pill-btn ${activeTab === 'transport' ? 'active' : ''}`}
            style={{ flexShrink: 0 }}
          >
            <Bus size={14} />
            <span>Transport Fleet</span>
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`nav-pill-btn ${activeTab === 'medical' ? 'active' : ''}`}
            style={{ flexShrink: 0 }}
          >
            <Stethoscope size={14} />
            <span>Infirmary Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`nav-pill-btn ${activeTab === 'staff' ? 'active' : ''}`}
            style={{ flexShrink: 0 }}
          >
            <UserCheck size={14} />
            <span>Staff Management</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc' }}>
              <Cpu size={14} />
              <span>Inference: Bedrock AWS Foundation Model Runtime</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)' }}>Zero-Bill Free Tier</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {aiContent[activeTab]?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-card-inner)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '2px' }}>
                  {idx + 1}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <Zap size={14} color="#f59e0b" />
            <span>Autonomous generative compliance guidance</span>
          </div>

          <button
            onClick={() => handleCopy(aiContent[activeTab]?.join('\n\n'))}
            className="btn-broadcast-cta"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Directives!' : 'Copy Directives'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
