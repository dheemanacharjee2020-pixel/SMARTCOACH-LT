import React, { useState, useEffect } from 'react';
import { SessionEvaluation, AnswerCritique, StarStatus } from '../types';
import { HistoryTrendsView } from './HistoryTrendsView';
import { 
  Bot, 
  Sparkles, 
  BarChart3, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Download, 
  RefreshCw, 
  LogOut, 
  TrendingUp, 
  Clock, 
  Volume2, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp,
  FileText,
  History as HistoryIcon,
  ArrowLeft
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

interface DashboardStepProps {
  evaluation: SessionEvaluation;
  onRestart: () => void;
  onSignOut: () => void;
  userId?: string;
  initialTab?: 'current' | 'history';
}

export const DashboardStep: React.FC<DashboardStepProps> = ({
  evaluation,
  onRestart,
  onSignOut,
  userId,
  initialTab = 'current'
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>(initialTab);
  const [inspectedSession, setInspectedSession] = useState<SessionEvaluation | null>(null);
  const [historyList, setHistoryList] = useState<SessionEvaluation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  // Active displayed evaluation (current drill or inspected historical session)
  const currentEval = inspectedSession || evaluation;

  // Fetch longitudinal sessions history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
        const res = await fetch(`/api/interview/history${query}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.sessions) && data.sessions.length > 0) {
          // Merge current session if not already in server list
          const exists = data.sessions.some((s: SessionEvaluation) => s.id === evaluation.id);
          if (!exists && evaluation.id) {
            setHistoryList([...data.sessions, evaluation]);
          } else {
            setHistoryList(data.sessions);
          }
        } else {
          setHistoryList([evaluation]);
        }
      } catch (err) {
        console.warn('Failed to load history from backend, fallback to active session:', err);
        setHistoryList([evaluation]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [userId, evaluation]);

  const displayRole = currentEval.roleTitle || currentEval.targetRole || 'Target Role';
  const probability = currentEval.successLikelihood?.percentage ?? currentEval.successProbabilityPct ?? 72;
  const uncertainty = currentEval.successLikelihood?.uncertaintyRange ?? currentEval.uncertaintyMarginPct ?? 5;
  const coachVerdict = currentEval.successLikelihood?.probabilisticExplanation || 
    currentEval.criticalCoachVerdict || 
    'Candidate demonstrates domain competence with key opportunities to solidify STAR quantitative precision.';

  // Prepare chart data from answers
  const chartData = (currentEval.answers || []).map((ans, idx) => ({
    name: `Q${idx + 1}`,
    Score: ans.overallScore ?? 70,
    WPM: ans.speechMetrics?.wpm ?? 130,
    Confidence: ans.speechMetrics?.confidenceScore ?? 80,
    Clarity: ans.speechMetrics?.clarityScore ?? 85,
    Fillers: ans.speechMetrics?.fillerWordsCount ?? 0
  }));

  const getStatusBadge = (status?: StarStatus | string) => {
    switch (status) {
      case 'Strong':
        return <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-green-900/20 text-green-400 border border-green-900/40">Strong</span>;
      case 'Adequate':
        return <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-500/30">Adequate</span>;
      case 'Weak':
        return <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-yellow-900/20 text-yellow-400 border border-yellow-500/30">Weak</span>;
      case 'Missing':
      default:
        return <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-red-900/20 text-red-400 border border-red-900/40">Missing</span>;
    }
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  const handleSelectPastSessionForDeepDive = (pastSession: SessionEvaluation) => {
    setInspectedSession(pastSession);
    setActiveTab('current');
    setExpandedQuestion(0);
  };

  return (
    <div id="results-dashboard-screen" className="max-w-6xl mx-auto py-5 px-4 space-y-4 font-sans">
      {/* Top View Selector Bar (Current Drill vs Multi-Session History) */}
      <div className="bg-[#111827] border border-slate-800 rounded p-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            id="tab-btn-current-session"
            onClick={() => {
              setActiveTab('current');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'current'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{inspectedSession ? `Inspect: ${inspectedSession.companyName}` : 'Current Session Review'}</span>
          </button>

          <button
            id="tab-btn-history-trends"
            onClick={() => {
              setActiveTab('history');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HistoryIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>History & Trend Charts</span>
            <span className="text-[10px] font-mono bg-blue-900/40 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700/50">
              {historyList.length}
            </span>
          </button>
        </div>

        {inspectedSession && activeTab === 'current' && (
          <button
            onClick={() => setInspectedSession(null)}
            className="text-[11px] font-mono text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer bg-yellow-950/20 px-2.5 py-1 rounded border border-yellow-900/40"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Latest Drill</span>
          </button>
        )}
      </div>

      {/* RENDER VIEW: 1. MULTI-SESSION HISTORY & TRENDS */}
      {activeTab === 'history' ? (
        <HistoryTrendsView
          sessions={historyList}
          onSelectSessionForDeepDive={handleSelectPastSessionForDeepDive}
          currentSessionId={evaluation.id}
        />
      ) : (
        /* RENDER VIEW: 2. CURRENT / SELECTED SESSION DEEP DIVE */
        <div className="space-y-4">
          {/* Top Banner with Probability & Uncertainty Disclaimer */}
          <div className="bg-[#161B29] border border-slate-800 rounded p-4 relative overflow-hidden shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3" />
                  <span>
                    {inspectedSession ? `Historical Session (${inspectedSession.sessionDate || 'Archived'})` : 'Full-Session Evaluation & Rubric Benchmark'}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
                  {displayRole} at {currentEval.companyName}
                </h1>
                <p className="text-xs text-slate-400">
                  Evaluated {(currentEval.answers || []).length} behavioral & technical STAR responses against verified corporate rubrics.
                </p>
              </div>

              {/* Probabilistic Success Likelihood Gauge */}
              <div className="bg-[#0B0F1A] border border-blue-500/40 rounded p-3.5 text-center min-w-[220px]">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 font-bold">
                  ESTIMATED SUCCESS LIKELIHOOD
                </div>
                <div className="text-3xl font-bold font-mono text-green-400 mb-1">
                  {probability}%
                  <span className="text-xs text-blue-400 font-normal ml-1">± {uncertainty}%</span>
                </div>
                <div className="text-[9px] font-mono uppercase font-bold text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-900/40 inline-block">
                  Probabilistic Model Estimate
                </div>
              </div>
            </div>

            {/* Persona Verdict */}
            <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-start gap-2.5 bg-[#0B0F1A] p-3 rounded">
              <Bot className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                  COACH'S DEMANDING VERDICT (NO FLATTERY)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {coachVerdict}
                </p>
              </div>
            </div>
          </div>

          {/* TOP IMPROVEMENT CARD (For pre-interview reading) */}
          <div 
            id="pre-interview-reminder-card"
            className="bg-[#161B29] border border-yellow-500/40 rounded p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <h3 className="text-xs font-bold text-yellow-400 font-mono uppercase tracking-wider">
                Critical Reminder Card: Review 10 Minutes Before Your Real Interview
              </h3>
            </div>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Based on this drill, focus intensely on correcting these specific friction points:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {(currentEval.topImprovementAreas || []).map((area, idx) => {
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

          {/* Speech & Score Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performance & Score Progression */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-4">
              <h4 className="text-[11px] font-mono text-blue-400 uppercase font-bold mb-3 flex items-center gap-1.5 tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>STAR Scores & Clarity Across Questions</span>
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0F1A', borderColor: '#1e293b', fontSize: '11px', color: '#e2e8f0', borderRadius: '4px' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }} />
                    <Bar dataKey="Score" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Clarity" fill="#eab308" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Speech Pace Progression */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-4">
              <h4 className="text-[11px] font-mono text-green-400 uppercase font-bold mb-3 flex items-center gap-1.5 tracking-wider">
                <Volume2 className="w-3.5 h-3.5 text-green-400" />
                <span>Speech Pace (Words Per Minute)</span>
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <YAxis stroke="#64748b" domain={[60, 200]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B0F1A', borderColor: '#1e293b', fontSize: '11px', color: '#e2e8f0', borderRadius: '4px' }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }} />
                    <Line type="monotone" dataKey="WPM" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Question-by-Question Deep Dive */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-blue-400 uppercase font-bold flex items-center gap-1.5 tracking-wider">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Question-by-Question Detailed Review & Model Answers</span>
            </h3>

            {(currentEval.answers || []).map((ans, idx) => {
              const isOpen = expandedQuestion === idx;
              return (
                <div key={idx} className="bg-[#161B29] border border-slate-800 rounded overflow-hidden">
                  {/* Question summary row */}
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-[#0B0F1A] border border-slate-800 font-mono text-xs text-blue-400 flex items-center justify-center font-bold">
                        Q{idx + 1}
                      </span>
                      <div className="font-medium text-xs text-slate-200 max-w-xl truncate">
                        {ans.questionText}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block font-mono">
                        <span className="text-xs text-green-400 font-bold">{ans.overallScore}/100</span>
                        <span className="text-[9px] text-slate-400 block">{ans.speechMetrics?.wpm} WPM</span>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {/* Accordion detail body */}
                  {isOpen && (
                    <div className="p-4 border-t border-slate-800 bg-[#0B0F1A] space-y-3 text-xs">
                      {/* Your Transcript */}
                      <div className="bg-[#161B29] p-3 rounded border border-slate-800">
                        <span className="font-mono text-[10px] text-slate-500 uppercase font-bold block mb-1">CANDIDATE TRANSCRIPT</span>
                        <p className="text-slate-300 italic font-sans leading-relaxed">"{ans.userTranscript}"</p>
                      </div>

                      {/* STAR Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="p-2.5 bg-[#161B29] border border-slate-800 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-200 font-mono text-xs">Situation</strong>
                            {getStatusBadge(ans.starBreakdown?.situation?.status)}
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{ans.starBreakdown?.situation?.critique || 'Context evaluated.'}</p>
                        </div>
                        <div className="p-2.5 bg-[#161B29] border border-slate-800 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-200 font-mono text-xs">Task</strong>
                            {getStatusBadge(ans.starBreakdown?.task?.status)}
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{ans.starBreakdown?.task?.critique || 'Task ownership evaluated.'}</p>
                        </div>
                        <div className="p-2.5 bg-[#161B29] border border-slate-800 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-200 font-mono text-xs">Action</strong>
                            {getStatusBadge(ans.starBreakdown?.action?.status)}
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{ans.starBreakdown?.action?.critique || 'Technical actions evaluated.'}</p>
                        </div>
                        <div className="p-2.5 bg-[#161B29] border border-slate-800 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-200 font-mono text-xs">Result</strong>
                            {getStatusBadge(ans.starBreakdown?.result?.status)}
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{ans.starBreakdown?.result?.critique || 'Measurable outcome evaluated.'}</p>
                        </div>
                      </div>

                      {/* Model Answer */}
                      {ans.modelAnswerExemplar && (
                        <div className="p-3 bg-green-950/20 border border-green-900/40 rounded">
                          <div className="flex items-center gap-1.5 text-green-400 font-mono text-[10px] mb-1 font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            <span>MODEL ANSWER BENCHMARK</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-line font-sans text-xs">
                            {ans.modelAnswerExemplar}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action CTA buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="btn-download-report"
                onClick={handlePrintOrDownload}
                className="px-3.5 py-2 bg-[#161B29] hover:bg-slate-800 text-blue-400 border border-slate-800 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / PDF Report</span>
              </button>

              <button
                id="btn-sign-out"
                onClick={onSignOut}
                className="px-3.5 py-2 bg-[#161B29] hover:bg-red-950/30 text-red-400 border border-slate-800 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Session</span>
              </button>
            </div>

            <button
              id="btn-practice-again"
              onClick={onRestart}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start New Interview Drill</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


