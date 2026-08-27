import React, { useState, useEffect } from 'react';
import { 
  StepKey, 
  UserProfile, 
  CompanyProfile, 
  AtsResult, 
  InterviewQuestion, 
  AnswerCritique, 
  SessionEvaluation 
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
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from './data/sampleData';

export default function App() {
  // Session Navigation State
  const [currentStep, setCurrentStep] = useState<StepKey>('auth');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Candidate Data State
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES[0].text);
  const [resumeFileName, setResumeFileName] = useState<string>(SAMPLE_RESUMES[0].fileName);
  const [targetCompany, setTargetCompany] = useState<CompanyProfile | null>({
    name: 'Stripe',
    industry: 'Financial Technology / Infrastructure',
    description: 'Global developer-first payments infrastructure and money movement.',
    interviewStyle: 'Rigorous STAR behavioral, distributed systems, and real-time reliability.',
    keyValues: ['Users First', 'Rigorous Craft', 'Ownership & Velocity'],
    coreTechOrSkills: ['TypeScript', 'React', 'Distributed Systems', 'PostgreSQL'],
    source: 'db',
    verified: true
  });
  const [roleTitle, setRoleTitle] = useState<string>(SAMPLE_JOB_DESCRIPTIONS['Stripe']?.role || 'Senior Full-Stack Engineer');
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_JOB_DESCRIPTIONS['Stripe']?.jd || '');
  
  // ATS State
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [isAtsLoading, setIsAtsLoading] = useState<boolean>(false);

  // Interview & Session Evaluation State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [evaluatedSession, setEvaluatedSession] = useState<SessionEvaluation | null>(null);
  const [isEvaluatingFinalSession, setIsEvaluatingFinalSession] = useState<boolean>(false);

  // 1. Auth Login Handler
  const handleLoginSuccess = (user: UserProfile, isReturning: boolean) => {
    setCurrentUser(user);
    if (isReturning && user.savedResumeText && user.savedCompanyName) {
      setResumeText(user.savedResumeText);
      setResumeFileName(user.savedResumeFileName || 'Saved_Resume.pdf');
      setRoleTitle(user.savedRoleTitle || 'Senior Software Engineer');
      setJobDescription(user.savedJobDescription || '');
      
      // Auto hydrate company
      setTargetCompany({
        name: user.savedCompanyName,
        industry: 'Financial Technology / Infrastructure',
        description: 'Global developer-first payments infrastructure.',
        interviewStyle: 'Rigorous STAR behavioral & distributed systems coding.',
        keyValues: ['Users First', 'Rigorous Craft', 'Ownership'],
        coreTechOrSkills: ['TypeScript', 'React', 'Distributed Systems'],
        source: 'db',
        verified: true
      });

      // Returning users land on their home dashboard directly
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
      const res = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle,
          jobDescription,
          companyProfile: targetCompany,
          resumeText,
          focusArea: focusTitle
        })
      });
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to generate focused questions:', err);
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
      fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          resumeText: parsedResume,
          resumeFileName: fileName,
          companyName: company.name
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
      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: customJd || jobDescription,
          companyProfile: targetCompany,
          threshold
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAtsResult(data.result);
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
      fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          roleTitle,
          jobDescription,
          atsScore
        })
      }).catch(console.warn);
    }

    try {
      const res = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle,
          jobDescription,
          companyProfile: targetCompany,
          resumeText
        })
      });
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to generate interview questions:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // 6. Complete Interview -> Evaluate Full Session
  const handleFinishInterview = async (evaluatedAnswers: AnswerCritique[]) => {
    setIsEvaluatingFinalSession(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: targetCompany?.name || 'Target Company',
          roleTitle,
          answers: evaluatedAnswers
        })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluatedSession(data.evaluation);
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
              Session: <span className="text-slate-100 font-medium font-sans">{targetCompany ? `${roleTitle} @ ${targetCompany.name}` : (currentUser ? `${currentUser.name}'s Prep Hub` : 'Executive Calibration')}</span>
            </div>
          </div>

          <div className="flex items-center space-x-5">
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
              />
            </div>
          )}

          {/* STEP 2: HOME (DASHBOARD & STATISTICS VIEW) */}
          {currentStep === 'home' && (
            <HomeDashboardView
              currentUser={currentUser}
              targetCompany={targetCompany}
              roleTitle={roleTitle}
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
    </div>
  );
}
