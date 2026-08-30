import React, { useState, useEffect } from 'react';
import { CompanyProfile, CompanyRole, CandidateTrack } from '../types';
import { safeFetchJson } from '../utils/api';
import { CANDIDATE_TRACKS, getQuestionCountForTrack } from '../utils/tracks';
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
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  Search,
  Check,
  Zap,
  Info,
  GraduationCap
} from 'lucide-react';

interface JobDescriptionStepProps {
  company: CompanyProfile;
  resumeFileName: string;
  initialRoleTitle?: string;
  initialJobDescription?: string;
  candidateTrack?: CandidateTrack;
  onProceedToAts: (roleTitle: string, jobDescription: string) => void;
  onBack: () => void;
}

export const JobDescriptionStep: React.FC<JobDescriptionStepProps> = ({
  company,
  resumeFileName,
  initialRoleTitle,
  initialJobDescription,
  candidateTrack = 'undergraduate',
  onProceedToAts,
  onBack
}) => {
  const activeTrack = CANDIDATE_TRACKS.find(t => t.id === candidateTrack) || CANDIDATE_TRACKS[0];
  const questionCount = getQuestionCountForTrack(candidateTrack);
  const rolesList: CompanyRole[] = company.availableRoles || [];

  // Default to the first available role if no initial role is passed
  const initialSelectedRole = rolesList.length > 0 
    ? (initialRoleTitle ? rolesList.find(r => r.roleTitle.toLowerCase() === initialRoleTitle.toLowerCase()) || rolesList[0] : rolesList[0])
    : null;

  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialSelectedRole?.id || 'custom');
  const [roleTitle, setRoleTitle] = useState<string>(
    initialRoleTitle || initialSelectedRole?.roleTitle || 'Senior Data Analyst — Product & Business Analytics'
  );
  const [jobDescription, setJobDescription] = useState<string>(
    initialJobDescription || initialSelectedRole?.sampleJd || `Role: ${roleTitle} at ${company.name}\n\nAbout the Role:\nDrive quantitative analytics, metrics frameworks, and executive decision-making at ${company.name}.\n\nKey Responsibilities:\n- Build and maintain dimensional data models and automated dashboards in Tableau or Looker.\n- Write complex SQL queries and conduct exploratory cohort analysis and A/B test readouts.\n- Collaborate closely with product managers and engineers to optimize user conversion and platform KPIs.\n\nRequirements:\n- 3+ years of experience with SQL, Python/R, and dimensional data modeling.\n- Strong expertise with statistical analysis, experiment design, and business metrics.`
  );

  const [isGeneratingJd, setIsGeneratingJd] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dynamicRoles, setDynamicRoles] = useState<CompanyRole[]>(rolesList);
  const [isFetchingRoles, setIsFetchingRoles] = useState(false);

  // If availableRoles were empty initially, fetch background roles
  useEffect(() => {
    if (dynamicRoles.length === 0) {
      fetchCompanyRoles();
    }
  }, [company.name]);

  const fetchCompanyRoles = async () => {
    setIsFetchingRoles(true);
    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; roles: CompanyRole[] }>(
        '/api/company/roles',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyName: company.name })
        }
      );
      if (success && data?.roles && data.roles.length > 0) {
        setDynamicRoles(data.roles);
        if (!initialRoleTitle || selectedRoleId === 'custom') {
          const first = data.roles[0];
          setSelectedRoleId(first.id);
          setRoleTitle(first.roleTitle);
          setJobDescription(first.sampleJd);
        }
      } else {
        console.warn("Background roles notice:", error);
      }
    } catch (err) {
      console.warn("Background roles fetch error:", err);
    } finally {
      setIsFetchingRoles(false);
    }
  };

  const handleRoleSelect = (role: CompanyRole) => {
    setSelectedRoleId(role.id);
    setRoleTitle(role.roleTitle);
    setJobDescription(role.sampleJd);
    setIsDropdownOpen(false);
  };

  const handleGenerateTailoredJd = async () => {
    if (!roleTitle.trim()) return;
    setIsGeneratingJd(true);
    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; sampleJd: string }>(
        '/api/company/generate-jd',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: company.name,
            roleTitle: roleTitle.trim(),
            companyProfile: company
          })
        }
      );
      if (success && data?.sampleJd) {
        setJobDescription(data.sampleJd);
      } else {
        console.warn("Generate JD notice:", error);
      }
    } catch (err) {
      console.warn("Error generating tailored JD:", err);
    } finally {
      setIsGeneratingJd(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || !jobDescription.trim()) return;
    onProceedToAts(roleTitle.trim(), jobDescription.trim());
  };

  const activeRoleObj = dynamicRoles.find(r => r.id === selectedRoleId);

  return (
    <div id="job-description-screen" className="max-w-4xl mx-auto py-4 px-2 flex flex-col items-center">
      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer font-mono uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prep</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161B29] border border-slate-800 text-slate-300 text-[10px] font-mono">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Track: <strong className="text-blue-400">{activeTrack.label.split('/')[0].trim()}</strong> ({questionCount} Qs)</span>
          </span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Stage 3: Target Role Specification</span>
          </div>
        </div>
      </div>

      {/* Expansive Corporate Intelligence Dossier */}
      <div className="w-full max-w-3xl bg-[#161B29] border border-slate-800 rounded p-5 mb-4 shadow-lg">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-100">{company.name}</h3>
                <span className="text-[9px] font-mono text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/40 font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {company.source === 'db' ? 'Verified Corporate Database' : 'Live Web Intelligence'}
                </span>
                {company.headquarters && (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    {company.headquarters}
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-400 font-medium">{company.industry}</p>
            </div>
          </div>
        </div>

        {/* Multi-paragraph Comprehensive Company Description */}
        <div className="text-xs text-slate-300 leading-relaxed space-y-2 mb-4 bg-[#0B0F1A] p-3.5 rounded border border-slate-800/80">
          {company.description.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Interview Evaluation Benchmarks & Cultural Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-blue-400" />
              Interview Evaluation Style
            </span>
            <p className="text-slate-200 text-xs leading-relaxed bg-[#0B0F1A]/60 p-2.5 rounded border border-slate-800/60">
              {company.interviewStyle}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Core Values & Leadership Rubrics
            </span>
            <div className="flex flex-wrap gap-1.5">
              {company.keyValues.map((val, idx) => (
                <span key={idx} className="bg-[#0B0F1A] text-blue-300 px-2.5 py-1 rounded text-[10px] font-mono border border-slate-800">
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Core Tech Stack */}
        {company.coreTechOrSkills && company.coreTechOrSkills.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block mb-1.5">
              Core Technical Stack & Competencies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {company.coreTechOrSkills.map((tech, idx) => (
                <span key={idx} className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Role & Accurate JD Form with Background Role Dropdown */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
        <div className="bg-[#161B29] border border-slate-800 rounded p-5 space-y-4">
          
          {/* Role Selection Dropdown from Verified Background Search */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>Select Verified Hiring Role at {company.name}</span>
              </label>
              {isFetchingRoles && (
                <span className="text-[10px] font-mono text-blue-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Searching open roles in background...
                </span>
              )}
            </div>

            {/* Interactive Dropdown Box */}
            <div className="relative">
              <button
                type="button"
                id="btn-select-hiring-role"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3.5 py-2.5 bg-[#0B0F1A] border border-slate-800 hover:border-blue-500/60 rounded text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs font-semibold text-slate-100 truncate">
                    {roleTitle || 'Select a verified job role...'}
                  </span>
                  {activeRoleObj && (
                    <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/30 text-blue-300 border border-blue-800/40">
                      {activeRoleObj.category}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>

              {/* Dropdown Menu Options */}
              {isDropdownOpen && (
                <div 
                  id="dropdown-hiring-roles"
                  className="absolute z-20 top-full mt-1.5 w-full bg-[#0D121F] border border-slate-700 rounded shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
                >
                  <div className="p-2 border-b border-slate-800 bg-[#0B0F1A] text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Available Open Positions ({dynamicRoles.length})</span>
                    <span className="text-blue-400">Click to auto-populate JD</span>
                  </div>

                  <div className="divide-y divide-slate-800/60">
                    {dynamicRoles.map((role) => {
                      const isSelected = selectedRoleId === role.id || roleTitle === role.roleTitle;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleSelect(role)}
                          className={`w-full text-left p-3 hover:bg-blue-900/20 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                            isSelected ? 'bg-blue-900/30 border-l-2 border-blue-500' : ''
                          }`}
                        >
                          <div className="space-y-1 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-100">
                                {role.roleTitle}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {role.category}
                              </span>
                              {role.level && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                                  {role.level}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                              {role.description}
                            </p>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}

                    {/* Custom Role Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleId('custom');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer font-mono text-xs ${
                        selectedRoleId === 'custom' ? 'bg-slate-800 text-blue-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span>+ Specify Custom Job Title</span>
                      {selectedRoleId === 'custom' && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Editable Position / Role Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                Active Role Title
              </label>
              <button
                type="button"
                onClick={handleGenerateTailoredJd}
                disabled={isGeneratingJd || !roleTitle.trim()}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingJd ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Synthesizing Authentic JD...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Auto-Tailor JD for this Title</span>
                  </>
                )}
              </button>
            </div>

            <input
              id="input-role-title"
              type="text"
              required
              value={roleTitle}
              onChange={(e) => {
                setRoleTitle(e.target.value);
                setSelectedRoleId('custom');
              }}
              placeholder="e.g. Senior Data Analyst — Product Analytics, Staff ML Engineer"
              className="w-full px-3.5 py-2 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs text-slate-100 outline-none transition-colors"
            />
          </div>

          {/* Authentic Job Description Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Job Description & Role Requirements</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {jobDescription.split(/\s+/).length} words
              </span>
            </div>

            <textarea
              id="textarea-job-description"
              required
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste or review the authentic job requirements, responsibilities, and qualifications..."
              className="w-full p-3.5 bg-[#0B0F1A] border border-slate-800 focus:border-blue-500 rounded text-xs font-mono text-slate-200 leading-relaxed outline-none"
            />
          </div>
        </div>

        {/* Submit to ATS */}
        <button
          id="btn-run-ats-check"
          type="submit"
          disabled={!roleTitle.trim() || !jobDescription.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-md transition-all"
        >
          <span>Run ATS Gap & Match Analysis vs {company.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
