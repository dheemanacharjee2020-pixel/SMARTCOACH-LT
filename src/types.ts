export type LanguageCode = 'en' | 'hi' | 'bn';

export type CandidateTrack = 
  | 'undergraduate'     // Undergraduate college student applying for a starting role / internship
  | 'postgraduate_mba'  // Postgraduate / MBA / University student applying for senior/accelerated roles
  | 'research_phd'      // Research category student (PhD / Postdoc / Lab Researcher / Scientist)
  | 'experienced_pro';  // Industry Experienced Professional / Lateral Hire

export interface TrackMetadata {
  id: CandidateTrack;
  label: string;
  badge: string;
  educationStage: string;
  progressionLevel: number;
  questionCount: number;
  expectedDurationMin: number;
  description: string;
  targetFocus: string;
  sampleRole: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isReturningUser?: boolean;
  lastSessionDate?: string;
  candidateTrack?: CandidateTrack;
  savedResumeText?: string;
  savedResumeFileName?: string;
  savedCompanyName?: string;
  savedRoleTitle?: string;
  savedJobDescription?: string;
  savedAtsScore?: number;
}

export interface CompanyRole {
  id?: string;
  roleTitle: string;
  category: 'Engineering' | 'Data & Analytics' | 'AI & Machine Learning' | 'Product & Strategy' | 'Infrastructure & Security' | 'Other';
  level?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  sampleJd: string;
}

export interface CompanyProfile {
  name: string;
  domain?: string;
  description: string;
  industry: string;
  headquarters?: string;
  interviewStyle: string;
  keyValues: string[];
  coreTechOrSkills: string[];
  availableRoles?: CompanyRole[];
  source: 'db' | 'web' | 'not_found';
  verified: boolean;
}

export interface AtsResult {
  matchScore: number;
  threshold: number;
  passed: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: string[];
  experienceAlignmentScore: number;
  recommendations: string[];
}

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  category: 'behavioral' | 'technical' | 'situational' | 'leadership' | 'system-design';
  questionText: string;
  contextOrGoal: string;
  suggestedStarHints?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export type StarStatus = 'Strong' | 'Adequate' | 'Weak' | 'Missing';

export interface StarQuadrant {
  present?: boolean;
  status: StarStatus;
  extractedSnippet?: string;
  critique: string;
  score?: number; // 0-100
}

export interface StarBreakdown {
  situation: StarQuadrant;
  task: StarQuadrant;
  action: StarQuadrant;
  result: StarQuadrant;
  missingOrWeakElements?: string[];
}

export interface SpeechMetrics {
  wpm: number;
  paceStatus: 'Slow' | 'Optimal' | 'Fast' | 'Too Fast' | 'Moderate';
  confidenceScore: number; // 0-100
  clarityScore: number; // 0-100
  fillerWordsCount: number;
  fillerWordsList: string[];
  durationSeconds: number;
  pauseCount: number;
}

export interface AnswerCritique {
  questionId: string;
  questionText: string;
  userTranscript: string;
  languageUsed: LanguageCode;
  contentScore: number; // 0-100
  behavioralScore: number; // 0-100
  overallScore: number; // 0-100
  speechMetrics: SpeechMetrics;
  starBreakdown: StarBreakdown;
  interviewerPersonaCritique: string;
  criticalFlaws: string[];
  modelAnswerExemplar: string;
}

export interface SessionEvaluation {
  id: string;
  timestamp: string;
  companyName: string;
  roleTitle: string;
  totalQuestions: number;
  overallScore: number;
  contentAverage: number;
  behavioralAverage: number;
  successLikelihood: {
    percentage: number; // strictly < 100%
    uncertaintyRange: number; // e.g. 6% (meaning ±6%)
    verdict: 'High Potential' | 'Moderate Competitiveness' | 'High Risk / Gaps Present' | 'Insufficient Evidence';
    probabilisticExplanation: string;
    disclaimer: string;
  };
  topImprovementAreas: (
    | string
    | {
        title: string;
        impact?: 'High' | 'Medium' | 'Critical' | string;
        starStage?: 'Situation' | 'Task' | 'Action' | 'Result' | 'Speech Delivery' | string;
        actionableAdvice?: string;
      }
  )[];
  targetRole?: string;
  successProbabilityPct?: number;
  uncertaintyMarginPct?: number;
  criticalCoachVerdict?: string;
  confidencePaceScore?: number;
  clarityScore?: number;
  starCompletenessScore?: number;
  sessionDate?: string;
  userId?: string;
  speechTrends: {
    averageWpm: number;
    averageClarity: number;
    averageConfidence: number;
    totalFillerWords: number;
    paceConsistency: string;
  };
  starCoverageMetrics: {
    situationScore: number;
    taskScore: number;
    actionScore: number;
    resultScore: number;
  };
  answers: AnswerCritique[];
}

export type StepKey = 
  | 'home' 
  | 'statistics' 
  | 'interview_stage' 
  | 'auth' 
  | 'returning_focus' 
  | 'prep' 
  | 'job_description' 
  | 'ats_check' 
  | 'interview' 
  | 'results';

export type CoachRigor = 'strict' | 'balanced' | 'supportive';
export type SpeechEngine = 'web_speech' | 'gemini_transcription';

export interface AppSettings {
  coachRigor: CoachRigor;
  strictStarScoring: boolean;
  followupProbing: boolean;
  speechEngine: SpeechEngine;
  targetWpm: number;
  enableTtsQuestionAudio: boolean;
  ttsSpeed: number;
  noiseSuppression: boolean;
  showCountdownTimer: boolean;
  timerDurationSeconds: number;
  autoAdvanceQuestions: boolean;
  showLiveTranscript: boolean;
  enableWaveformAnimation: boolean;
}
