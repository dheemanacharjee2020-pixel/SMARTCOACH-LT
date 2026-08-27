import React from 'react';
import { AnswerCritique, StarStatus } from '../types';
import { 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  Gauge, 
  Layers,
  X
} from 'lucide-react';

interface StarCritiqueModalProps {
  critique: AnswerCritique;
  questionNumber: number;
  totalQuestions: number;
  onContinue: () => void;
}

export const StarCritiqueModal: React.FC<StarCritiqueModalProps> = ({
  critique,
  questionNumber,
  totalQuestions,
  onContinue
}) => {
  const getStatusBadge = (status: StarStatus) => {
    switch (status) {
      case 'Strong':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-green-900/20 text-green-400 border border-green-900/40 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Strong
          </span>
        );
      case 'Adequate':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-900/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Adequate
          </span>
        );
      case 'Weak':
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-yellow-900/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Weak
          </span>
        );
      case 'Missing':
      default:
        return (
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-900/20 text-red-400 border border-red-900/40 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Missing
          </span>
        );
    }
  };

  const isLastQuestion = questionNumber >= totalQuestions;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div 
        id="star-critique-modal"
        className="bg-[#161B29] border border-slate-800 rounded max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 bg-[#0B0F1A] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-red-900/20 border border-red-900/40 text-red-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100 uppercase font-mono">
                  STAR Evaluation (Q{questionNumber}/{totalQuestions})
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#161B29] text-blue-400 border border-slate-800">
                  Score: {critique.overallScore}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Demanding interviewer breakdown of your response.</p>
            </div>
          </div>
          
          <button 
            onClick={onContinue}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Question & Transcript Snippet */}
          <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">INTERVIEW QUESTION:</div>
            <p className="text-xs font-semibold text-slate-200 mb-2.5">"{critique.questionText}"</p>
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">CAPTURED CANDIDATE TRANSCRIPT:</div>
            <p className="text-xs text-slate-300 italic bg-[#161B29] p-2.5 rounded border border-slate-800 leading-relaxed font-sans">
              "{critique.userTranscript}"
            </p>
          </div>

          {/* Persona Critique (Direct & Demanding) */}
          <div className="p-3.5 bg-red-900/10 border border-red-900/30 rounded">
            <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 mb-1 font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Interviewer Assessment & Critical Vulnerabilities</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              {critique.interviewerPersonaCritique}
            </p>
            {(critique.criticalFlaws || []).length > 0 && (
              <ul className="space-y-0.5 text-xs text-red-400 list-disc list-inside font-mono">
                {(critique.criticalFlaws || []).map((flaw, idx) => (
                  <li key={idx}>{typeof flaw === 'string' ? flaw : JSON.stringify(flaw)}</li>
                ))}
              </ul>
            )}
          </div>

          {/* STAR 4-Quadrant Breakdown */}
          <div>
            <div className="text-[10px] font-mono text-blue-400 uppercase font-bold mb-2.5 flex items-center gap-1.5 tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>STAR Quadrant Decomposition</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {/* Situation */}
              <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-200">S — Situation</span>
                  {getStatusBadge(critique.starBreakdown?.situation?.status)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {critique.starBreakdown?.situation?.critique || 'Context evaluated.'}
                </p>
              </div>

              {/* Task */}
              <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-200">T — Task</span>
                  {getStatusBadge(critique.starBreakdown?.task?.status)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {critique.starBreakdown?.task?.critique || 'Task ownership evaluated.'}
                </p>
              </div>

              {/* Action */}
              <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-200">A — Action</span>
                  {getStatusBadge(critique.starBreakdown?.action?.status)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {critique.starBreakdown?.action?.critique || 'Technical actions evaluated.'}
                </p>
              </div>

              {/* Result */}
              <div className="bg-[#0B0F1A] p-3 rounded border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-200">R — Result</span>
                  {getStatusBadge(critique.starBreakdown?.result?.status)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {critique.starBreakdown?.result?.critique || 'Measurable outcome evaluated.'}
                </p>
              </div>
            </div>
          </div>

          {/* Model Answer Exemplar */}
          {critique.modelAnswerExemplar && (
            <div className="bg-[#0B0F1A] p-3 rounded border border-green-900/40">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-green-400 mb-1.5 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-green-400" />
                <span>Bar-Raiser Model Answer Exemplar</span>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                {critique.modelAnswerExemplar}
              </p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-3.5 bg-[#0B0F1A] border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            Acoustic: {critique.speechMetrics.wpm} WPM ({critique.speechMetrics.paceStatus}) • Clarity: {critique.speechMetrics.clarityScore}%
          </div>

          <button
            id="btn-continue-from-critique"
            onClick={onContinue}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
          >
            <span>{isLastQuestion ? 'Proceed to Final Evaluation' : 'Next Question'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

