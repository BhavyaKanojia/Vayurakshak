import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  FileText, 
  Bus, 
  Activity, 
  Flame, 
  Wind, 
  Award, 
  CheckSquare, 
  Square,
  Sparkles
} from 'lucide-react';
import { getGRAPStage } from '../services/grapRules';

export default function GRAPActionCenter({ aqi, school, onOpenBroadcast, onOpenBedrock }) {
  const grapData = getGRAPStage(aqi);
  const [completedTasks, setCompletedTasks] = useState({});
  const [filterCategory, setFilterCategory] = useState('All');

  // Toggle checklist item
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
    <div className="glass-panel p-6 border-white/10 space-y-6 relative overflow-hidden">
      
      {/* Top GRAP Status Banner */}
      <div 
        className={`p-5 rounded-2xl border transition-all ${
          grapData.stage >= 3 
            ? 'bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-900/90 border-red-500/40 shadow-lg shadow-red-900/20'
            : grapData.stage >= 1
            ? 'bg-gradient-to-r from-amber-950/70 via-orange-950/40 to-slate-900/90 border-orange-500/40'
            : 'bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-900/90 border-emerald-500/40'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Stage info */}
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${
              grapData.stage >= 3 ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30' :
              grapData.stage >= 1 ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30' :
              'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
            }`}>
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 border border-white/15 text-slate-200">
                  {grapData.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {grapData.threshold}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black font-heading text-white mt-1">
                {grapData.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Statutory Order: <span className="font-semibold text-cyan-300">{grapData.statutoryOrder}</span>
              </p>
            </div>
          </div>

          {/* Right: School Operational Mode Callout */}
          <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl md:min-w-64 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Prescribed Operational Mode
            </div>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {grapData.schoolMode}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Campus: <span className="text-slate-200 font-medium">{school.shortName}</span>
            </div>
          </div>

        </div>

        {/* Detailed overview */}
        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
          <strong>CAQM Legal Directives: </strong> {grapData.overview}
        </div>
      </div>

      {/* Checklist Header & Progress Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                School Principal Statutory Compliance Checklist
              </h3>
              <p className="text-xs text-slate-400">
                Mandatory legal action items required by Directorate of Education & CAQM
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBedrock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>AI Action Copilot</span>
            </button>
            <button
              onClick={markAllComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark All Done</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Compliance Progress:</span>
              <span className="font-bold text-white">{completedCount} of {totalCount} Directives Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`font-bold ${isAllCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {progressPercent}%
              </span>
              {isAllCompleted && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                  <Award className="w-3 h-3" /> 100% COMPLIANT
                </span>
              )}
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
              filterCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTasks.map((task) => {
          const isDone = !!completedTasks[task.id];
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/70 border-white/10 hover:border-white/20 hover:bg-slate-900/90 text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                    {task.category}
                  </span>
                  {task.mandatory && (
                    <span className="text-[9px] uppercase font-mono font-semibold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/20">
                      Mandatory
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-100 font-medium'}`}>
                  {task.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transport & Mask Directives Sub-Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
          <Bus className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-200">Transport & Bus Fleet Rule: </span>
            <span className="text-slate-400">{grapData.transportRule}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
          <Wind className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-200">Respiratory Protection Guideline: </span>
            <span className="text-slate-400">{grapData.maskRecommendation}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
