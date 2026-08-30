import React, { useState, useEffect } from 'react';
import { AtsResult, CompanyProfile, CandidateTrack } from '../types';
import { CANDIDATE_TRACKS, getQuestionCountForTrack } from '../utils/tracks';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Sliders, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  ArrowLeft,
  Bot,
  GraduationCap
} from 'lucide-react';

interface AtsCheckStepProps {
  company: CompanyProfile;
  roleTitle: string;
  resumeText: string;
  jobDescription: string;
  atsResult: AtsResult | null;
  isLoading: boolean;
  candidateTrack?: CandidateTrack;
  onRunAtsAnalysis: (threshold: number) => void;
  onProceedToInterview: (atsScore: number) => void;
  onBackToJobDescription: () => void;
}

export const AtsCheckStep: React.FC<AtsCheckStepProps> = ({
  company,
  roleTitle,
  resumeText,
  jobDescription,
  atsResult,
  isLoading,
  candidateTrack = 'undergraduate',
  onRunAtsAnalysis,
  onProceedToInterview,
  onBackToJobDescription
}) => {
  const [threshold, setThreshold] = useState<number>(atsResult?.threshold || 60);
  const activeTrack = CANDIDATE_TRACKS.find(t => t.id === candidateTrack) || CANDIDATE_TRACKS[0];
  const questionCount = getQuestionCountForTrack(candidateTrack);

  const handleThresholdChange = (newVal: number) => {
    setThreshold(newVal);
    onRunAtsAnalysis(newVal);
  };

  const isBelowThreshold = atsResult ? atsResult.matchScore < threshold : false;

  return (
    <div id="ats-check-screen" className="max-w-4xl mx-auto py-4 px-2 flex flex-col items-center">
      {/* Top Stage Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToJobDescription}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Role Details</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161B29] border border-slate-800 text-slate-300 text-[10px] font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Track: <strong className="text-blue-400">{activeTrack.label.split('/')[0].trim()}</strong> ({questionCount} Qs)</span>
          </span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stage 4: ATS Resume Match Analyzer</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full max-w-2xl bg-[#161B29] border border-slate-800 rounded p-10 text-center flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <h3 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-wider">Executing ATS Vector Match Matrix...</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Comparing candidate experience against {company.name} job description, technical requirements, and core values.
          </p>
        </div>
      ) : atsResult ? (
        <div className="w-full max-w-3xl space-y-4">
          {/* Main Score Card with Threshold Slider */}
          <div className="bg-[#161B29] border border-slate-800 rounded p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              {/* Score Gauge */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded border border-slate-800 flex flex-col items-center justify-center bg-[#0B0F1A]">
                  <span className={`text-2xl font-bold font-mono ${isBelowThreshold ? 'text-yellow-400' : 'text-green-400'}`}>
                    {atsResult.matchScore}%
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">ATS Match</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-slate-100">{roleTitle}</span>
                    <span className="text-xs text-slate-400">@ {company.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1.5">
                    Experience Alignment: <strong className="text-blue-400 font-mono">{atsResult.experienceAlignmentScore}%</strong>
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-400">Pass Threshold:</span>
                    <span className="px-2 py-0.5 rounded bg-[#0B0F1A] text-blue-400 border border-slate-800 font-bold">
                      {threshold}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Configurable Threshold Slider */}
              <div className="w-full md:w-60 bg-[#0B0F1A] p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    <Sliders className="w-3 h-3" />
                    <span>Cutoff</span>
                  </span>
                  <span className="text-blue-400 font-bold">{threshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="85"
                  step="5"
                  value={threshold}
                  onChange={(e) => handleThresholdChange(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                  <span>Relaxed (40%)</span>
                  <span>Strict (85%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Threshold Status Banner */}
          {isBelowThreshold ? (
            <div 
              id="ats-warning-banner"
              className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded flex items-start gap-3 shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-xs text-yellow-400 uppercase font-mono flex items-center gap-2">
                  <span>Match Score Below Configured Target ({threshold}%)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your resume scored <strong className="text-yellow-400">{atsResult.matchScore}%</strong>, which is below the target cutoff of <strong className="text-yellow-400">{threshold}%</strong>. In a live pipeline, this risks early rejection.
                </p>
                <p className="text-[11px] text-slate-400 pt-0.5">
                  You are <strong>not blocked</strong> — you may proceed directly into the interview drill to prove your qualifications in dialogue.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-green-900/10 border border-green-900/40 rounded flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <div className="text-xs text-green-400 leading-relaxed">
                <strong>ATS Target Passed ({atsResult.matchScore}% ≥ {threshold}%).</strong> Strong keyword overlap for {roleTitle}. Proceed into the demanding STAR interview drill.
              </div>
            </div>
          )}

          {/* Keywords & Gap Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Matched Skills */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-4">
              <h4 className="text-[10px] font-mono text-green-400 uppercase mb-2.5 flex items-center gap-1.5 font-bold tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matched Core Capabilities ({(atsResult.matchedKeywords || []).length})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(atsResult.matchedKeywords || []).map((kw, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-900/20 text-green-400 border border-green-900/40 font-medium">
                    {typeof kw === 'string' ? kw : JSON.stringify(kw)}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Keywords */}
            <div className="bg-[#161B29] border border-slate-800 rounded p-4">
              <h4 className="text-[10px] font-mono text-yellow-400 uppercase mb-2.5 flex items-center gap-1.5 font-bold tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Gaps / Weak Keywords ({(atsResult.missingKeywords || []).length})</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(atsResult.missingKeywords || []).length > 0 ? (
                  (atsResult.missingKeywords || []).map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-900/20 text-yellow-400 border border-yellow-500/30 font-medium">
                      {typeof kw === 'string' ? kw : JSON.stringify(kw)}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No critical missing keywords identified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-2">
            <h4 className="text-[10px] font-mono text-blue-400 uppercase flex items-center gap-1.5 font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Surgical ATS Optimizations for Real Application</span>
            </h4>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {(atsResult.recommendations || []).map((rec, idx) => (
                <li key={idx} className="leading-relaxed">{typeof rec === 'string' ? rec : JSON.stringify(rec)}</li>
              ))}
            </ul>
          </div>

          {/* Primary CTA */}
          <button
            id="btn-proceed-to-interview"
            onClick={() => onProceedToInterview(atsResult.matchScore)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
          >
            <span>{isBelowThreshold ? `Continue to Interview Anyway (${questionCount} Questions)` : `Start Live Interview Session (${questionCount} Questions)`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

