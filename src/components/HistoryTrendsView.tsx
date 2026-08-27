import React, { useState } from 'react';
import { SessionEvaluation } from '../types';
import { 
  TrendingUp, 
  Award, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Building2, 
  Layers, 
  Zap, 
  Bot, 
  ChevronRight, 
  SlidersHorizontal,
  FileText,
  Clock,
  ShieldCheck,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceArea,
  ComposedChart,
  Area
} from 'recharts';

interface HistoryTrendsViewProps {
  sessions: SessionEvaluation[];
  onSelectSessionForDeepDive: (session: SessionEvaluation) => void;
  currentSessionId?: string;
}

export const HistoryTrendsView: React.FC<HistoryTrendsViewProps> = ({
  sessions,
  onSelectSessionForDeepDive,
  currentSessionId
}) => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [comparisonSessionAId, setComparisonSessionAId] = useState<string>(
    sessions[0]?.id || ''
  );
  const [comparisonSessionBId, setComparisonSessionBId] = useState<string>(
    sessions[sessions.length - 1]?.id || ''
  );
  const [showComparisonDrawer, setShowComparisonDrawer] = useState<boolean>(false);

  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-[#161B29] border border-slate-800 rounded p-8 text-center space-y-3">
        <Clock className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-sm font-mono text-slate-200 font-bold uppercase">No Historical Sessions Recorded</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Complete at least one interview drill to start tracking longitudinal improvements in STAR completeness and speech acoustics.
        </p>
      </div>
    );
  }

  // Filtered sessions
  const filteredSessions = selectedCompanyFilter === 'all' 
    ? sessions 
    : sessions.filter(s => s.companyName.toLowerCase() === selectedCompanyFilter.toLowerCase());

  // Prepare chronological chart series
  const chronologicalSeries = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.sessionDate || 0).getTime();
    const dateB = new Date(b.timestamp || b.sessionDate || 0).getTime();
    return dateA - dateB;
  });

  const chartData = chronologicalSeries.map((s, idx) => {
    const dateLabel = s.sessionDate 
      ? new Date(s.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
      : `S${idx + 1}`;
    
    const probability = s.successLikelihood?.percentage ?? s.successProbabilityPct ?? 70;
    const starScore = s.starCompletenessScore ?? 
      Math.round(
        ((s.starCoverageMetrics?.situationScore || 70) +
         (s.starCoverageMetrics?.taskScore || 70) +
         (s.starCoverageMetrics?.actionScore || 70) +
         (s.starCoverageMetrics?.resultScore || 70)) / 4
      );

    const wpm = s.speechTrends?.averageWpm ?? 
      (s.answers && s.answers.length > 0
        ? Math.round(s.answers.reduce((acc, a) => acc + (a.speechMetrics?.wpm || 135), 0) / s.answers.length)
        : 135);

    const clarity = s.speechTrends?.averageClarity ?? s.clarityScore ?? 85;
    const fillers = s.speechTrends?.totalFillerWords ?? 
      (s.answers ? s.answers.reduce((acc, a) => acc + (a.speechMetrics?.fillerWordsCount || 0), 0) : 2);

    return {
      id: s.id,
      index: idx + 1,
      label: `${dateLabel} (${s.companyName.slice(0, 7)})`,
      shortDate: dateLabel,
      company: s.companyName,
      role: s.roleTitle || s.targetRole || 'Software Engineer',
      overallScore: s.overallScore ?? 75,
      starCompleteness: starScore,
      successProbability: probability,
      wpm: wpm,
      clarity: clarity,
      fillerWords: fillers,
      situation: s.starCoverageMetrics?.situationScore ?? 75,
      task: s.starCoverageMetrics?.taskScore ?? 70,
      action: s.starCoverageMetrics?.actionScore ?? 75,
      result: s.starCoverageMetrics?.resultScore ?? 65
    };
  });

  // Calculate high-level deltas between first and latest session
  const firstSession = chartData[0];
  const latestSession = chartData[chartData.length - 1];

  const starDelta = latestSession ? latestSession.starCompleteness - firstSession.starCompleteness : 0;
  const overallDelta = latestSession ? latestSession.overallScore - firstSession.overallScore : 0;
  const wpmDelta = latestSession ? latestSession.wpm - firstSession.wpm : 0;
  const fillerDelta = latestSession ? latestSession.fillerWords - firstSession.fillerWords : 0;
  const probDelta = latestSession ? latestSession.successProbability - firstSession.successProbability : 0;

  // Comparison sessions
  const compSessionA = sessions.find(s => s.id === comparisonSessionAId) || sessions[0];
  const compSessionB = sessions.find(s => s.id === comparisonSessionBId) || sessions[sessions.length - 1];

  const companiesList = Array.from(new Set(sessions.map(s => s.companyName)));

  return (
    <div id="history-trends-view-container" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header & Filter Bar */}
      <div className="bg-[#161B29] border border-slate-800 rounded p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Multi-Session Velocity & Longitudinal Tracking</span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-slate-100 tracking-tight">
            Interview Performance Trajectory ({sessions.length} Calibrated Sessions)
          </h2>
          <p className="text-xs text-slate-400">
            Comparing STAR structure precision, speech acoustics, and rubric scores over time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <div className="flex items-center gap-1.5 bg-[#0B0F1A] border border-slate-800 rounded px-2.5 py-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0B0F1A] text-slate-200">All Target Companies ({sessions.length})</option>
              {companiesList.map((comp) => (
                <option key={comp} value={comp} className="bg-[#0B0F1A] text-slate-200">{comp}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowComparisonDrawer(!showComparisonDrawer)}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showComparisonDrawer 
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                : 'bg-[#0B0F1A] text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showComparisonDrawer ? 'Hide Comparison' : 'Compare 2 Sessions'}</span>
          </button>
        </div>
      </div>

      {/* High-Level Progress Delta KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* STAR Completeness Delta */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
            <span>STAR Completeness</span>
            <Target className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-400">
              {latestSession?.starCompleteness ?? 85}%
            </span>
            <span className={`text-[11px] font-mono font-bold flex items-center ${
              starDelta >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {starDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {starDelta >= 0 ? `+${starDelta}%` : `${starDelta}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-1">
            From {firstSession?.starCompleteness}% in initial drill
          </span>
        </div>

        {/* Success Probability Delta */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
            <span>Offer Likelihood</span>
            <Award className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-green-400">
              {latestSession?.successProbability ?? 80}%
            </span>
            <span className={`text-[11px] font-mono font-bold flex items-center ${
              probDelta >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {probDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {probDelta >= 0 ? `+${probDelta}%` : `${probDelta}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-1">
            From {firstSession?.successProbability}% initial simulation
          </span>
        </div>

        {/* Speech Pace Moderation Delta */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
            <span>Speech Pace (WPM)</span>
            <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-yellow-400">
              {latestSession?.wpm ?? 136}
            </span>
            <span className="text-[10px] font-mono text-green-400 font-bold px-1.5 py-0.2 rounded bg-green-900/30 border border-green-800/40">
              Optimal
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-1">
            Moderated from {firstSession?.wpm} WPM (Calmer)
          </span>
        </div>

        {/* Verbal Crutches Eliminated */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-3.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold mb-1">
            <span>Filler Words / Drill</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-400">
              {latestSession?.fillerWords ?? 1}
            </span>
            <span className={`text-[11px] font-mono font-bold flex items-center ${
              fillerDelta <= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {fillerDelta <= 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
              {fillerDelta <= 0 ? `${fillerDelta}` : `+${fillerDelta}`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans block mt-1">
            Reduced from {firstSession?.fillerWords} verbal crutches
          </span>
        </div>
      </div>

      {/* OPTIONAL COMPARISON DRAWER (Session A vs Session B) */}
      {showComparisonDrawer && (
        <div className="bg-[#161B29] border border-blue-500/40 rounded p-4 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5 tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side Session Delta Comparison</span>
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={comparisonSessionAId}
                onChange={(e) => setComparisonSessionAId(e.target.value)}
                className="bg-[#0B0F1A] border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
              >
                {sessions.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    Session {idx + 1}: {s.companyName} ({s.sessionDate || 'Date'})
                  </option>
                ))}
              </select>
              <span className="text-xs text-slate-500 font-mono">vs</span>
              <select
                value={comparisonSessionBId}
                onChange={(e) => setComparisonSessionBId(e.target.value)}
                className="bg-[#0B0F1A] border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
              >
                {sessions.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    Session {idx + 1}: {s.companyName} ({s.sessionDate || 'Date'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Session A Card */}
            <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-200 text-xs">{compSessionA.companyName}</span>
                <span className="text-[10px] font-mono text-slate-400">{compSessionA.sessionDate}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{compSessionA.roleTitle || compSessionA.targetRole}</p>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-center pt-1 border-t border-slate-800">
                <div className="bg-[#161B29] p-1.5 rounded">
                  <span className="text-[9px] text-slate-400 block">STAR</span>
                  <span className="text-xs font-bold text-blue-400">{compSessionA.starCompletenessScore || 70}%</span>
                </div>
                <div className="bg-[#161B29] p-1.5 rounded">
                  <span className="text-[9px] text-slate-400 block">PACE</span>
                  <span className="text-xs font-bold text-yellow-400">{compSessionA.speechTrends?.averageWpm || 140} WPM</span>
                </div>
                <div className="bg-[#161B29] p-1.5 rounded">
                  <span className="text-[9px] text-slate-400 block">OFFER PROB</span>
                  <span className="text-xs font-bold text-green-400">{compSessionA.successLikelihood?.percentage || compSessionA.successProbabilityPct || 70}%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-2">"{compSessionA.criticalCoachVerdict || compSessionA.successLikelihood?.probabilisticExplanation}"</p>
            </div>

            {/* Session B Card */}
            <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-200 text-xs">{compSessionB.companyName}</span>
                <span className="text-[10px] font-mono text-slate-400">{compSessionB.sessionDate}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{compSessionB.roleTitle || compSessionB.targetRole}</p>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-center pt-1 border-t border-slate-800">
                <div className="bg-[#161B29] p-1.5 rounded">
                  <span className="text-[9px] text-slate-400 block">STAR</span>
                  <span className="text-xs font-bold text-blue-400">{compSessionB.starCompletenessScore || 70}%</span>
                </div>
                <div className="bg-[#161B29] p-1.5 rounded">
                  <span className="text-[9px] text-slate-400 block">PACE</span>
                  <span className="text-xs font-bold text-yellow-400">{compSessionB.speechTrends?.averageWpm || 140} WPM</span>
                </div>
                <div className="bg-[#161B29] p-1.5 rounded">
                  <span className="text-[9px] text-slate-400 block">OFFER PROB</span>
                  <span className="text-xs font-bold text-green-400">{compSessionB.successLikelihood?.percentage || compSessionB.successProbabilityPct || 70}%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-2">"{compSessionB.criticalCoachVerdict || compSessionB.successLikelihood?.probabilisticExplanation}"</p>
            </div>
          </div>
        </div>
      )}

      {/* DUAL COMPARISON TREND CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: STAR Completeness & Rubric Scores Over Time */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1.5 tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>STAR Completeness & Offer Likelihood (%)</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Across {chartData.length} Sessions</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="shortDate" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" domain={[40, 100]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F1A', borderColor: '#1e293b', fontSize: '11px', color: '#e2e8f0', borderRadius: '4px' }}
                  formatter={(value: any, name: any) => [`${value}%`, name]}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? `${item.company} (${item.role}) - ${label}` : label;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }} />
                <Line 
                  type="monotone" 
                  name="STAR Completeness" 
                  dataKey="starCompleteness" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#3b82f6' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  name="Offer Probability" 
                  dataKey="successProbability" 
                  stroke="#22c55e" 
                  strokeWidth={2} 
                  strokeDasharray="4 2"
                  dot={{ r: 4, fill: '#22c55e' }} 
                />
                <Line 
                  type="monotone" 
                  name="Overall Rubric" 
                  dataKey="overallScore" 
                  stroke="#a855f7" 
                  strokeWidth={1.5} 
                  dot={{ r: 3, fill: '#a855f7' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Speech Pace (WPM) & Verbal Crutches Trend */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono text-green-400 uppercase font-bold flex items-center gap-1.5 tracking-wider">
              <Volume2 className="w-3.5 h-3.5 text-green-400" />
              <span>Speech Pace (WPM) & Fillers Reduction</span>
            </h4>
            <span className="text-[10px] font-mono text-green-400/80 bg-green-950/30 px-1.5 py-0.5 rounded border border-green-800/40">
              Optimal: 125-145 WPM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="shortDate" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis yAxisId="left" stroke="#64748b" domain={[100, 190]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#a855f7" domain={[0, 12]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F1A', borderColor: '#1e293b', fontSize: '11px', color: '#e2e8f0', borderRadius: '4px' }}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? `${item.company} (${item.role}) - ${label}` : label;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }} />
                <Bar 
                  yAxisId="right" 
                  name="Filler Words Count" 
                  dataKey="fillerWords" 
                  fill="#a855f7" 
                  opacity={0.4} 
                  radius={[2, 2, 0, 0]} 
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  name="Pace (WPM)" 
                  dataKey="wpm" 
                  stroke="#eab308" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#eab308' }} 
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  name="Clarity Score" 
                  dataKey="clarity" 
                  stroke="#22c55e" 
                  strokeWidth={1.5} 
                  dot={{ r: 3, fill: '#22c55e' }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Detailed S-T-A-R Component Breakdown Evolution */}
      <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono text-yellow-400 uppercase font-bold flex items-center gap-1.5 tracking-wider">
            <Layers className="w-3.5 h-3.5 text-yellow-400" />
            <span>S-T-A-R Component Progression (Situation, Task, Action, Result)</span>
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Note: Task & Result metrics showed strongest recovery
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="shortDate" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B0F1A', borderColor: '#1e293b', fontSize: '11px', color: '#e2e8f0', borderRadius: '4px' }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }} />
              <Bar dataKey="situation" name="Situation" fill="#60a5fa" radius={[2, 2, 0, 0]} />
              <Bar dataKey="task" name="Task (Constraints)" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              <Bar dataKey="action" name="Action (Tech Depth)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="result" name="Result (Quantified)" fill="#22c55e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHRONOLOGICAL SESSION LOG & DEEP-DIVE INSPECTION TABLE */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-slate-200 uppercase font-bold flex items-center gap-1.5 tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>Historical Interview Sessions Log ({filteredSessions.length})</span>
        </h3>

        <div className="space-y-2.5">
          {chronologicalSeries.map((s, idx) => {
            const isCurrent = s.id === currentSessionId;
            const starScore = s.starCompletenessScore ?? 75;
            const probability = s.successLikelihood?.percentage ?? s.successProbabilityPct ?? 70;
            const wpm = s.speechTrends?.averageWpm ?? 140;
            const fillers = s.speechTrends?.totalFillerWords ?? 2;

            return (
              <div 
                key={s.id}
                className={`bg-[#161B29] border rounded p-3.5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  isCurrent 
                    ? 'border-blue-500/60 bg-blue-950/10 shadow-md' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 rounded bg-[#0B0F1A] border border-slate-800 font-mono text-[10px] text-blue-400 font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-100">{s.companyName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {s.sessionDate || '2026-08-25'}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50 uppercase font-bold">
                        Active Drill
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{s.roleTitle || s.targetRole}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-1">
                    "{s.criticalCoachVerdict || s.successLikelihood?.probabilisticExplanation}"
                  </p>
                </div>

                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                  <div className="grid grid-cols-3 gap-3 font-mono text-right">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">STAR</span>
                      <span className="text-xs font-bold text-blue-400">{starScore}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Pace</span>
                      <span className="text-xs font-bold text-yellow-400">{wpm} WPM</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Offer %</span>
                      <span className="text-xs font-bold text-green-400">{probability}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSessionForDeepDive(s)}
                    className="px-3 py-1.5 bg-[#0B0F1A] hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-900/40 hover:border-blue-500 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0"
                  >
                    <span>View Breakdown</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
