import React, { useState } from 'react';
import { Clock, TrendingUp, AlertTriangle, Sun, Moon, Info, Calendar } from 'lucide-react';

export default function HourlyForecast({ hourlyForecast = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!hourlyForecast || hourlyForecast.length === 0) return null;

  // Compute metrics
  const aqiValues = hourlyForecast.map(p => p.aqi);
  const maxAqi = Math.max(...aqiValues);
  const minAqi = Math.min(...aqiValues);
  const avgAqi = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
  const peakHourPoint = hourlyForecast.find(p => p.aqi === maxAqi);

  return (
    <div className="glass-panel p-6 border-white/10 space-y-6">
      
      {/* Header & Stats summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-heading">
              24-Hour Air Quality Forecast & School Transit Windows
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly diurnal simulation showing nocturnal inversion peaks & student transit rush
          </p>
        </div>

        {/* Quick stat badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs">
            <span className="text-slate-400">24h Peak: </span>
            <strong className="text-red-400 font-mono">{maxAqi} AQI</strong> ({peakHourPoint?.time})
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs">
            <span className="text-slate-400">24h Avg: </span>
            <strong className="text-cyan-300 font-mono">{avgAqi} AQI</strong>
          </div>
        </div>
      </div>

      {/* Legend & Rush Hour Tags */}
      <div className="flex items-center gap-3 text-xs flex-wrap border-y border-white/10 py-3">
        <div className="flex items-center gap-1.5 text-amber-300">
          <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500" />
          <span>Morning Arrival Rush (07:00 AM – 09:00 AM)</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-300">
          <span className="w-2.5 h-2.5 rounded bg-blue-500/30 border border-blue-500" />
          <span>Afternoon Dispersal (01:00 PM – 03:00 PM)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 ml-auto">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Hover column for pollutant breakdown</span>
        </div>
      </div>

      {/* 24-Hour Visual Bar Chart */}
      <div className="relative pt-6 pb-2">
        <div className="grid grid-cols-12 md:grid-cols-24 gap-1 md:gap-1.5 items-end h-48 border-b border-slate-700/60 pb-1">
          {hourlyForecast.slice(0, 24).map((pt, idx) => {
            const heightPct = Math.max(12, Math.min(100, (pt.aqi / 500) * 100));
            const isMorning = pt.isMorningRush;
            const isAfternoon = pt.isAfternoonRush;

            // Bar color calculation
            let barBg = 'bg-slate-700';
            if (pt.aqi <= 100) barBg = 'bg-gradient-to-t from-emerald-600 to-emerald-400';
            else if (pt.aqi <= 200) barBg = 'bg-gradient-to-t from-amber-600 to-amber-400';
            else if (pt.aqi <= 300) barBg = 'bg-gradient-to-t from-orange-600 to-orange-400';
            else if (pt.aqi <= 400) barBg = 'bg-gradient-to-t from-red-600 to-red-400';
            else barBg = 'bg-gradient-to-t from-rose-800 to-red-600';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="group relative flex flex-col items-center justify-end h-full cursor-pointer"
              >
                {/* School Rush Highlight Indicator */}
                {isMorning && (
                  <div className="absolute -top-5 text-[9px] font-bold text-amber-300 bg-amber-950/80 px-1 py-0.5 rounded border border-amber-500/40 hidden md:block">
                    Bus
                  </div>
                )}
                {isAfternoon && (
                  <div className="absolute -top-5 text-[9px] font-bold text-blue-300 bg-blue-950/80 px-1 py-0.5 rounded border border-blue-500/40 hidden md:block">
                    Exit
                  </div>
                )}

                {/* Animated Vertical Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${barBg} ${
                    isMorning ? 'ring-2 ring-amber-400 shadow-md shadow-amber-500/20' : 
                    isAfternoon ? 'ring-2 ring-blue-400 shadow-md shadow-blue-500/20' : ''
                  } group-hover:opacity-100 group-hover:scale-105 opacity-85`}
                  style={{ height: `${heightPct}%` }}
                />

                {/* Hour label */}
                <span className="text-[9px] font-mono text-slate-400 mt-2 truncate w-full text-center">
                  {pt.time.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Hover Detail Card */}
      {hoveredPoint ? (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white font-heading text-sm">{hoveredPoint.time}</strong>
                {hoveredPoint.isMorningRush && (
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                    Morning Student Arrival
                  </span>
                )}
                {hoveredPoint.isAfternoonRush && (
                  <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
                    Afternoon School Departure
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Category: <span className="font-semibold text-white">{hoveredPoint.category?.label}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">AQI: </span>
              <strong className="text-base text-white">{hoveredPoint.aqi}</strong>
            </div>
            <div>
              <span className="text-slate-400">PM2.5: </span>
              <strong className="text-red-400">{hoveredPoint.pm2_5} µg/m³</strong>
            </div>
            <div>
              <span className="text-slate-400">PM10: </span>
              <strong className="text-amber-400">{hoveredPoint.pm10} µg/m³</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>💡 Tip: Winter inversion in Delhi typically concentrates particulate smog between 06:00 AM and 09:00 AM.</span>
          <span className="font-mono text-cyan-400">Open-Meteo Hourly Feed</span>
        </div>
      )}

    </div>
  );
}
