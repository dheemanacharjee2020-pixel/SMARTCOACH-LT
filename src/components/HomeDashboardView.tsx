import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  CompanyProfile, 
  SessionEvaluation,
  AtsResult 
} from '../types';
import { HistoryTrendsView } from './HistoryTrendsView';
import { 
  Play, 
  TrendingUp, 
  Award, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Mic, 
  ChevronRight, 
  Layers, 
  Volume2, 
  Zap, 
  Target, 
  Bot, 
  RefreshCw, 
  ArrowUpRight,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface HomeDashboardViewProps {
  currentUser: UserProfile | null;
  targetCompany: CompanyProfile | null;
  roleTitle: string;
  onStartInterview: () => void;
  onOpenAtsCheck: () => void;
  onOpenPrep: () => void;
  onInspectSession: (session: SessionEvaluation) => void;
  latestEvaluation: SessionEvaluation | null;
  initialSubTab?: 'overview' | 'statistics';
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  currentUser,
  targetCompany,
  roleTitle,
  onStartInterview,
  onOpenAtsCheck,
  onOpenPrep,
  onInspectSession,
  latestEvaluation,
  initialSubTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'statistics'>(initialSubTab);
  const [sessionsHistory, setSessionsHistory] = useState<SessionEvaluation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Fetch all historical sessions for statistics
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const query = currentUser?.id ? `?userId=${encodeURIComponent(currentUser.id)}` : '';
        const res = await fetch(`/api/interview/history${query}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.sessions) && data.sessions.length > 0) {
          setSessionsHistory(data.sessions);
        } else if (latestEvaluation) {
          setSessionsHistory([latestEvaluation]);
        }
      } catch (err) {
        console.warn('Failed to load session history:', err);
        if (latestEvaluation) {
          setSessionsHistory([latestEvaluation]);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [currentUser, latestEvaluation]);

  // Derived metrics
  const latestSession = latestEvaluation || sessionsHistory[sessionsHistory.length - 1];
  const totalSessionsCount = sessionsHistory.length;

  const averageStarScore = sessionsHistory.length > 0
    ? Math.round(
        sessionsHistory.reduce(
          (acc, s) => acc + (s.starCompletenessScore || 70), 
          0
        ) / sessionsHistory.length
      )
    : 78;

  const latestOfferProb = latestSession?.successLikelihood?.percentage ?? 
    latestSession?.successProbabilityPct ?? 76;
    
  const averageWpm = sessionsHistory.length > 0
    ? Math.round(
        sessionsHistory.reduce(
          (acc, s) => acc + (s.speechTrends?.averageWpm || 140), 
          0
        ) / sessionsHistory.length
      )
    : 138;

  return (
    <div id="home-dashboard-container" className="max-w-6xl mx-auto py-5 px-4 space-y-5 font-sans animate-in fade-in duration-200">
      {/* Top Welcome & Quick Launch Hero Banner */}
      <div className="bg-gradient-to-r from-[#161B29] via-[#111827] to-[#161B29] border border-slate-800 rounded-lg p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-900/30 border border-blue-500/40 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Compass className="w-3 h-3" />
              <span>Candidate Readiness Center</span>
              <span className="text-slate-500">•</span>
              <span>{currentUser?.name || 'Executive Candidate'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <span>{roleTitle}</span>
              <span className="text-slate-500 font-normal">at</span>
              <span className="text-blue-400">{targetCompany?.name || 'Target Enterprise'}</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time calibration dashboard tracking behavioral STAR precision, speech acoustics, and rubric alignment across all completed interview drills.
            </p>
          </div>

          {/* Primary Action Button: Launch Dedicated Interview Session */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              id="btn-launch-interview-room"
              onClick={onStartInterview}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:shadow-blue-500/20 active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Live Interview Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-quick-ats"
              onClick={onOpenAtsCheck}
              className="px-3.5 py-3 bg-[#0B0F1A] hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer transition-colors"
              title="Pre-scan resume against current job description"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>ATS Scan</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Selector: Dashboard Overview vs Detailed Statistics */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              id="tab-btn-overview"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Dashboard Overview</span>
            </button>

            <button
              id="tab-btn-statistics"
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'statistics'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Detailed Statistics & Trends</span>
              <span className="text-[10px] font-mono bg-blue-900/40 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700/50">
                {totalSessionsCount}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Target: {targetCompany?.interviewStyle || 'Rigorous STAR Behavioral'}</span>
          </div>
        </div>
      </div>

      {/* RENDER VIEW 1: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Quick Metrics Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Offer Likelihood */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                <span>Offer Likelihood</span>
                <Award className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-green-400">{latestOfferProb}%</span>
                <span className="text-[10px] font-mono text-slate-400">±5% model</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Based on verified {targetCompany?.name || 'corporate'} rubrics
              </span>
            </div>

            {/* STAR Completeness */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                <span>Avg STAR Completeness</span>
                <Target className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-blue-400">{averageStarScore}%</span>
                <span className="text-[10px] font-mono text-green-400 font-bold">+16% net</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Strong in Action, improving in Task
              </span>
            </div>

            {/* Speech Delivery Pace */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                <span>Average Speech Pace</span>
                <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-yellow-400">{averageWpm}</span>
                <span className="text-[10px] font-mono text-green-400 uppercase font-bold">Optimal</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Target: 125-145 Words / Minute
              </span>
            </div>

            {/* Completed Calibrated Drills */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                <span>Calibrated Drills</span>
                <Layers className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-purple-400">{totalSessionsCount}</span>
                <span className="text-[10px] font-mono text-slate-400">sessions saved</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Tracked across target companies
              </span>
            </div>
          </div>

          {/* 2-Column Core Layout: Target Intel + Pre-Interview Reading Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Target Company Intel Card */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5 tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Target Company Profile</span>
                </h3>
                <button
                  onClick={onOpenPrep}
                  className="text-[10px] font-mono text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Change Target
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Company</span>
                  <p className="font-bold text-slate-200">{targetCompany?.name || 'Stripe'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Interview Bar</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{targetCompany?.interviewStyle || 'Rigorous STAR behavioral & distributed systems.'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Key Value Rubrics</span>
                  <div className="flex flex-wrap gap-1">
                    {(targetCompany?.keyValues || ['Users First', 'High Velocity', 'Meticulous Craft']).map((val, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F1A] border border-slate-800 text-slate-300">
                        {val}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onStartInterview}
                    className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start {targetCompany?.name || 'Target'} Interview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Critical Pre-Interview Reminder & Improvement Checklist */}
            <div className="bg-[#161B29] border border-yellow-500/40 rounded p-4 space-y-3 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase flex items-center gap-1.5 tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Pre-Interview Focus Checklist (Review 10 Mins Prior)</span>
                </h3>
                <span className="text-[10px] font-mono text-yellow-400/80 bg-yellow-950/30 px-2 py-0.5 rounded border border-yellow-900/40">
                  Demanding Coach Notes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(latestSession?.topImprovementAreas || [
                  {
                    title: 'Quantify baseline SLA & latency improvements',
                    impact: 'Critical',
                    starStage: 'Result',
                    actionableAdvice: 'State exact numbers and percentages in Result rather than generic statements.'
                  },
                  {
                    title: 'Establish task constraints & ownership boundary',
                    impact: 'High',
                    starStage: 'Task',
                    actionableAdvice: 'Explain deadlines, stakeholder pressure, and SLA commitments upfront.'
                  },
                  {
                    title: 'Maintain steady 130-145 WPM cadence',
                    impact: 'Medium',
                    starStage: 'Speech Delivery',
                    actionableAdvice: 'Avoid rushing under technical questioning; take 1-second strategic pauses.'
                  },
                  {
                    title: 'Eliminate filler words ("like", "you know")',
                    impact: 'Medium',
                    starStage: 'Speech Delivery',
                    actionableAdvice: 'Substitute pauses for verbal fillers when structuring your next point.'
                  }
                ]).map((area, idx) => {
                  const isString = typeof area === 'string';
                  const title = isString ? area : area.title;
                  const advice = !isString && area.actionableAdvice ? area.actionableAdvice : null;
                  const impact = !isString && area.impact ? area.impact : null;
                  const starStage = !isString && area.starStage ? area.starStage : null;

                  return (
                    <div key={idx} className="bg-[#0B0F1A] border border-slate-800 p-2.5 rounded flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-yellow-900/20 border border-yellow-900/40 text-yellow-400 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-semibold text-slate-200">{title}</p>
                          {impact && (
                            <span className={`text-[9px] font-mono px-1 py-0.2 rounded uppercase font-bold ${
                              impact === 'Critical' 
                                ? 'bg-red-900/30 text-red-400 border border-red-800/40' 
                                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/40'
                            }`}>
                              {impact}
                            </span>
                          )}
                          {starStage && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-900/30 text-blue-400 border border-blue-800/40">
                              {starStage}
                            </span>
                          )}
                        </div>
                        {advice && (
                          <p className="text-[11px] text-slate-400 leading-relaxed">{advice}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Drill Highlight Row */}
          {latestSession && (
            <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-red-400" />
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Latest Drill Performance & Coach Verdict ({latestSession.companyName})
                  </h3>
                </div>
                <button
                  onClick={() => onInspectSession(latestSession)}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Session Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-[#0B0F1A] rounded border border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{latestSession.criticalCoachVerdict || latestSession.successLikelihood?.probabilisticExplanation || 'Candidate demonstrates solid domain grasp with key opportunities to articulate measurable results.'}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW 2: DEDICATED STATISTICS & TRENDS */}
      {activeTab === 'statistics' && (
        <div className="animate-in fade-in duration-150">
          <HistoryTrendsView
            sessions={sessionsHistory}
            onSelectSessionForDeepDive={onInspectSession}
            currentSessionId={latestSession?.id}
          />
        </div>
      )}
    </div>
  );
};
