import React, { useState } from 'react';
import { 
  UserProfile, 
  CompanyProfile, 
  AtsResult, 
  InterviewQuestion, 
  AnswerCritique, 
  SessionEvaluation 
} from '../types';
import { PrepStep } from './PrepStep';
import { JobDescriptionStep } from './JobDescriptionStep';
import { AtsCheckStep } from './AtsCheckStep';
import { InterviewStep } from './InterviewStep';
import { DashboardStep } from './DashboardStep';
import { 
  ArrowLeft, 
  Mic, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

export type InterviewStageSubStep = 'prep' | 'job_description' | 'ats_check' | 'live' | 'debrief';

interface InterviewSessionStageProps {
  currentUser: UserProfile | null;
  targetCompany: CompanyProfile | null;
  roleTitle: string;
  jobDescription: string;
  resumeText: string;
  resumeFileName: string;
  atsResult: AtsResult | null;
  isAtsLoading: boolean;
  questions: InterviewQuestion[];
  isGeneratingQuestions: boolean;
  evaluatedSession: SessionEvaluation | null;
  isEvaluatingFinalSession: boolean;
  initialSubStep?: InterviewStageSubStep;
  onBackToDashboard: () => void;
  onProceedToJobDescription: (parsedResume: string, fileName: string, company: CompanyProfile) => void;
  onProceedToAts: (selectedRole: string, selectedJd: string) => void;
  onRunAtsAnalysis: (threshold?: number, customRole?: string, customJd?: string) => void;
  onProceedToLiveInterview: (atsScore: number) => void;
  onFinishInterview: (evaluatedAnswers: AnswerCritique[]) => void;
  onRestartDrill: () => void;
  onSignOut: () => void;
}

export const InterviewSessionStage: React.FC<InterviewSessionStageProps> = ({
  currentUser,
  targetCompany,
  roleTitle,
  jobDescription,
  resumeText,
  resumeFileName,
  atsResult,
  isAtsLoading,
  questions,
  isGeneratingQuestions,
  evaluatedSession,
  isEvaluatingFinalSession,
  initialSubStep = 'prep',
  onBackToDashboard,
  onProceedToJobDescription,
  onProceedToAts,
  onRunAtsAnalysis,
  onProceedToLiveInterview,
  onFinishInterview,
  onRestartDrill,
  onSignOut
}) => {
  const [stageStep, setStageStep] = useState<InterviewStageSubStep>(initialSubStep);

  const stepsList = [
    { id: 'prep', label: '1. Resume & Intel', icon: FileText },
    { id: 'ats_check', label: '2. ATS Alignment', icon: BarChart3 },
    { id: 'live', label: '3. Live STAR Drill', icon: Mic },
    { id: 'debrief', label: '4. Evaluation Debrief', icon: CheckCircle2 }
  ];

  return (
    <div id="interview-room-stage" className="min-h-full flex flex-col font-sans">
      {/* Top Dedicated Interview Stage Bar */}
      <div className="bg-[#111827] border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        {/* Left: Return to Home Dashboard button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-return-dashboard"
            onClick={onBackToDashboard}
            className="px-3 py-1.5 rounded bg-[#0B0F1A] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span>← Home Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-slate-200">
              INTERVIEW STAGE: <span className="text-blue-400">{targetCompany?.name || 'Target Enterprise'}</span>
            </span>
          </div>
        </div>

        {/* Center/Right: Stage Progress Indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {stepsList.map((st) => {
            const Icon = st.icon;
            const isCurrent = (stageStep === st.id) || (st.id === 'prep' && stageStep === 'job_description');
            return (
              <div
                key={st.id}
                className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 font-bold'
                    : 'text-slate-500 bg-[#0B0F1A]/60 border border-slate-800/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Sub-Stage Body */}
      <div className="flex-1 p-4 md:p-6">
        {stageStep === 'prep' && (
          <PrepStep
            initialResumeText={resumeText}
            initialResumeFileName={resumeFileName}
            initialCompanyName={targetCompany?.name || ''}
            onProceedToJobDescription={(res, file, comp) => {
              onProceedToJobDescription(res, file, comp);
              setStageStep('job_description');
            }}
          />
        )}

        {stageStep === 'job_description' && targetCompany && (
          <JobDescriptionStep
            company={targetCompany}
            resumeFileName={resumeFileName}
            initialRoleTitle={roleTitle}
            initialJobDescription={jobDescription}
            onProceedToAts={(role, jd) => {
              onProceedToAts(role, jd);
              setStageStep('ats_check');
            }}
            onBack={() => setStageStep('prep')}
          />
        )}

        {stageStep === 'ats_check' && targetCompany && (
          <AtsCheckStep
            company={targetCompany}
            roleTitle={roleTitle}
            resumeText={resumeText}
            jobDescription={jobDescription}
            atsResult={atsResult}
            isLoading={isAtsLoading}
            onRunAtsAnalysis={onRunAtsAnalysis}
            onProceedToInterview={(score) => {
              onProceedToLiveInterview(score);
              setStageStep('live');
            }}
            onBackToJobDescription={() => setStageStep('job_description')}
          />
        )}

        {stageStep === 'live' && (
          isGeneratingQuestions ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight uppercase">
                Calibrating Interview Room for {targetCompany?.name || 'Target Enterprise'}...
              </h2>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Generating behavioral STAR questions matching {roleTitle} rubric and corporate leadership principles.
              </p>
            </div>
          ) : questions.length > 0 ? (
            <InterviewStep
              questions={questions}
              companyName={targetCompany?.name || 'Target Company'}
              onFinishInterview={(answers) => {
                onFinishInterview(answers);
                setStageStep('debrief');
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
              <p className="text-xs text-red-400 font-mono">No interview questions prepared. Return to setup step.</p>
              <button
                onClick={() => setStageStep('prep')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Back to Interview Setup
              </button>
            </div>
          )
        )}

        {stageStep === 'debrief' && (
          isEvaluatingFinalSession ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
              <div className="w-12 h-12 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-tight uppercase">
                Synthesizing Full Session Evaluation...
              </h2>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Analyzing STAR completeness, speech acoustics, word cadence, and corporate benchmark scoring.
              </p>
            </div>
          ) : evaluatedSession ? (
            <div className="space-y-4">
              {/* Top Banner indicating completion */}
              <div className="bg-green-950/20 border border-green-800/40 rounded p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-mono font-bold text-green-300 uppercase">
                    Session Drill Completed Successfully & Saved to Your Dashboard
                  </span>
                </div>
                <button
                  onClick={onBackToDashboard}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  Return to Home Dashboard →
                </button>
              </div>

              <DashboardStep
                evaluation={evaluatedSession}
                userId={currentUser?.id}
                onRestart={() => {
                  onRestartDrill();
                  setStageStep('prep');
                }}
                onSignOut={onSignOut}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px]">
              <p className="text-xs text-red-400 font-mono">No evaluation records available for this drill.</p>
              <button
                onClick={onBackToDashboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Return to Home Dashboard
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
