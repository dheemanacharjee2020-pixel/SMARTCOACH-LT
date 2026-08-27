import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/sampleData';
import { 
  Building2, 
  Briefcase, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Layers, 
  Database,
  ArrowLeft
} from 'lucide-react';

interface JobDescriptionStepProps {
  company: CompanyProfile;
  resumeFileName: string;
  initialRoleTitle?: string;
  initialJobDescription?: string;
  onProceedToAts: (roleTitle: string, jobDescription: string) => void;
  onBack: () => void;
}

export const JobDescriptionStep: React.FC<JobDescriptionStepProps> = ({
  company,
  resumeFileName,
  initialRoleTitle,
  initialJobDescription,
  onProceedToAts,
  onBack
}) => {
  // Preset match check
  const presetKey = Object.keys(SAMPLE_JOB_DESCRIPTIONS).find(
    k => k.toLowerCase() === company.name.toLowerCase()
  );
  const defaultPreset = presetKey ? SAMPLE_JOB_DESCRIPTIONS[presetKey] : null;

  const [roleTitle, setRoleTitle] = useState(initialRoleTitle || defaultPreset?.role || 'Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState(
    initialJobDescription || defaultPreset?.jd || `Role: ${roleTitle} at ${company.name}\n\nKey Responsibilities:\n- Architect, build, and maintain production applications and high-throughput backend services.\n- Collaborate cross-functionally with Product, UX, and Infrastructure leads.\n- Champion engineering rigor, code quality, and operational excellence.\n\nQualifications:\n- 4+ years of relevant software engineering experience.\n- Strong expertise with modern system design, web frameworks, and cloud infrastructure.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || !jobDescription.trim()) return;
    onProceedToAts(roleTitle.trim(), jobDescription.trim());
  };

  return (
    <div id="job-description-screen" className="max-w-4xl mx-auto py-4 px-2 flex flex-col items-center">
      {/* Top Breadcrumb / Stage */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prep</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Stage 3: Target Role Specification</span>
        </div>
      </div>

      {/* Verified Company Intel Card */}
      <div className="w-full max-w-3xl bg-[#161B29] border border-slate-800 rounded p-4 mb-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{company.name}</h3>
                <span className="text-[9px] font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/40 font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {company.source === 'db' ? 'Verified Database' : 'Verified Web Rubrics'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{company.industry}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {company.description}
        </p>

        {/* Culture & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block mb-1">Interview Evaluation Style</span>
            <p className="text-slate-200 text-xs leading-relaxed">{company.interviewStyle}</p>
          </div>
          <div>
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block mb-1">Core Values & Archetypes</span>
            <div className="flex flex-wrap gap-1">
              {company.keyValues.map((val, idx) => (
                <span key={idx} className="bg-[#0B0F1A] text-blue-400 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800">
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role & JD Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
        <div className="bg-[#161B29] border border-slate-800 rounded p-4 space-y-3.5">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-bold tracking-wider">
              Target Position / Role Title
            </label>
            <input
              id="input-role-title"
              type="text"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer, Staff ML Engineer, Product Manager"
              className="w-full px-3 py-2 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-100 outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                Job Description (Corpus for ATS Vectorization)
              </label>
              {defaultPreset && (
                <button
                  type="button"
                  onClick={() => {
                    setRoleTitle(defaultPreset.role);
                    setJobDescription(defaultPreset.jd);
                  }}
                  className="text-[11px] text-blue-400 hover:underline cursor-pointer font-mono"
                >
                  Load {company.name} Default JD
                </button>
              )}
            </div>
            <textarea
              id="textarea-job-description"
              required
              rows={7}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description or key responsibilities and requirements..."
              className="w-full p-3 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs font-mono text-slate-200 leading-relaxed outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          id="btn-run-ats-check"
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md transition-all"
        >
          <span>Run ATS Gap & Match Analysis vs {company.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

