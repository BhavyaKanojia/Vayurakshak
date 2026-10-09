import React from 'react';
import { Wind, Activity, AlertCircle, Info, Flame, Droplets, ShieldCheck, Zap } from 'lucide-react';

export default function AQIGauge({ data, school }) {
  if (!data) return null;

  const { naqi, telemetry, timestamp } = data;
  const aqi = naqi?.aqi || 0;
  const category = naqi?.category || {};

  // Dial calculations (0 to 500 AQI maps to -110deg to 110deg)
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const angle = -110 + (clampedAqi / 500) * 220;

  // Pollutant definitions with CPCB standard 24-hr safe limits
  const pollutants = [
    {
      key: 'pm2_5',
      name: 'PM2.5',
      fullName: 'Fine Particulate Matter',
      value: telemetry.pm2_5,
      unit: 'µg/m³',
      safeLimit: 60,
      whoLimit: 15,
      impact: 'Penetrates deep lung alveoli & enters bloodstream',
      icon: Flame
    },
    {
      key: 'pm10',
      name: 'PM10',
      fullName: 'Coarse Particulates / Dust',
      value: telemetry.pm10,
      unit: 'µg/m³',
      safeLimit: 100,
      whoLimit: 45,
      impact: 'Causes nasal congestion & throat irritation',
      icon: Wind
    },
    {
      key: 'no2',
      name: 'NO₂',
      fullName: 'Nitrogen Dioxide (Vehicular)',
      value: telemetry.no2,
      unit: 'µg/m³',
      safeLimit: 80,
      whoLimit: 25,
      impact: 'Inflames airways, triggers acute child asthma',
      icon: Activity
    },
    {
      key: 'co',
      name: 'CO',
      fullName: 'Carbon Monoxide',
      value: telemetry.co,
      unit: 'mg/m³',
      safeLimit: 2.0,
      whoLimit: 4.0,
      impact: 'Reduces oxygen delivery to vital organs',
      icon: Droplets
    },
    {
      key: 'so2',
      name: 'SO₂',
      fullName: 'Sulphur Dioxide',
      value: telemetry.so2 || 14,
      unit: 'µg/m³',
      safeLimit: 80,
      whoLimit: 40,
      impact: 'Industrial emission; exacerbates bronchospasm',
      icon: Zap
    },
    {
      key: 'o3',
      name: 'O₃',
      fullName: 'Ground-level Ozone',
      value: telemetry.o3 || 36,
      unit: 'µg/m³',
      safeLimit: 100,
      whoLimit: 100,
      impact: 'Photochemical smog gas; causes coughing',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Primary AQI Dial Card (5 cols) */}
      <div className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
        {/* Glowing background aura matching current AQI status */}
        <div 
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: category.color || '#3b82f6' }}
        />

        <div>
          {/* Top meta */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
                CPCB National AQI
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-white/5">
              Sync: {timestamp}
            </span>
          </div>

          <div className="text-xs text-slate-400 mb-4 flex items-center justify-between">
            <span className="truncate">Monitoring: <strong className="text-slate-200">{school.stationName}</strong></span>
          </div>
        </div>

        {/* Semi-circular Dial Visualization */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <svg className="w-64 h-36 overflow-visible" viewBox="0 0 200 115">
            <defs>
              <linearGradient id="aqiArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="20%" stopColor="#84cc16" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="80%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Gradient Gauge Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#aqiArcGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Needle Pointer */}
            <g transform={`rotate(${angle} 100 100)`} className="transition-transform duration-700 ease-out">
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="28"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="7" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
            </g>

            {/* Min / Max labels */}
            <text x="18" y="114" fill="#64748b" fontSize="9" fontWeight="bold">0</text>
            <text x="96" y="15" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">250</text>
            <text x="176" y="114" fill="#64748b" fontSize="9" fontWeight="bold">500+</text>
          </svg>

          {/* Large Center AQI Value */}
          <div className="text-center mt-1">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black font-heading tracking-tight text-white drop-shadow-md">
                {aqi}
              </span>
              <span className="text-xs text-slate-400 font-medium uppercase font-mono">AQI</span>
            </div>
            
            {/* Category Pill */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <span 
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${category.badgeBg}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                {category.label} ({category.hindiLabel})
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Callout & Dominant Pollutant */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">Dominant Driver:</span>
            <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              {naqi?.dominantPollutant || 'PM2.5'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 italic">
            Indian NAQI Standard
          </div>
        </div>

      </div>

      {/* Gas Telemetry Grid (7 cols) */}
      <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Atmospheric Telemetry & Exposure Metrics
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              School: <span className="text-white font-medium">{school.shortName}</span>
            </span>
          </div>

          {/* Grid of Pollutant Sub-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pollutants.map((item) => {
              const Icon = item.icon;
              const isOverCPCB = item.value > item.safeLimit;
              const ratio = Math.round((item.value / item.safeLimit) * 100);

              return (
                <div
                  key={item.key}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isOverCPCB
                      ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                      : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">{item.name}</span>
                    <Icon className={`w-3.5 h-3.5 ${isOverCPCB ? 'text-red-400' : 'text-slate-400'}`} />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-bold font-heading ${isOverCPCB ? 'text-red-300' : 'text-white'}`}>
                      {item.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.unit}</span>
                  </div>

                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>CPCB Limit: {item.safeLimit}</span>
                    <span className={`font-mono font-semibold ${isOverCPCB ? 'text-red-400' : 'text-emerald-400'}`}>
                      {ratio}%
                    </span>
                  </div>

                  {/* Visual mini-bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isOverCPCB ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.value / (item.safeLimit * 2)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Advisory Insight Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">Campus Impact Summary: </span>
            {category.description}
          </div>
        </div>

      </div>

    </div>
  );
}
