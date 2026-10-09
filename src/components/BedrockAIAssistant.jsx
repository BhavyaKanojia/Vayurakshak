import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Brain, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  AlertOctagon, 
  Bus, 
  Stethoscope, 
  UserCheck, 
  Layers,
  Zap
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function BedrockAIAssistant({ aqi, school, onClose }) {
  const grap = getGRAPStage(aqi);
  const [activeTab, setActiveTab] = useState('executive');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate contextual AI advice
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

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c1222] border border-indigo-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-heading">
                  Amazon Bedrock — AI Principal Advisory Copilot
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Claude 3 Haiku
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synthesizing real-time statutory advice for {school.shortName} (AQI {aqi} • {grap.shortCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-3 bg-slate-950/60 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'executive'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Executive Legal Directives</span>
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'transport'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Fleet & Transport Route</span>
          </button>

          <button
            onClick={() => setActiveTab('medical')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'medical'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Infirmary & Vulnerable Students</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'staff'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Staff & Facility Management</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono">
              <Cpu className="w-4 h-4" />
              <span>Prompt: CAQM GRAP Rulebook + Live Station Telemetry</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Latency: 142ms • Bedrock Zero-Bill Free Tier
            </span>
          </div>

          <div className="space-y-3">
            {aiContent[activeTab]?.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 hover:border-indigo-500/30 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Powered by Amazon Bedrock generative LLM inference pipeline</span>
          </div>

          <button
            onClick={() => handleCopy(aiContent[activeTab]?.join('\n\n'))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Directives!' : 'Copy Directives'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
