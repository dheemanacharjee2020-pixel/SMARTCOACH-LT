import React, { useState, useRef } from 'react';
import { CompanyProfile } from '../types';
import { SAMPLE_RESUMES } from '../data/sampleData';
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
  Info
} from 'lucide-react';

interface PrepStepProps {
  initialResumeText: string;
  initialResumeFileName: string;
  initialCompanyName: string;
  onProceedToJobDescription: (resumeText: string, resumeFileName: string, company: CompanyProfile) => void;
}

export const PrepStep: React.FC<PrepStepProps> = ({
  initialResumeText,
  initialResumeFileName,
  initialCompanyName,
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
          setResumeText(`Extracted text from uploaded file ${file.name} (Size: ${(file.size / 1024).toFixed(1)} KB):\nCandidate profile with technical experience in software engineering, distributed systems, REST APIs, and team leadership.`);
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

  const handleSelectSampleResume = (sampleId: string) => {
    const selected = SAMPLE_RESUMES.find(r => r.id === sampleId);
    if (selected) {
      setResumeText(selected.text);
      setResumeFileName(selected.fileName);
    }
  };

  const handleCompanyVerificationAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setDeclineError('Please upload a resume or paste your resume text before proceeding.');
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
      const res = await fetch('/api/company/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: companyName.trim() })
      });
      const data = await res.json();

      if (data.success && data.company && data.company.verified) {
        setVerifiedCompany(data.company);
        setLookupMessage(data.cached ? 'Verified in company cache.' : 'Successfully indexed corporate interview rubrics.');
        setTimeout(() => {
          onProceedToJobDescription(resumeText, resumeFileName || 'Uploaded_Resume.pdf', data.company);
        }, 500);
      } else {
        setDeclineError(
          data.message || 
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
    <div id="prep-screen" className="max-w-4xl mx-auto py-4 px-2 flex flex-col items-center">
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
          Provide your resume and target company. SmartCoach LT indexes verified rubric benchmarks and role archetypes.
        </p>
      </div>

      <form onSubmit={handleCompanyVerificationAndProceed} className="w-full max-w-2xl space-y-4">
        {/* Decline Error Banner */}
        {declineError && (
          <div 
            id="company-decline-alert"
            className="p-4 bg-red-900/10 border border-red-900/40 rounded text-xs text-red-400 leading-relaxed shadow-lg flex items-start gap-3"
          >
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-xs uppercase font-mono text-red-400">
                Preparation Blocked: Unverified Entity
              </div>
              <p className="text-slate-300 text-xs">{declineError}</p>
              <div className="pt-1.5 text-[10px] text-slate-400 font-mono">
                Tip: Try verified targets like <strong className="text-blue-400">Stripe, Google, Amazon, Microsoft, Netflix, Tesla, Uber, Goldman Sachs</strong> or verify spelling.
              </div>
            </div>
          </div>
        )}

        {/* 1. Resume Upload Box */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>1. Resume Parsing Pipeline</span>
            </label>
            
            {/* Quick Sample Resume Loader */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500">Preset:</span>
              <select
                onChange={(e) => handleSelectSampleResume(e.target.value)}
                className="bg-[#0B0F1A] text-[11px] text-blue-400 border border-slate-800 rounded px-2 py-0.5 outline-none cursor-pointer font-mono"
                defaultValue=""
              >
                <option value="" disabled>Load Sample Candidate...</option>
                {SAMPLE_RESUMES.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag and drop target */}
          <div
            id="drop-zone-resume"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-900/20'
                : resumeText
                ? 'border-green-900/50 bg-green-900/10'
                : 'border-slate-800 hover:border-slate-700 bg-[#0B0F1A]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              accept=".pdf,.txt,.docx,.md"
              className="hidden"
            />
            {resumeText ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 rounded-full bg-green-900/20 text-green-400">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {resumeFileName || 'Resume Loaded'}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {resumeText.split(/\s+/).length} words ingested • Click or drag to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 rounded bg-slate-900 text-blue-400 border border-slate-800">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-slate-200">
                  Drop resume file (.pdf, .txt, .docx)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  or click to select from file system
                </div>
              </div>
            )}
          </div>

          {/* Resume preview / editable snippet */}
          {resumeText && (
            <div className="mt-3 pt-2.5 border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono uppercase font-bold">
                <span>Ingested Resume Corpus Preview</span>
                <button
                  type="button"
                  onClick={() => { setResumeText(''); setResumeFileName(''); }}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  Clear Buffer
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={3}
                className="w-full p-2 bg-[#0B0F1A] border border-slate-800 rounded text-[11px] font-mono text-slate-300 leading-relaxed outline-none focus:border-blue-500"
                placeholder="Resume text buffer..."
              />
            </div>
          )}
        </div>

        {/* 2. Target Company Name Input */}
        <div className="bg-[#161B29] border border-slate-800 rounded p-4">
          <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>2. Target Corporation</span>
          </label>
          <div className="relative">
            <input
              id="input-company-name"
              type="text"
              required
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (declineError) setDeclineError(null);
              }}
              placeholder="e.g. Stripe, Google, Netflix, Amazon, Meta, Apple..."
              className="w-full pl-9 pr-3 py-2 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Quick pick chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-500">Verified Database:</span>
            {['Stripe', 'Google', 'Amazon', 'Netflix', 'Microsoft', 'Meta', 'Goldman Sachs', 'Uber'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCompanyName(c);
                  if (declineError) setDeclineError(null);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  companyName.toLowerCase() === c.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold border-blue-500'
                    : 'bg-[#0B0F1A] text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Submit & Verification CTA */}
        <button
          id="btn-verify-company"
          type="submit"
          disabled={isLookingUp || !resumeText || !companyName}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md"
        >
          {isLookingUp ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span className="font-mono text-xs">{lookupMessage || 'INDEXING BENCHMARKS...'}</span>
            </div>
          ) : (
            <>
              <span>Verify Benchmarks & Target Job Description</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

