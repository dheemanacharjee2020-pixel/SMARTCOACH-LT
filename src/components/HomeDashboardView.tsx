import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  CompanyProfile, 
  SessionEvaluation,
  CandidateTrack
} from '../types';
import { safeFetchJson } from '../utils/api';
import { CANDIDATE_TRACKS } from '../utils/tracks';
import { HistoryTrendsView } from './HistoryTrendsView';
import { 
  Play, 
  TrendingUp, 
  Award, 
  Building2, 
  BarChart3, 
  Target, 
  ArrowRight,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Code2,
  CheckCircle2,
  Volume2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface HomeDashboardViewProps {
  currentUser: UserProfile | null;
  targetCompany: CompanyProfile | null;
  roleTitle: string;
  candidateTrack?: CandidateTrack;
  onSelectCandidateTrack?: (track: CandidateTrack) => void;
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
  candidateTrack = 'undergraduate',
  onSelectCandidateTrack,
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

  // Fetch all historical sessions for the current user
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const query = currentUser?.id ? `?userId=${encodeURIComponent(currentUser.id)}` : '';
        const { success, data } = await safeFetchJson<{ success: boolean; sessions?: SessionEvaluation[] }>(
          `/api/interview/history${query}`
        );
        if (success && Array.isArray(data?.sessions) && data.sessions.length > 0) {
          setSessionsHistory(data.sessions);
        } else if (latestEvaluation) {
          setSessionsHistory([latestEvaluation]);
        } else {
          setSessionsHistory([]);
        }
      } catch (err) {
        console.warn('Failed to load session history:', err);
        if (latestEvaluation) {
          setSessionsHistory([latestEvaluation]);
        } else {
          setSessionsHistory([]);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [currentUser, latestEvaluation]);

  const hasCompletedInterview = sessionsHistory.length > 0 || latestEvaluation !== null;
  const latestSession = hasCompletedInterview
    ? (latestEvaluation || sessionsHistory[sessionsHistory.length - 1])
    : null;
  const totalSessionsCount = sessionsHistory.length;

  const averageStarScore = hasCompletedInterview && totalSessionsCount > 0
    ? Math.round(
        sessionsHistory.reduce(
          (acc, s) => acc + (s.starCompletenessScore ?? 
            (s.starCoverageMetrics 
              ? Math.round(((s.starCoverageMetrics.situationScore || 0) + (s.starCoverageMetrics.taskScore || 0) + (s.starCoverageMetrics.actionScore || 0) + (s.starCoverageMetrics.resultScore || 0)) / 4)
              : 0)), 
          0
        ) / totalSessionsCount
      )
    : (latestSession?.starCompletenessScore ?? null);

  const latestOfferProb = latestSession
    ? (latestSession.successLikelihood?.percentage ?? latestSession.successProbabilityPct ?? null)
    : null;
    
  const averageWpm = hasCompletedInterview && totalSessionsCount > 0
    ? Math.round(
        sessionsHistory.reduce(
          (acc, s) => acc + (s.speechTrends?.averageWpm || 
            (s.answers && s.answers.length > 0 
              ? Math.round(s.answers.reduce((aAcc, a) => aAcc + (a.speechMetrics?.wpm || 0), 0) / s.answers.length) 
              : 0)), 
          0
        ) / totalSessionsCount
      )
    : (latestSession?.speechTrends?.averageWpm ?? null);

  const getTrackIcon = (id: CandidateTrack) => {
    switch (id) {
      case 'undergraduate':
        return GraduationCap;
      case 'postgraduate_mba':
        return Briefcase;
      case 'research_phd':
        return FlaskConical;
      case 'experienced_pro':
      default:
        return Code2;
    }
  };

  const activeTrackMeta = CANDIDATE_TRACKS.find(t => t.id === candidateTrack) || CANDIDATE_TRACKS[0];

  return (
    <div id="home-dashboard-container" className="max-w-5xl mx-auto py-6 px-4 space-y-6 font-sans">
      
      {/* 1. Clean Candidate & Role Header */}
      <div className="bg-[#161B29] border border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide">
                {currentUser?.name || 'Candidate Dashboard'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                Target: <strong className="text-slate-200">{targetCompany?.name || 'Stripe'}</strong> ({roleTitle || 'Software Engineer'})
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Interview Readiness Center
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-launch-interview-room"
              onClick={onStartInterview}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer shadow transition-all active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{hasCompletedInterview ? 'Launch Interview Drill' : 'Start Practice Drill'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-quick-ats"
              onClick={onOpenAtsCheck}
              className="px-3.5 py-2.5 bg-[#0B0F1A] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Pre-scan resume against current job description"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>ATS Scan</span>
            </button>
          </div>
        </div>

        {/* Candidate Track Quick Switcher */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Track:</span>
            {CANDIDATE_TRACKS.map((t) => {
              const Icon = getTrackIcon(t.id);
              const isSelected = candidateTrack === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectCandidateTrack && onSelectCandidateTrack(t.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-[#0B0F1A] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                  title={t.description}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t.label.split('/')[0].trim()}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                activeTab === 'statistics'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Trends & Stats ({totalSessionsCount})
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Key Metrics 4-Box Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Offer Likelihood */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                <span>Offer Likelihood</span>
                <Award className={`w-3.5 h-3.5 ${hasCompletedInterview ? 'text-green-400' : 'text-slate-600'}`} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold font-mono ${hasCompletedInterview && latestOfferProb !== null ? 'text-green-400' : 'text-slate-600'}`}>
                  {hasCompletedInterview && latestOfferProb !== null ? `${latestOfferProb}%` : '—'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {hasCompletedInterview ? 'calibrated' : 'pending drill'}
                </span>
              </div>
            </div>

            {/* STAR Completeness */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                <span>STAR Score</span>
                <Target className={`w-3.5 h-3.5 ${hasCompletedInterview ? 'text-blue-400' : 'text-slate-600'}`} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold font-mono ${hasCompletedInterview && averageStarScore !== null ? 'text-blue-400' : 'text-slate-600'}`}>
                  {hasCompletedInterview && averageStarScore !== null ? `${averageStarScore}%` : '—'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {hasCompletedInterview ? 'average' : 'pending drill'}
                </span>
              </div>
            </div>

            {/* Speech Pace */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                <span>Speech Pace</span>
                <Volume2 className={`w-3.5 h-3.5 ${hasCompletedInterview ? 'text-amber-400' : 'text-slate-600'}`} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold font-mono ${hasCompletedInterview && averageWpm !== null ? 'text-amber-400' : 'text-slate-600'}`}>
                  {hasCompletedInterview && averageWpm !== null ? `${averageWpm}` : '—'}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {hasCompletedInterview ? 'WPM' : 'pending drill'}
                </span>
              </div>
            </div>

            {/* Drills Completed */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-3.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                <span>Drills Logged</span>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasCompletedInterview ? 'text-purple-400' : 'text-slate-600'}`} />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-bold font-mono ${hasCompletedInterview ? 'text-purple-400' : 'text-slate-500'}`}>
                  {totalSessionsCount}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  sessions
                </span>
              </div>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Left: Target Focus & Calibration Dossier */}
            <div className="bg-[#161B29] border border-slate-800 rounded-lg p-4 space-y-3.5 md:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Target Dossier</span>
                </h2>
                <button
                  onClick={onOpenPrep}
                  className="text-[10px] font-mono text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Change Role
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Company & Role</span>
                  <p className="font-bold text-slate-200">{targetCompany?.name || 'Stripe'} • {roleTitle || 'Software Engineer'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Career Stage Track</span>
                  <p className="text-slate-300 text-[11px] font-medium">{activeTrackMeta.label}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Evaluation Focus</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {activeTrackMeta.targetFocus}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={onStartInterview}
                    className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch {activeTrackMeta.badge} Drill</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Coach Focus Advice (if completed session) OR STAR Method Standards (clean initial state) */}
            <div className="bg-[#161B29] border border-slate-800 rounded-lg p-4 space-y-3.5 md:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{hasCompletedInterview ? 'AI Coach Action Items' : 'STAR Method Evaluation Criteria'}</span>
                </h2>
                <span className="text-[10px] font-mono text-slate-500">
                  {hasCompletedInterview ? 'Personalized Focus' : 'Rubric Standards'}
                </span>
              </div>

              {hasCompletedInterview && latestSession?.topImprovementAreas && latestSession.topImprovementAreas.length > 0 ? (
                <div className="space-y-2.5">
                  {latestSession.topImprovementAreas.map((area, idx) => {
                    const isString = typeof area === 'string';
                    const title = isString ? area : area.title;
                    const advice = !isString && area.actionableAdvice ? area.actionableAdvice : null;
                    const starStage = !isString && area.starStage ? area.starStage : null;

                    return (
                      <div key={idx} className="bg-[#0B0F1A] border border-slate-800/80 p-3 rounded space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{title}</p>
                          {starStage && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900/30 text-blue-400 border border-blue-800/40 uppercase">
                              {starStage}
                            </span>
                          )}
                        </div>
                        {advice && (
                          <p className="text-[11px] text-slate-400 leading-relaxed">{advice}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#0B0F1A] border border-slate-800/80 p-3 rounded space-y-1">
                    <span className="text-xs font-bold text-blue-400 font-mono">S — Situation</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Set the project context, scale, academic constraints, or team setup before technical details.
                    </p>
                  </div>

                  <div className="bg-[#0B0F1A] border border-slate-800/80 p-3 rounded space-y-1">
                    <span className="text-xs font-bold text-purple-400 font-mono">T — Task</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      State your exact individual responsibility and technical deliverables clearly.
                    </p>
                  </div>

                  <div className="bg-[#0B0F1A] border border-slate-800/80 p-3 rounded space-y-1">
                    <span className="text-xs font-bold text-amber-400 font-mono">A — Action</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Walk through engineering decisions, algorithms used, and debugging steps taken.
                    </p>
                  </div>

                  <div className="bg-[#0B0F1A] border border-slate-800/80 p-3 rounded space-y-1">
                    <span className="text-xs font-bold text-green-400 font-mono">R — Result</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Quantify outcomes (e.g. latency drop, test coverage %, demo grade, features shipped).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Drill History or Simple Callout */}
          {hasCompletedInterview && sessionsHistory.length > 0 ? (
            <div className="bg-[#161B29] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">Recent Drill History</h3>
                <button
                  onClick={() => setActiveTab('statistics')}
                  className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Trends</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {sessionsHistory.slice(-3).reverse().map((session, sIdx) => (
                  <div
                    key={session.id || sIdx}
                    onClick={() => onInspectSession(session)}
                    className="p-3 bg-[#0B0F1A] hover:bg-slate-800/60 border border-slate-800/80 hover:border-blue-500/50 rounded flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-200">
                        {session.roleTitle} @ {session.companyName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {session.date || 'Recent session'} • {session.answers?.length || 3} Questions
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-blue-400">
                          {session.overallScore || session.starCompletenessScore || 80}% STAR
                        </span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {session.successLikelihood?.percentage || session.successProbabilityPct || 70}% Offer Prob
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#161B29]/60 border border-slate-800/80 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <p className="text-xs text-slate-400">
                  Ready to practice? Launch your first live practice drill to generate speech acoustics and STAR completeness scores.
                </p>
              </div>
              <button
                onClick={onStartInterview}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-mono font-bold uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
              >
                Start Drill
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. TAB CONTENT: STATISTICS */}
      {activeTab === 'statistics' && (
        <div className="animate-in fade-in duration-150">
          {hasCompletedInterview && sessionsHistory.length > 0 ? (
            <HistoryTrendsView
              sessions={sessionsHistory}
              onSelectSessionForDeepDive={onInspectSession}
              currentSessionId={latestSession?.id}
            />
          ) : (
            <div className="bg-[#161B29] border border-slate-800 rounded-lg p-8 text-center space-y-3">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-100">No Interview Sessions Recorded Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Performance trends, STAR progression trajectories, and cadence metrics will appear here after you record your first drill.
              </p>
              <button
                onClick={onStartInterview}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-2"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start First Drill</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
