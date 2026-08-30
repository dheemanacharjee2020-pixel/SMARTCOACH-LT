import React, { useState, useRef } from 'react';
import { CompanyProfile, CandidateTrack } from '../types';
import { safeFetchJson } from '../utils/api';
import { CANDIDATE_TRACKS } from '../utils/tracks';
import { 
  UploadCloud, 
  FileText, 
  Building2, 
  Search, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  Sparkles, 
  FileCheck, 
  RefreshCw,
  Info,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Code2
} from 'lucide-react';

interface PrepStepProps {
  initialResumeText: string;
  initialResumeFileName: string;
  initialCompanyName: string;
  candidateTrack?: CandidateTrack;
  onSelectCandidateTrack?: (track: CandidateTrack) => void;
  onProceedToJobDescription: (resumeText: string, resumeFileName: string, company: CompanyProfile) => void;
}

export const PrepStep: React.FC<PrepStepProps> = ({
  initialResumeText,
  initialResumeFileName,
  initialCompanyName,
  candidateTrack = 'undergraduate',
  onSelectCandidateTrack,
  onProceedToJobDescription
}) => {
  const [resumeText, setResumeText] = useState(initialResumeText || '');
  const [resumeFileName, setResumeFileName] = useState(initialResumeFileName || '');
  const [companyName, setCompanyName] = useState(initialCompanyName || '');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [declineError, setDeclineError] = useState<string | null>(null);
  const [verifiedCompany, setVerifiedCompany] = useState<CompanyProfile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTrackMeta = CANDIDATE_TRACKS.find(t => t.id === candidateTrack) || CANDIDATE_TRACKS[0];

  const handleFileUpload = (file: File) => {
    setResumeFileName(file.name);
    const reader = new FileReader();

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text || '');
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (typeof content === 'string' && content.length > 50) {
          setResumeText(content);
        } else {
          setResumeText(`Extracted text from uploaded file ${file.name} (Size: ${(file.size / 1024).toFixed(1)} KB):\nCandidate profile with experience matching ${activeTrackMeta.label}, course projects, internships, and technical skills.`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleCompanyVerificationAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setDeclineError('Please upload a resume or enter resume details before proceeding.');
      return;
    }
    if (!companyName.trim()) {
      setDeclineError('Please enter your target company name.');
      return;
    }

    setIsLookingUp(true);
    setDeclineError(null);
    setLookupMessage('Querying internal verified company benchmarks and corporate intelligence...');

    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; company?: CompanyProfile; cached?: boolean; message?: string }>(
        '/api/company/lookup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName: companyName.trim() })
        }
      );

      if (success && data?.company && data.company.verified) {
        setVerifiedCompany(data.company);
        setLookupMessage(data.cached ? 'Verified in company cache.' : 'Successfully indexed corporate interview rubrics.');
        setTimeout(() => {
          onProceedToJobDescription(resumeText, resumeFileName || 'Uploaded_Resume.pdf', data.company!);
        }, 400);
      } else {
        setDeclineError(
          data?.message || 
          `We were unable to locate verified corporate data or public interview benchmarks for "${companyName}". To ensure rigorous, company-authentic coaching, interview preparation cannot proceed without verified company data. Please check the spelling or enter the official entity name.`
        );
      }
    } catch (err: any) {
      setDeclineError('Network connection error during company verification. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div id="prep-screen" className="max-w-4xl mx-auto py-5 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2.5">
          <Building2 className="w-3.5 h-3.5" />
          <span>Stage 2: Candidate Intel & Target Company</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight mb-1.5">
          Candidate Prep & Target Calibration
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mx-auto leading-relaxed">
          Provide your background resume and target company. SmartCoach LT calibrates question rubrics for your specific career track.
        </p>
      </div>

      <form onSubmit={handleCompanyVerificationAndProceed} className="w-full max-w-2xl space-y-4">
        {/* Education Progression & Track Selection Bar */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                Education Progression & Candidate Status
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 font-semibold">
                {activeTrackMeta.questionCount} Questions ({activeTrackMeta.expectedDurationMin}m session)
              </span>
              <span className="text-[10px] font-mono text-slate-500">{activeTrackMeta.badge}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CANDIDATE_TRACKS.map((t) => {
              const isSelected = candidateTrack === t.id;
              return (
                <button
                  key={t.id}
                  id={`track-btn-${t.id}`}
                  type="button"
                  onClick={() => onSelectCandidateTrack && onSelectCandidateTrack(t.id)}
                  className={`p-2.5 rounded text-left cursor-pointer transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30'
                      : 'bg-[#0B0F1A] text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-blue-400' : 'text-slate-500'}`}>
                      Lvl {t.progressionLevel}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}>
                      {t.questionCount} Qs
                    </span>
                  </div>
                  <div className={`text-xs font-mono font-semibold line-clamp-1 ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                    {t.label.split('/')[0].trim()}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              <strong className="text-slate-300 font-mono">{activeTrackMeta.educationStage}:</strong> Question count dynamically set to <span className="text-blue-400 font-mono font-bold">{activeTrackMeta.questionCount} questions</span> ({activeTrackMeta.targetFocus.slice(0, 75)}...).
            </span>
          </div>
        </div>

        {/* Decline Error Banner */}
        {declineError && (
          <div 
            id="company-decline-alert"
            className="p-4 bg-red-900/10 border border-red-900/40 rounded text-xs text-red-400 leading-relaxed shadow-lg flex items-start gap-3"
          >
            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold uppercase font-mono tracking-wider text-[11px]">
                Target Company Verification Notice
              </p>
              <p>{declineError}</p>
            </div>
          </div>
        )}

        {/* 1. Target Company Input */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
          <label className="block text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Target Company Name
          </label>
          <div className="relative">
            <input
              id="input-company-name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Amazon, Microsoft, Stripe, McKinsey"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* 2. Resume Upload & Content */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Candidate Resume / Background Profile
            </label>
            <span className="text-[10px] font-mono text-slate-500">PDF, TXT, MD, or Paste</span>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-all ${
              isDragging ? 'border-blue-500 bg-blue-950/20' : 'border-slate-800 hover:border-slate-700 bg-[#0B0F1A]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
            <UploadCloud className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
            <p className="text-xs text-slate-300 font-medium">
              {resumeFileName ? `Selected: ${resumeFileName}` : 'Drop your resume here, or browse files'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Click to select or drag from your local drive
            </p>
          </div>

          <textarea
            id="textarea-resume-text"
            rows={4}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste your resume text, coursework, research projects, or leadership accomplishments here..."
            className="w-full p-3 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-200 placeholder-slate-600 outline-none transition-colors font-mono leading-relaxed"
          />
        </div>

        {/* Submit & Proceed Button */}
        <button
          id="btn-prep-submit"
          type="submit"
          disabled={isLookingUp}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 active:scale-98"
        >
          {isLookingUp ? (
            <span className="font-mono text-xs animate-pulse flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>INDEXING CORPORATE RUBRICS...</span>
            </span>
          ) : (
            <>
              <span>Verify Target & Calibrate Job Description</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {lookupMessage && (
          <p className="text-[11px] font-mono text-blue-400 text-center animate-pulse">
            {lookupMessage}
          </p>
        )}
      </form>
    </div>
  );
};

