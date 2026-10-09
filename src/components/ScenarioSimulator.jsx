import React, { useState } from 'react';
import { Play, Sparkles, Sliders, RotateCcw, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ScenarioSimulator({ 
  currentAqi, 
  isSimulated, 
  onSimulate, 
  onResetLive 
}) {
  const [customVal, setCustomVal] = useState(currentAqi || 345);

  const presets = [
    { label: 'Normal / Standard', aqi: 75, stage: 'Stage 0', color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' },
    { label: 'GRAP I (Poor)', aqi: 245, stage: 'Stage 1', color: 'border-orange-500/40 bg-orange-950/30 text-orange-300' },
    { label: 'GRAP II (Very Poor)', aqi: 345, stage: 'Stage 2', color: 'border-red-500/40 bg-red-950/30 text-red-300' },
    { label: 'GRAP III (Severe)', aqi: 425, stage: 'Stage 3', color: 'border-rose-500/40 bg-rose-950/30 text-rose-300' },
    { label: 'GRAP IV (Hazardous)', aqi: 485, stage: 'Stage 4', color: 'border-red-600 bg-red-950/60 text-rose-200' },
  ];

  return (
    <div className="glass-panel p-5 border-white/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Hackathon Evaluation & GRAP Stage Scenario Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate statutory threshold triggers instantly for demo videos and compliance audits
            </p>
          </div>
        </div>

        {/* Live Reset Button */}
        {isSimulated && (
          <button
            onClick={onResetLive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Live Feeds</span>
          </button>
        )}
      </div>

      {/* Preset Quick Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {presets.map((p) => (
          <button
            key={p.stage}
            onClick={() => onSimulate(p.aqi, p.label)}
            className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${p.color}`}
          >
            <div className="text-[10px] uppercase font-mono font-bold">{p.stage}</div>
            <div className="text-xs font-bold mt-0.5 truncate">{p.label}</div>
            <div className="text-[11px] font-mono mt-1 opacity-80">AQI: {p.aqi}</div>
          </button>
        ))}
      </div>

      {/* Custom Slider Input */}
      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 shrink-0">Custom AQI:</span>
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={customVal}
            onChange={(e) => setCustomVal(Number(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-sm font-bold font-mono text-white w-10 text-right">{customVal}</span>
        </div>

        <button
          onClick={() => onSimulate(customVal, `Custom AQI ${customVal}`)}
          className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <Play className="w-3 h-3" />
          <span>Apply Ingestion</span>
        </button>
      </div>

    </div>
  );
}
