import React, { useState, useEffect } from 'react';
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
  Zap,
  Key,
  Volume2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';
import { generateGroqAdvisory, getStoredGroqKey, setStoredGroqKey } from '../services/groqService';
import { speakText, stopSpeaking } from '../services/audioService';

export default function BedrockAIAssistant({ aqi, school, onClose }) {
  const grap = getGRAPStage(aqi);
  const [activeTab, setActiveTab] = useState('executive');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Groq Live State
  const [groqKey, setGroqKey] = useState(getStoredGroqKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveGeneratedText, setLiveGeneratedText] = useState(null);
  const [groqError, setGroqError] = useState(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

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

  const defaultContent = getAIContent();

  const handleRunGroq = async () => {
    setIsGenerating(true);
    setGroqError(null);
    try {
      const topicName = activeTab === 'executive' 
        ? 'Executive Mandate & Closure Status' 
        : activeTab === 'transport' 
        ? 'School Bus Fleet & Traffic Restrictions' 
        : activeTab === 'medical' 
        ? 'Infirmary Emergency Protocols & Respiratory Vulnerability' 
        : 'Faculty & Administrative Protocols';

      const result = await generateGroqAdvisory({
        aqi,
        school,
        grapStage: grap.shortCode,
        topic: topicName,
        apiKey: groqKey
      });

      setLiveGeneratedText(result);
    } catch (err) {
      if (err.message === 'NO_KEY') {
        setShowKeyInput(true);
        setGroqError('Please paste your Groq API Key below to enable live LLaMA 3.3 generation.');
      } else {
        setGroqError(err.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveKey = (val) => {
    setGroqKey(val);
    setStoredGroqKey(val);
    setGroqError(null);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakText({
      text,
      lang: 'en-IN',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const activeDirectives = defaultContent[activeTab] || [];
  const activeTextToSpeak = liveGeneratedText || activeDirectives.join('. ');

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
                <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Amazon Bedrock & Groq AI Copilot</h2>
                <span className="brand-badge" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
                  {groqKey ? 'Groq LLaMA 3.3' : 'Bedrock Claude 3'}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Principal directives synthesis for {school.shortName} (GRAP {grap.shortCode})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setShowKeyInput(!showKeyInput)} 
              className="btn-icon-refresh"
              style={{
                background: groqKey ? '#f0fdf4' : '#ffffff',
                borderColor: groqKey ? '#a7f3d0' : 'var(--border-subtle)',
                color: groqKey ? '#059669' : 'var(--text-muted)'
              }}
              title="Configure custom Groq API Key"
            >
              <Key size={14} />
              <span>{groqKey ? 'Groq Key Active' : 'Set Groq API'}</span>
            </button>

            <button onClick={onClose} className="btn-icon-refresh" style={{ padding: '6px 8px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* API Key Drawer (Optional) */}
        {showKeyInput && (
          <div style={{ padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={16} color="#7c3aed" />
            <input
              type="password"
              placeholder="Paste Groq API Key (gsk_...)"
              value={groqKey}
              onChange={(e) => handleSaveKey(e.target.value)}
              className="custom-select"
              style={{ flex: 1, padding: '7px 12px', fontSize: '0.78rem' }}
            />
            {groqKey && (
              <button 
                onClick={() => handleSaveKey('')}
                className="btn-icon-refresh"
                style={{ fontSize: '0.72rem', padding: '6px 10px' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Tab Selector */}
        <div style={{ padding: '10px 24px', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', overflowX: 'auto', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setActiveTab('executive'); setLiveGeneratedText(null); }}
              className={`nav-pill-btn ${activeTab === 'executive' ? 'active' : ''}`}
            >
              <Brain size={14} />
              <span>Executive Mandate</span>
            </button>
            <button
              onClick={() => { setActiveTab('transport'); setLiveGeneratedText(null); }}
              className={`nav-pill-btn ${activeTab === 'transport' ? 'active' : ''}`}
            >
              <Bus size={14} />
              <span>Transport Fleet</span>
            </button>
            <button
              onClick={() => { setActiveTab('medical'); setLiveGeneratedText(null); }}
              className={`nav-pill-btn ${activeTab === 'medical' ? 'active' : ''}`}
            >
              <Stethoscope size={14} />
              <span>Infirmary Protocol</span>
            </button>
            <button
              onClick={() => { setActiveTab('staff'); setLiveGeneratedText(null); }}
              className={`nav-pill-btn ${activeTab === 'staff' ? 'active' : ''}`}
            >
              <UserCheck size={14} />
              <span>Staff Management</span>
            </button>
          </div>

          <button
            onClick={handleRunGroq}
            disabled={isGenerating}
            className="btn-icon-refresh"
            style={{ 
              background: '#f5f3ff', 
              borderColor: '#ddd6fe', 
              color: '#7c3aed',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <Sparkles size={13} className={isGenerating ? 'spin-anim' : ''} />
            <span>{isGenerating ? 'Synthesizing...' : 'Live Groq LLM'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {groqError && (
            <div style={{ padding: '10px 14px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#be123c' }}>
              <AlertCircle size={15} />
              <span>{groqError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed' }}>
              <Cpu size={14} />
              <span>{liveGeneratedText ? 'Live Real-Time Inference: Groq LLaMA 3.3 70B' : 'Pre-Engineered Bedrock Legal Knowledge Base'}</span>
            </div>
            
            <button
              onClick={() => handleSpeak(activeTextToSpeak)}
              className="btn-icon-refresh"
              style={{
                padding: '4px 10px',
                fontSize: '0.72rem',
                background: isSpeaking ? '#ecfdf5' : '#ffffff',
                borderColor: isSpeaking ? '#10b981' : 'var(--border-subtle)',
                color: isSpeaking ? '#059669' : 'var(--text-secondary)'
              }}
            >
              <Volume2 size={13} />
              <span>{isSpeaking ? 'Stop Reading' : 'Listen Briefing'}</span>
            </button>
          </div>

          {/* Directives Display */}
          {liveGeneratedText ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #ddd6fe',
              borderRadius: '10px',
              padding: '18px 20px',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '0.75rem', color: '#7c3aed', fontWeight: 800 }}>
                <Sparkles size={14} />
                <span>DYNAMIC SYNTHESIZED STATUTORY DIRECTIVE (GROQ)</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {liveGeneratedText}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeDirectives.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '2px' }}>
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Zap size={14} color="#f59e0b" />
            <span>Autonomous compliance guidance for school administration</span>
          </div>

          <button
            onClick={() => handleCopy(activeTextToSpeak)}
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
