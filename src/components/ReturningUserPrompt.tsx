import React, { useState } from 'react';
import { UserProfile, CompanyProfile } from '../types';
import { RETURNING_USER_FOCUS_AREAS } from '../data/sampleData';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Building2, 
  BarChart, 
  Zap,
  Server,
  Users,
  AlertTriangle,
  Award
} from 'lucide-react';

interface ReturningUserPromptProps {
  user: UserProfile;
  onSelectFocus: (focusId: string, focusTitle: string) => void;
  onResetToFullOnboarding: () => void;
  onViewSavedDashboard: () => void;
}

export const ReturningUserPrompt: React.FC<ReturningUserPromptProps> = ({
  user,
  onSelectFocus,
  onResetToFullOnboarding,
  onViewSavedDashboard
}) => {
  const [selectedFocus, setSelectedFocus] = useState<string>(RETURNING_USER_FOCUS_AREAS[0].id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'server': return <Server className="w-4 h-4 text-blue-400" />;
      case 'users': return <Users className="w-4 h-4 text-green-400" />;
      case 'alert-triangle': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'award': return <Award className="w-4 h-4 text-blue-400" />;
      default: return <Zap className="w-4 h-4 text-blue-400" />;
    }
  };

  const currentFocusObj = RETURNING_USER_FOCUS_AREAS.find(f => f.id === selectedFocus) || RETURNING_USER_FOCUS_AREAS[0];

  return (
    <div id="returning-user-screen" className="max-w-4xl mx-auto py-4 px-2 flex flex-col items-center">
      {/* Header */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-green-900/20 border border-green-900/40 text-green-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Returning Candidate Recognized</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-1.5">
          Welcome Back, {user.name}
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed">
          Your candidate profile, resume, and target company profile have been securely restored.
        </p>
      </div>

      {/* Cached Profile Summary Card */}
      <div className="w-full max-w-3xl bg-[#161B29] border border-slate-800 rounded p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-100">
              Target: {user.savedCompanyName || 'Stripe'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              • {user.savedRoleTitle || 'Senior Full-Stack Engineer'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate max-w-xs">{user.savedResumeFileName || 'Alex_Chen_Staff_Engineer_Resume.pdf'}</span>
            {user.savedAtsScore && (
              <span className="font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/40 text-[10px] font-bold">
                ATS Match: {user.savedAtsScore}%
              </span>
            )}
          </div>
        </div>

        <button
          id="btn-update-onboarding"
          onClick={onResetToFullOnboarding}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer font-mono uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Update Setup</span>
        </button>
      </div>

      {/* Critical Single Question Section */}
      <div className="w-full max-w-3xl bg-[#161B29] border border-slate-800 rounded p-5 mb-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 mb-1.5 uppercase font-bold tracking-wider">
          <Bot className="w-3.5 h-3.5 text-blue-400" />
          <span>Coach Calibration Prompt</span>
        </div>
        <h2 className="text-base font-bold text-slate-100 mb-1">
          What is your primary interview-prep focus for today's session?
        </h2>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          SmartCoach will immediately generate targeted, high-stakes questions calibrated to your chosen dimension, bypassing repetitive setup steps.
        </p>

        {/* 4 Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {RETURNING_USER_FOCUS_AREAS.map((area) => {
            const isSelected = selectedFocus === area.id;
            return (
              <div
                key={area.id}
                id={`focus-card-${area.id}`}
                onClick={() => setSelectedFocus(area.id)}
                className={`p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500/30'
                    : 'bg-[#0B0F1A] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0">
                  {getIcon(area.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">{area.title}</h4>
                    <span className="text-[9px] font-mono text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase font-bold">
                      {area.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button: Fast Launch */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            id="btn-view-prior-dashboard"
            onClick={onViewSavedDashboard}
            className="w-full sm:w-auto text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer font-mono uppercase tracking-wider"
          >
            <BarChart className="w-3.5 h-3.5 text-yellow-400" />
            <span>Review Prior Session Analytics</span>
          </button>

          <button
            id="btn-launch-focused-drill"
            onClick={() => onSelectFocus(currentFocusObj.id, currentFocusObj.title)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
          >
            <span>Launch {currentFocusObj.badge} Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

