import React from 'react';
import { StepKey, UserProfile } from '../types';
import { 
  LogIn, 
  FileText, 
  BarChart3, 
  Mic, 
  TrendingUp, 
  Award,
  AlertOctagon,
  Sparkles,
  Bot,
  LayoutDashboard,
  Play,
  Settings2
} from 'lucide-react';

interface SidebarProps {
  currentStep: StepKey;
  onNavigate: (step: StepKey) => void;
  currentUser: UserProfile | null;
  onEndSession: () => void;
  isInterviewActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onNavigate,
  currentUser,
  onEndSession,
  isInterviewActive
}) => {
  const isHomeActive = currentStep === 'home' || currentStep === 'results' || currentStep === 'returning_focus';
  const isStatsActive = currentStep === 'statistics';
  const isInterviewRoomActive = currentStep === 'interview_stage' || currentStep === 'interview';

  return (
    <aside 
      id="main-sidebar"
      aria-label="Sidebar Navigation"
      className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#0B0F1A] border-r border-slate-800 p-4 z-40 select-none shrink-0 overflow-y-auto justify-between"
    >
      {/* Top Header / Branding */}
      <div>
        <div className="mb-5 px-1 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-blue-600 px-2.5 py-1 rounded text-xs font-bold tracking-tighter uppercase text-white shadow-sm">
              SmartCoach LT
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              {isInterviewActive ? (
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Live Drill
                </span>
              ) : (
                'Pro v2.4'
              )}
            </div>
          </div>
        </div>

        {/* Primary Views */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Candidate Hub
            </span>

            {/* 1. Home Dashboard */}
            <button
              id="nav-btn-home"
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-3 p-2.5 rounded text-left w-full transition-all duration-150 cursor-pointer ${
                isHomeActive
                  ? 'bg-blue-900/20 text-blue-400 ring-1 ring-blue-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs block truncate">Home Dashboard</span>
              </div>
            </button>

            {/* 2. Longitudinal Statistics & Trends */}
            <button
              id="nav-btn-statistics"
              onClick={() => onNavigate('statistics')}
              className={`flex items-center space-x-3 p-2.5 rounded text-left w-full transition-all duration-150 cursor-pointer ${
                isStatsActive
                  ? 'bg-blue-900/20 text-blue-400 ring-1 ring-blue-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs block truncate">Statistics & Trends</span>
              </div>
            </button>
          </div>

          {/* Dedicated Interview Session Mode */}
          <div className="space-y-1 pt-2 border-t border-slate-800/60">
            <span className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Interview Engine
            </span>

            {/* 3. Live Interview Room */}
            <button
              id="nav-btn-interview-stage"
              onClick={() => onNavigate('interview_stage')}
              className={`flex items-center space-x-3 p-2.5 rounded text-left w-full transition-all duration-150 cursor-pointer ${
                isInterviewRoomActive
                  ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 text-blue-300 ring-1 ring-blue-400 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-blue-950/30 hover:text-blue-200 border border-blue-900/30'
              }`}
            >
              <Mic className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs block truncate">Interview Room</span>
                <span className="text-[9px] font-mono text-blue-400/80 block">Live STAR Practice</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </button>

            {/* 4. Pre-Screen ATS Check */}
            <button
              id="nav-btn-ats"
              onClick={() => onNavigate('ats_check')}
              className={`flex items-center space-x-3 p-2.5 rounded text-left w-full transition-all duration-150 cursor-pointer ${
                currentStep === 'ats_check'
                  ? 'bg-blue-900/20 text-blue-400 ring-1 ring-blue-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-yellow-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs block truncate">ATS Match Scan</span>
              </div>
            </button>

            {/* 5. Target Company & Resume Setup */}
            <button
              id="nav-btn-prep"
              onClick={() => onNavigate('prep')}
              className={`flex items-center space-x-3 p-2.5 rounded text-left w-full transition-all duration-150 cursor-pointer ${
                currentStep === 'prep' || currentStep === 'job_description'
                  ? 'bg-blue-900/20 text-blue-400 ring-1 ring-blue-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs block truncate">Target & Resume Setup</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Coach Persona Quote Card & End Session Button */}
      <div className="mt-auto pt-4 space-y-3">
        <div className="p-3 bg-red-900/10 border border-red-900/30 rounded">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase text-red-400 font-bold tracking-wider flex items-center gap-1">
              <Bot className="w-3 h-3 text-red-400" />
              Coach: Demanding
            </p>
            <span className="text-[9px] font-mono text-red-400/80">STAR ONLY</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 italic">
            "Do not expect comfort. Expect accuracy. Your competitors are working harder than you are right now."
          </p>
        </div>

        {/* End Session Button */}
        <button
          id="end-session-btn"
          onClick={onEndSession}
          className="w-full py-2 bg-slate-900 hover:bg-red-900/20 text-slate-400 hover:text-red-400 font-medium text-xs rounded transition-colors duration-150 border border-slate-800 hover:border-red-900/40 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-mono"
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
};

