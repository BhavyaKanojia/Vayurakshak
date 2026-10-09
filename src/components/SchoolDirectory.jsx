import React from 'react';
import { School, MapPin, Users, Bus, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { DELHI_NCR_SCHOOLS } from '../services/schoolsData';

export default function SchoolDirectory({ selectedSchool, onSelectSchool, currentAqi }) {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Delhi-NCR Monitored Schools & CAAQMS Air Stations
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time environmental compliance network covering key high-risk zones across Delhi, Noida, and Gurugram
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DELHI_NCR_SCHOOLS.map((school) => {
          const isSelected = school.id === selectedSchool.id;

          return (
            <div
              key={school.id}
              onClick={() => onSelectSchool(school)}
              className={`glass-panel p-5 border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-500/40 bg-slate-800/80 shadow-lg shadow-cyan-500/15 -translate-y-1'
                  : 'border-white/10 hover:border-white/20 hover:bg-slate-900/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-white/10">
                    {school.zone}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white font-heading mb-1.5 leading-snug">
                  {school.name}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-start gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{school.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Station: <strong className="text-slate-200">{school.stationName}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{school.studentStrength.toLocaleString()} Students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5 text-slate-400" />
                    <span>{school.transportBuses} Bus Fleet</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Principal: {school.principal}</span>
                <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Monitor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
