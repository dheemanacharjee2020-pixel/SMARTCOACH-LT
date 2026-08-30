import React, { useState, useEffect } from 'react';
import { 
  StepKey, 
  UserProfile, 
  CompanyProfile, 
  AtsResult, 
  InterviewQuestion, 
  AnswerCritique, 
  SessionEvaluation,
  CandidateTrack
} from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthStep } from './components/AuthStep';
import { ReturningUserPrompt } from './components/ReturningUserPrompt';
import { HomeDashboardView } from './components/HomeDashboardView';
import { InterviewSessionStage } from './components/InterviewSessionStage';
import { AtsCheckStep } from './components/AtsCheckStep';
import { PrepStep } from './components/PrepStep';
import { JobDescriptionStep } from './components/JobDescriptionStep';
import { DashboardStep } from './components/DashboardStep';
import { ThemeToggle } from './components/ThemeToggle';
import { SettingsModal } from './components/SettingsModal';
import { useSettings } from './context/SettingsContext';
import { safeFetchJson, getFallbackInterviewQuestions } from './utils/api';
import { Settings } from 'lucide-react';

export default function App() {
  const { openSettings } = useSettings();

  // Session Navigation State
  const [currentStep, setCurrentStep] = useState<StepKey>('auth');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [candidateTrack, setCandidateTrack] = useState<CandidateTrack>('undergraduate');

  // Candidate Data State (Clean unpopulated initial state)
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [targetCompany, setTargetCompany] = useState<CompanyProfile | null>(null);
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  
  // ATS State
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [isAtsLoading, setIsAtsLoading] = useState<boolean>(false);

  // Interview & Session Evaluation State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [evaluatedSession, setEvaluatedSession] = useState<SessionEvaluation | null>(null);
  const [isEvaluatingFinalSession, setIsEvaluatingFinalSession] = useState<boolean>(false);

  // 1. Auth Login Handler
  const handleLoginSuccess = (user: UserProfile, isReturning: boolean, track?: CandidateTrack) => {
    setCurrentUser(user);
    if (track) {
      setCandidateTrack(track);
    } else if (user.candidateTrack) {
      setCandidateTrack(user.candidateTrack);
    }

    if (user.savedCompanyName) {
      setResumeText(user.savedResumeText || '');
      setResumeFileName(user.savedResumeFileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`);
      setRoleTitle(user.savedRoleTitle || (track === 'undergraduate' ? 'Software Engineer I (Campus Placement)' : 'Senior Engineer'));
      setJobDescription(user.savedJobDescription || '');
      
      // Auto hydrate company
      setTargetCompany({
        name: user.savedCompanyName,
        industry: 'Technology & Enterprise Solutions',
        description: `Target interview preparation for ${user.savedCompanyName}.`,
        interviewStyle: 'Structured STAR behavioral, analytical problem solving, and role competency.',
        keyValues: ['Customer Empathy', 'Technical Excellence', 'Team Leadership'],
        coreTechOrSkills: ['Problem Solving', 'Communication', 'Domain Mastery'],
        source: 'db',
        verified: true
      });

      setCurrentStep('home');
    } else {
      // First-time user onboarding
      setCurrentStep('home');
    }
  };

  // 2. Returning User Focus Selection (Shortcuts directly to interview or dashboard)
  const handleSelectReturningFocus = async (focusId: string, focusTitle: string) => {
    setIsGeneratingQuestions(true);
    setCurrentStep('interview_stage');

    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; questions: InterviewQuestion[] }>(
        '/api/interview/questions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleTitle,
            jobDescription,
            companyProfile: targetCompany,
            resumeText,
            focusArea: focusTitle,
            candidateTrack
          })
        }
      );

      if (success && data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        console.warn('API returned fallback needed for focused questions:', error);
        setQuestions(getFallbackInterviewQuestions(targetCompany?.name, roleTitle, focusTitle, candidateTrack));
      }
    } catch (err) {
      console.warn('Failed to generate focused questions, using fallback:', err);
      setQuestions(getFallbackInterviewQuestions(targetCompany?.name, roleTitle, focusTitle, candidateTrack));
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 3. Minimal Onboarding Prep -> Proceeds to Job Description
  const handleProceedToJobDescription = (parsedResume: string, fileName: string, company: CompanyProfile) => {
    setResumeText(parsedResume);
    setResumeFileName(fileName);
    setTargetCompany(company);

    // Save profile updates to backend
    if (currentUser?.id) {
      safeFetchJson('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          resumeText: parsedResume,
          resumeFileName: fileName,
          companyName: company.name,
          candidateTrack
        })
      }).catch(console.warn);
    }

    setCurrentStep('job_description');
  };

  // 4. Job Description & Role -> Runs ATS Analysis
  const handleProceedToAts = async (selectedRole: string, selectedJd: string) => {
    setRoleTitle(selectedRole);
    setJobDescription(selectedJd);
    setCurrentStep('ats_check');
    runAtsAnalysis(60, selectedRole, selectedJd);
  };

  const runAtsAnalysis = async (threshold: number = 60, customRole?: string, customJd?: string) => {
    setIsAtsLoading(true);
    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; result: AtsResult }>(
        '/api/ats/analyze',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText,
            jobDescription: customJd || jobDescription,
            companyProfile: targetCompany,
            threshold,
            candidateTrack
          })
        }
      );
      if (success && data?.result) {
        setAtsResult(data.result);
      } else {
        console.warn('ATS Analysis notice:', error);
      }
    } catch (err) {
      console.error('ATS Analysis error:', err);
    } finally {
      setIsAtsLoading(false);
    }
  };

  // 5. Proceed into Interview from ATS
  const handleProceedToInterview = async (atsScore?: number) => {
    setIsGeneratingQuestions(true);
    setCurrentStep('interview_stage');

    // Save updated score to user profile
    if (currentUser?.id && atsScore) {
      safeFetchJson('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          roleTitle,
          jobDescription,
          atsScore,
          candidateTrack
        })
      }).catch(console.warn);
    }

    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; questions: InterviewQuestion[] }>(
        '/api/interview/questions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleTitle,
            jobDescription,
            companyProfile: targetCompany,
            resumeText,
            candidateTrack
          })
        }
      );

      if (success && data?.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        console.warn('API question generation returned notice, activating curated rubric:', error);
        setQuestions(getFallbackInterviewQuestions(targetCompany?.name, roleTitle, undefined, candidateTrack));
      }
    } catch (err) {
      console.warn('Failed to generate interview questions, using rubric fallback:', err);
      setQuestions(getFallbackInterviewQuestions(targetCompany?.name, roleTitle, undefined, candidateTrack));
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 6. Complete Interview -> Evaluate Full Session
  const handleFinishInterview = async (evaluatedAnswers: AnswerCritique[]) => {
    setIsEvaluatingFinalSession(true);

    try {
      const { success, data, error } = await safeFetchJson<{ success: boolean; evaluation: SessionEvaluation }>(
        '/api/interview/evaluate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: targetCompany?.name || 'Target Company',
            roleTitle,
            answers: evaluatedAnswers,
            candidateTrack
          })
        }
      );

      if (success && data?.evaluation) {
        setEvaluatedSession(data.evaluation);
      } else {
        console.warn('Evaluation response notice:', error);
      }
    } catch (err) {
      console.error('Failed to evaluate session:', err);
    } finally {
      setIsEvaluatingFinalSession(false);
    }
  };

  // End Session / Sign Out
  const handleEndSession = () => {
    setCurrentStep('auth');
    setCurrentUser(null);
    setAtsResult(null);
    setQuestions([]);
    setEvaluatedSession(null);
  };

  // Navigation from Sidebar
  const handleSidebarNavigate = (step: StepKey) => {
    if (step === 'prep' && currentUser?.isReturningUser) {
      setCurrentStep('returning_focus');
    } else {
      setCurrentStep(step);
    }
  };

  const isInterviewLiveActive = currentStep === 'interview_stage' || currentStep === 'interview';

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 flex flex-col md:flex-row antialiased selection:bg-blue-600/30 selection:text-blue-300 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar
        currentStep={currentStep}
        onNavigate={handleSidebarNavigate}
        currentUser={currentUser}
        onEndSession={handleEndSession}
        isInterviewActive={isInterviewLiveActive}
      />

      {/* Mobile Top Header */}
      <Header
        currentStep={currentStep}
        onNavigate={handleSidebarNavigate}
        currentUser={currentUser}
        onEndSession={handleEndSession}
        isInterviewActive={isInterviewLiveActive}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col overflow-x-hidden">
        {/* Desktop Top High Density Header */}
        <header className="hidden md:flex h-14 border-b border-slate-800 bg-[#111827] items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 px-3 py-1 rounded text-xs font-bold tracking-tighter uppercase text-white">
              SmartCoach LT
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="text-xs text-slate-400 font-mono">
              Session: <span className="text-slate-100 font-medium font-sans">{targetCompany ? `${roleTitle} @ ${targetCompany.name}` : (currentUser ? `${currentUser.name}'s Prep Hub` : 'Interview Calibration')}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle variant="pill" />

            <button
              id="btn-desktop-settings"
              onClick={openSettings}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
              aria-label="Open Settings"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span>Settings</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isInterviewLiveActive ? 'bg-blue-500 animate-ping' : 'bg-green-500'}`}></div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                {isInterviewLiveActive ? 'Live Drill Active' : 'System Ready'}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-mono font-bold text-slate-200">
              {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AI'}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* STEP 1: AUTHENTICATION */}
          {currentStep === 'auth' && (
            <div className="p-4 md:p-6 flex-1 flex flex-col justify-center">
              <AuthStep
                onLoginSuccess={handleLoginSuccess}
                currentUser={currentUser}
                candidateTrack={candidateTrack}
                onSelectCandidateTrack={setCandidateTrack}
              />
            </div>
          )}

          {/* STEP 2: HOME (DASHBOARD & STATISTICS VIEW) */}
          {currentStep === 'home' && (
            <HomeDashboardView
              currentUser={currentUser}
              targetCompany={targetCompany}
              roleTitle={roleTitle}
              candidateTrack={candidateTrack}
              onSelectCandidateTrack={setCandidateTrack}
              latestEvaluation={evaluatedSession}
              onStartInterview={() => handleProceedToInterview()}
              onOpenAtsCheck={() => setCurrentStep('ats_check')}
              onOpenPrep={() => setCurrentStep('prep')}
              onInspectSession={(session) => {
                setEvaluatedSession(session);
                setCurrentStep('results');
              }}
              initialSubTab="overview"
            />
          )}

          {/* STEP 3: STATISTICS & TRENDS DIRECT VIEW */}
          {currentStep === 'statistics' && (
            <HomeDashboardView
              currentUser={currentUser}
              targetCompany={targetCompany}
              roleTitle={roleTitle}
              candidateTrack={candidateTrack}
              onSelectCandidateTrack={setCandidateTrack}
              latestEvaluation={evaluatedSession}
              onStartInterview={() => handleProceedToInterview()}
              onOpenAtsCheck={() => setCurrentStep('ats_check')}
              onOpenPrep={() => setCurrentStep('prep')}
              onInspectSession={(session) => {
                setEvaluatedSession(session);
                setCurrentStep('results');
              }}
              initialSubTab="statistics"
            />
          )}

          {/* STEP 4: DEDICATED INTERVIEW STAGE ROOM */}
          {(currentStep === 'interview_stage' || currentStep === 'interview') && (
            <InterviewSessionStage
              currentUser={currentUser}
              targetCompany={targetCompany}
              roleTitle={roleTitle}
              jobDescription={jobDescription}
              resumeText={resumeText}
              resumeFileName={resumeFileName}
              atsResult={atsResult}
              isAtsLoading={isAtsLoading}
              questions={questions}
              isGeneratingQuestions={isGeneratingQuestions}
              evaluatedSession={evaluatedSession}
              isEvaluatingFinalSession={isEvaluatingFinalSession}
              candidateTrack={candidateTrack}
              onSelectCandidateTrack={setCandidateTrack}
              initialSubStep={questions.length > 0 ? 'live' : 'prep'}
              onBackToDashboard={() => setCurrentStep('home')}
              onProceedToJobDescription={handleProceedToJobDescription}
              onProceedToAts={handleProceedToAts}
              onRunAtsAnalysis={runAtsAnalysis}
              onProceedToLiveInterview={handleProceedToInterview}
              onFinishInterview={handleFinishInterview}
              onRestartDrill={() => handleProceedToInterview()}
              onSignOut={handleEndSession}
            />
          )}

          {/* RETURNING USER FOCUS PROMPT */}
          {currentStep === 'returning_focus' && currentUser && (
            <div className="p-4 md:p-6 flex-1">
              <ReturningUserPrompt
                user={currentUser}
                onSelectFocus={handleSelectReturningFocus}
                onResetToFullOnboarding={() => setCurrentStep('prep')}
                onViewSavedDashboard={() => setCurrentStep('home')}
              />
            </div>
          )}

          {/* TARGET & RESUME SETUP */}
          {currentStep === 'prep' && (
            <div className="p-4 md:p-6 flex-1">
              <PrepStep
                initialResumeText={resumeText}
                initialResumeFileName={resumeFileName}
                initialCompanyName={targetCompany?.name || ''}
                candidateTrack={candidateTrack}
                onSelectCandidateTrack={setCandidateTrack}
                onProceedToJobDescription={handleProceedToJobDescription}
              />
            </div>
          )}

          {/* JOB DESCRIPTION STEP */}
          {currentStep === 'job_description' && targetCompany && (
            <div className="p-4 md:p-6 flex-1">
              <JobDescriptionStep
                company={targetCompany}
                resumeFileName={resumeFileName}
                initialRoleTitle={roleTitle}
                initialJobDescription={jobDescription}
                candidateTrack={candidateTrack}
                onProceedToAts={handleProceedToAts}
                onBack={() => setCurrentStep('prep')}
              />
            </div>
          )}

          {/* ATS PRE-SCREEN ANALYSIS */}
          {currentStep === 'ats_check' && targetCompany && (
            <div className="p-4 md:p-6 flex-1">
              <AtsCheckStep
                company={targetCompany}
                roleTitle={roleTitle}
                resumeText={resumeText}
                jobDescription={jobDescription}
                atsResult={atsResult}
                isLoading={isAtsLoading}
                candidateTrack={candidateTrack}
                onRunAtsAnalysis={runAtsAnalysis}
                onProceedToInterview={handleProceedToInterview}
                onBackToJobDescription={() => setCurrentStep('job_description')}
              />
            </div>
          )}

          {/* STANDALONE SESSION DEBRIEF / REPORT INSPECT */}
          {currentStep === 'results' && evaluatedSession && (
            <div className="p-4 md:p-6 flex-1">
              <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep('home')}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer bg-[#161B29] px-3 py-1.5 rounded border border-slate-800"
                >
                  <span>← Back to Home Dashboard</span>
                </button>
              </div>
              <DashboardStep
                evaluation={evaluatedSession}
                userId={currentUser?.id}
                onRestart={() => handleProceedToInterview()}
                onSignOut={handleEndSession}
              />
            </div>
          )}
        </main>
      </div>

      {/* Persistent Settings Modal */}
      <SettingsModal />
    </div>
  );
}
