import React from 'react';
import { Shield, Sparkles, Server, Send, RefreshCw, AlertTriangle, School as SchoolIcon, Layers } from 'lucide-react';
import { DELHI_NCR_SCHOOLS } from '../services/schoolsData';

export default function Header({
  selectedSchool,
  onSelectSchool,
  isSimulated,
  scenarioName,
  onRefresh,
  loading,
  activeTab,
  setActiveTab,
  onOpenBroadcast,
  onOpenBedrock,
  grapStage
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#070a13]/85 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Shield className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#070a13] pulse-indicator" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-heading bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  VayuRakshak
                </h1>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v1.0 AWS
                </span>
              </div>
              <p className="text-xs text-slate-400">Delhi-NCR Automated School GRAP Compliance Platform</p>
            </div>
          </div>

          {/* Quick mobile trigger */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="md:hidden p-2 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white"
            title="Refresh AQI"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Center: School Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SchoolIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <select
              value={selectedSchool.id}
              onChange={(e) => {
                const found = DELHI_NCR_SCHOOLS.find(s => s.id === e.target.value);
                if (found) onSelectSchool(found);
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-white/15 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all cursor-pointer shadow-inner appearance-none"
            >
              {DELHI_NCR_SCHOOLS.map((school) => (
                <option key={school.id} value={school.id} className="bg-slate-900 text-slate-200">
                  {school.shortName} ({school.zone})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-medium transition-all"
            title="Fetch latest Open-Meteo & CPCB live feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {/* Right Navigation & Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-mono">
            {isSimulated ? (
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>SIM: {scenarioName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-indicator" />
                <span>LIVE FEED</span>
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'directory'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Schools Map
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>AWS Cloud</span>
            </button>
          </div>

          {/* Quick Broadcast Button */}
          <button
            onClick={onOpenBroadcast}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 ring-1 ring-white/20 transition-all transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parent Broadcast</span>
            <span className="sm:hidden">Notice</span>
          </button>
        </div>

      </div>
    </header>
  );
}
