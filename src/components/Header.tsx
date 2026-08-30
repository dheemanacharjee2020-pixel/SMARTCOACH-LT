import React from 'react';
import { StepKey, UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { useSettings } from '../context/SettingsContext';
import { Mic, Menu, X, Bot, Sparkles, User, AlertOctagon, Settings } from 'lucide-react';

interface HeaderProps {
  currentStep: StepKey;
  onNavigate: (step: StepKey) => void;
  currentUser: UserProfile | null;
  onEndSession: () => void;
  isInterviewActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onNavigate,
  currentUser,
  onEndSession,
  isInterviewActive
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { openSettings } = useSettings();

  const steps = [
    { key: 'home' as StepKey, label: 'Home Dashboard' },
    { key: 'statistics' as StepKey, label: 'Statistics & Trends' },
    { key: 'interview_stage' as StepKey, label: 'Live Interview Room' },
    { key: 'ats_check' as StepKey, label: 'ATS Match Scan' },
    { key: 'prep' as StepKey, label: 'Target & Resume Setup' },
  ];

  return (
    <header className="md:hidden w-full top-0 sticky bg-[#111827] border-b border-slate-800 z-40">
      <div className="flex justify-between items-center px-4 py-3 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="bg-blue-600 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-tighter uppercase text-white">
            SmartCoach LT
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="compact" />

          <button
            onClick={openSettings}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700 cursor-pointer"
            aria-label="Open Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {isInterviewActive ? (
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">Live</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">Ready</span>
            </div>
          )}
          
          <button
            onClick={onEndSession}
            className="text-[11px] px-2.5 py-1 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded border border-red-900/40 uppercase font-bold tracking-wider cursor-pointer"
          >
            End
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="bg-[#111827] border-b border-slate-800 p-3 flex flex-col gap-1 shadow-xl">
          {steps.map(s => (
            <button
              key={s.key}
              onClick={() => {
                onNavigate(s.key);
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 text-left text-xs font-medium rounded flex items-center justify-between transition-colors ${
                currentStep === s.key ? 'bg-blue-900/30 text-blue-400 ring-1 ring-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{s.label}</span>
              {currentStep === s.key && <span className="text-[10px] font-mono uppercase text-blue-400">Active</span>}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 mt-1">
            <button
              onClick={() => {
                openSettings();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 text-left text-xs font-medium rounded flex items-center gap-2 text-slate-300 hover:bg-slate-800 cursor-pointer font-mono"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              <span>App Settings</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

