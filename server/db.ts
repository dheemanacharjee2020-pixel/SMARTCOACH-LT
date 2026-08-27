import { CompanyProfile, UserProfile, SessionEvaluation } from '../src/types';

// Pre-seeded internal verified companies database
export const internalCompanyDatabase: Record<string, CompanyProfile> = {
  'google': {
    name: 'Google',
    domain: 'google.com',
    industry: 'Technology / Cloud / AI',
    description: 'A global technology leader focusing on search, cloud computing, artificial intelligence, online advertising, and consumer electronics.',
    interviewStyle: 'Rigorous behavioral interviews using Googleyness & Leadership principles. Emphasizes structured problem-solving, scale, metrics, and STAR method precision.',
    keyValues: ['Googleyness', 'Bias for Action', 'Collaborative Leadership', 'Scale-Oriented Engineering', 'Focus on the User'],
    coreTechOrSkills: ['Distributed Systems', 'System Design', 'Algorithmic Efficiency', 'Cross-Functional Collaboration', 'Data-Driven Decision Making'],
    source: 'db',
    verified: true,
  },
  'stripe': {
    name: 'Stripe',
    domain: 'stripe.com',
    industry: 'Financial Technology / Developer Infrastructure',
    description: 'Financial infrastructure platform powering internet commerce, global payments, and financial services.',
    interviewStyle: 'Pragmatic, execution-heavy interviews. Evaluates written clarity, real-world debugging, rigorous communication, and operating with extreme precision.',
    keyValues: ['Users First', 'Move Fast and Iterate', 'Rigorous Craftsmanship', 'Think Rigorously', 'Global Optimism'],
    coreTechOrSkills: ['API Design', 'System Reliability', 'Fintech Compliance', 'Clear Technical Communication', 'Pragmatic Engineering'],
    source: 'db',
    verified: true,
  },
  'microsoft': {
    name: 'Microsoft',
    domain: 'microsoft.com',
    industry: 'Enterprise Software / Cloud / AI',
    description: 'Global developer of enterprise platforms, cloud services (Azure), productivity software, gaming, and artificial intelligence solutions.',
    interviewStyle: 'Competency-based behavioral rounds focused on Growth Mindset, customer obsession, and systems scalability.',
    keyValues: ['Growth Mindset', 'Customer Obsession', 'Diversity and Inclusion', 'One Microsoft', 'Making a Difference'],
    coreTechOrSkills: ['Cloud Architecture', 'Customer Empathy', 'Cross-Team Collaboration', 'Scalable Code Quality'],
    source: 'db',
    verified: true,
  },
  'amazon': {
    name: 'Amazon',
    domain: 'amazon.com',
    industry: 'E-Commerce / Cloud Computing / Logistics',
    description: 'World leader in cloud infrastructure (AWS), e-commerce logistics, digital streaming, and automated supply chains.',
    interviewStyle: 'Strict Leadership Principles (LP) STAR interrogation by a dedicated Bar Raiser. Expect deep probing into metrics, ownership, and disagree & commit.',
    keyValues: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Are Right, A Lot', 'Bias for Action', 'Deliver Results'],
    coreTechOrSkills: ['AWS', 'Operational Excellence', 'Metrics-Driven Results', 'Root Cause Analysis (5 Whys)'],
    source: 'db',
    verified: true,
  },
  'netflix': {
    name: 'Netflix',
    domain: 'netflix.com',
    industry: 'Streaming Entertainment & High-Scale Media',
    description: 'Leading subscription streaming service and content studio operating global streaming infrastructure.',
    interviewStyle: 'Culture memo-aligned interviews assessing high talent density, context over control, direct candid feedback, and stunning colleagues.',
    keyValues: ['Freedom and Responsibility', 'Context Not Control', 'Highly Aligned Loosely Coupled', 'Stunning Colleagues', 'Direct Candor'],
    coreTechOrSkills: ['Microservices', 'High-Throughput Distributed Systems', 'Self-Direction', 'High-Ownership Judgement'],
    source: 'db',
    verified: true,
  },
  'meta': {
    name: 'Meta',
    domain: 'meta.com',
    industry: 'Social Technologies, AI & Virtual Reality',
    description: 'Builder of technologies that help people connect, find communities, and grow businesses across Instagram, WhatsApp, and Quest.',
    interviewStyle: 'Signal-driven behavioral and architecture interviews assessing Move Fast, Be Bold, and executing under high ambiguity.',
    keyValues: ['Move Fast', 'Focus on Long-Term Impact', 'Build Awesome Things', 'Live in the Future', 'Be Direct and Respectful'],
    coreTechOrSkills: ['Large Scale Systems', 'Product Sense', 'Rapid Iteration', 'Async Communication'],
    source: 'db',
    verified: true,
  },
  'apple': {
    name: 'Apple',
    domain: 'apple.com',
    industry: 'Consumer Hardware, Operating Systems & Services',
    description: 'Creator of iPhone, Mac, iOS, Apple Silicon, and privacy-centric ecosystem services.',
    interviewStyle: 'Deep domain mastery, confidentiality, fanatic attention to detail, and cross-functional alignment.',
    keyValues: ['Attention to Detail', 'User Privacy', 'Simplicity', 'End-to-End Excellence'],
    coreTechOrSkills: ['Performance Optimization', 'Clean Architecture', 'Deep Technical Craftsmanship'],
    source: 'db',
    verified: true,
  },
  'goldman sachs': {
    name: 'Goldman Sachs',
    domain: 'goldmansachs.com',
    industry: 'Investment Banking & Financial Markets',
    description: 'Global financial institution providing investment banking, securities, asset management, and risk analysis.',
    interviewStyle: 'High-pressure case scenarios evaluating risk management, quantitative rigor, integrity, and client presentation skills.',
    keyValues: ['Client Service', 'Integrity', 'Excellence', 'Partnership'],
    coreTechOrSkills: ['Risk Modeling', 'Low-Latency Architecture', 'Financial Compliance', 'Analytical Rigor'],
    source: 'db',
    verified: true,
  },
  'uber': {
    name: 'Uber',
    domain: 'uber.com',
    industry: 'Mobility & Delivery Marketplace',
    description: 'On-demand platform connecting riders, drivers, couriers, and merchants globally in real-time.',
    interviewStyle: 'Real-time marketplace dynamics, fast problem decomposition, resilience, and operational scaling.',
    keyValues: ['Go Get It', 'Trip Zero', 'Build with Heart', 'Great Minds Do Not Think Alike'],
    coreTechOrSkills: ['Real-Time Geospatial Systems', 'Dispatch Algorithms', 'High Availability', 'Pragmatism'],
    source: 'db',
    verified: true,
  },
  'tesla': {
    name: 'Tesla',
    domain: 'tesla.com',
    industry: 'Automotive, Autonomous Systems & Energy',
    description: 'Accelerating the world transition to sustainable energy through electric vehicles, energy storage, and AI robotics.',
    interviewStyle: 'First-principles thinking, intense work ethic, rapid problem solving, and ability to handle extreme constraints.',
    keyValues: ['First Principles Reasoning', 'Extreme Urgency', 'Direct Communication', 'Hands-On Problem Solving'],
    coreTechOrSkills: ['Hardware-Software Integration', 'Computer Vision / Robotics', 'Optimization', 'Speed of Execution'],
    source: 'db',
    verified: true,
  },
  'mckinsey': {
    name: 'McKinsey & Company',
    domain: 'mckinsey.com',
    industry: 'Management Consulting & Strategic Advisory',
    description: 'Global management consulting firm advising top corporations and institutions on strategy, digital transformation, and operations.',
    interviewStyle: 'Rigid Case Interview framework and Personal Experience Interview (PEI) assessing leadership, structured problem decomposition, and MECE logic.',
    keyValues: ['Obligation to Dissent', 'Client First', 'Top-down Communication', 'Structured Problem Solving'],
    coreTechOrSkills: ['MECE Frameworks', 'Hypothesis-Driven Synthesis', 'Executive Presence', 'Quant Analysis'],
    source: 'db',
    verified: true,
  }
};

// Demo users to allow seamless testing of both first-time and returning user flows
export const seedUsers: Record<string, UserProfile> = {
  'demo-new': {
    id: 'user_new_01',
    name: 'Jordan Miller',
    email: 'jordan.miller@example.com',
    isReturningUser: false,
  },
  'demo-returning': {
    id: 'user_returning_01',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    isReturningUser: true,
    lastSessionDate: '2026-08-25',
    savedCompanyName: 'Stripe',
    savedRoleTitle: 'Senior Full-Stack Engineer',
    savedResumeFileName: 'Alex_Chen_Staff_Engineer_Resume.pdf',
    savedAtsScore: 78,
    savedResumeText: `ALEX CHEN - Senior Full-Stack Engineer (7+ Years Experience)
Summary: Proven track record designing scalable web applications, distributed APIs, and resilient payment workflows.
Skills: TypeScript, React, Node.js, PostgreSQL, Redis, AWS, Kubernetes, Distributed Systems, Performance Optimization, STAR-based Team Leadership.
Experience:
- Staff Engineer at PayFlow (2022 - Present): Led migration to micro-frontends and event-driven payment processing, reducing P99 latency by 35% and supporting $400M in annual transactions.
- Senior Frontend Developer at CloudScale (2019 - 2022): Architected design system and real-time dashboard used by 120k monthly active enterprise users. Mentored 6 junior engineers.
- Software Engineer at DataSync (2017 - 2019): Built automated CI/CD pipelines and GraphQL gateway.
Education: B.S. Computer Science, University of Washington.`,
    savedJobDescription: `Role: Senior Full-Stack Engineer at Stripe
Responsibilities:
- Design, build, and maintain core APIs, user-facing dashboards, and reliable payment infrastructure.
- Collaborate with product managers, designers, and infrastructure teams to launch developer-first fintech tools.
- Lead technical architecture decisions and champion code craft, testing, and operational excellence.
Requirements:
- 5+ years of experience building high-traffic production web applications.
- Strong proficiency in modern TypeScript/JavaScript, React, Node.js, and relational databases.
- Experience with distributed systems, high availability, and API security.
- Exceptional structured communication and problem-solving skills.`
  }
};

// Pre-seeded historical sessions for multi-session trend analysis
export const initialHistoricalSessions: SessionEvaluation[] = [
  {
    id: 'session_hist_01',
    userId: 'user_returning_01',
    companyName: 'Meta',
    roleTitle: 'Software Engineer (Product Infra)',
    timestamp: '2026-08-10T14:30:00.000Z',
    sessionDate: '2026-08-10',
    totalQuestions: 3,
    overallScore: 64,
    contentAverage: 65,
    behavioralAverage: 63,
    successLikelihood: {
      percentage: 52,
      uncertaintyRange: 8,
      verdict: 'High Risk / Gaps Present',
      probabilisticExplanation: 'Candidate demonstrated adequate domain knowledge but rushed delivery (168 WPM) and frequently omitted measurable quantitative outcomes in Result sections.',
      disclaimer: 'Probabilistic simulation based on historical Meta hiring bar criteria.'
    },
    successProbabilityPct: 52,
    uncertaintyMarginPct: 8,
    criticalCoachVerdict: 'Rushed delivery pace (168 WPM). Failed to establish specific baseline metrics before detailing technical interventions. High filler word frequency.',
    confidencePaceScore: 68,
    clarityScore: 74,
    starCompletenessScore: 58,
    topImprovementAreas: [
      {
        title: 'Quantify baseline and final results',
        impact: 'Critical',
        starStage: 'Result',
        actionableAdvice: 'State exact percentage improvements and latency numbers rather than generic "it was faster".'
      },
      {
        title: 'Slow down cadence under pressure',
        impact: 'High',
        starStage: 'Speech Delivery',
        actionableAdvice: 'Target 130-145 WPM to convey executive composure.'
      },
      {
        title: 'Define task constraints explicitly',
        impact: 'Medium',
        starStage: 'Task',
        actionableAdvice: 'Specify deadlines, SLA commitments, and team constraints.'
      }
    ],
    speechTrends: {
      averageWpm: 168,
      averageClarity: 74,
      averageConfidence: 70,
      totalFillerWords: 9,
      paceConsistency: 'Rushed / Variable'
    },
    starCoverageMetrics: {
      situationScore: 70,
      taskScore: 55,
      actionScore: 65,
      resultScore: 42
    },
    answers: [
      {
        questionId: 'q_hist1_1',
        questionText: 'Tell me about a time when you resolved a high-severity production outage.',
        userTranscript: 'At my company, we had a major outage where our redis cluster ran out of memory. I jumped in, looked at the logs, wrote a script to flush old keys, and we got it back up pretty fast. Everyone was happy.',
        languageUsed: 'en',
        contentScore: 65,
        behavioralScore: 62,
        overallScore: 63,
        speechMetrics: {
          wpm: 168,
          paceStatus: 'Too Fast',
          confidenceScore: 68,
          clarityScore: 74,
          fillerWordsCount: 9,
          fillerWordsList: ['um', 'like', 'pretty much', 'you know'],
          durationSeconds: 38,
          pauseCount: 1
        },
        starBreakdown: {
          situation: { status: 'Adequate', critique: 'Mentioned Redis memory issue, but lacked scope of customer impact.' },
          task: { status: 'Weak', critique: 'No explicit ownership boundary or SLA timeline stated.' },
          action: { status: 'Adequate', critique: 'Scripting key eviction was mentioned, but lacks architectural prevention.' },
          result: { status: 'Weak', critique: 'Vague "got it back up fast" lacks exact MTTR (Mean Time to Resolution) and prevention metrics.' }
        },
        criticalFlaws: ['No concrete metrics for downtime duration or revenue at risk.', 'Speech pace was excessively rapid (168 WPM).'],
        interviewerPersonaCritique: 'An enterprise engineer must specify MTTR reduction and permanent architectural safeguards, not just temporary key flushing.',
        modelAnswerExemplar: 'During Black Friday traffic at PayFlow, our tier-1 Redis cache hit 98% memory capacity, risking $120k/minute in rejected authorizations...'
      }
    ]
  },
  {
    id: 'session_hist_02',
    userId: 'user_returning_01',
    companyName: 'Amazon',
    roleTitle: 'Senior Software Engineer (AWS Distributed Systems)',
    timestamp: '2026-08-16T10:15:00.000Z',
    sessionDate: '2026-08-16',
    totalQuestions: 3,
    overallScore: 72,
    contentAverage: 74,
    behavioralAverage: 70,
    successLikelihood: {
      percentage: 65,
      uncertaintyRange: 7,
      verdict: 'Moderate Competitiveness',
      probabilisticExplanation: 'Solid improvement in Task framing and Amazon Leadership Principle alignment. Speech pace moderated to 154 WPM with cleaner transitions.',
      disclaimer: 'Probabilistic simulation against Amazon Bar Raiser rubrics.'
    },
    successProbabilityPct: 65,
    uncertaintyMarginPct: 7,
    criticalCoachVerdict: 'Noticeable reduction in filler words (down to 6). Task constraints were clearly stated, but Result section still needs tighter customer impact numbers.',
    confidencePaceScore: 76,
    clarityScore: 82,
    starCompletenessScore: 69,
    topImprovementAreas: [
      {
        title: 'Incorporate 5-Whys Root Cause in Result',
        impact: 'High',
        starStage: 'Result',
        actionableAdvice: 'Amazon interviewers look for systemic prevention mechanisms.'
      },
      {
        title: 'Refine pacing to 135-145 WPM',
        impact: 'Medium',
        starStage: 'Speech Delivery',
        actionableAdvice: 'Still slightly brisk during complex technical explanations.'
      }
    ],
    speechTrends: {
      averageWpm: 154,
      averageClarity: 82,
      averageConfidence: 78,
      totalFillerWords: 6,
      paceConsistency: 'Moderate / Slightly Fast'
    },
    starCoverageMetrics: {
      situationScore: 78,
      taskScore: 72,
      actionScore: 74,
      resultScore: 52
    },
    answers: [
      {
        questionId: 'q_hist2_1',
        questionText: 'Give an example of a time you showed customer obsession by diving deep into a difficult bug.',
        userTranscript: 'At PayFlow, enterprise customers were reporting intermittent webhook delivery timeouts. I was tasked with finding the root cause within a 48-hour SLA. I traced distributed spans in OpenTelemetry, identified TCP connection pool exhaustion on our egress proxy, and increased keep-alive pooling. Timeout errors dropped significantly.',
        languageUsed: 'en',
        contentScore: 75,
        behavioralScore: 71,
        overallScore: 73,
        speechMetrics: {
          wpm: 154,
          paceStatus: 'Moderate',
          confidenceScore: 78,
          clarityScore: 82,
          fillerWordsCount: 6,
          fillerWordsList: ['like', 'um'],
          durationSeconds: 46,
          pauseCount: 2
        },
        starBreakdown: {
          situation: { status: 'Strong', critique: 'Concrete customer issue identified with enterprise impact.' },
          task: { status: 'Strong', critique: 'Clear 48-hour SLA constraint established.' },
          action: { status: 'Strong', critique: 'Detailed OpenTelemetry trace analysis and TCP socket configuration.' },
          result: { status: 'Adequate', critique: 'Mentioned drop in timeouts, but should give exact error percentage reduction (e.g. from 4.2% to 0.01%).' }
        },
        criticalFlaws: ['Result lacked exact numerical error drop.'],
        interviewerPersonaCritique: 'Great technical depth and ownership. Close the loop with exact metrics on error rates.',
        modelAnswerExemplar: 'At PayFlow, 14 enterprise merchants experienced 504 Gateway Timeouts during peak settlement periods...'
      }
    ]
  },
  {
    id: 'session_hist_03',
    userId: 'user_returning_01',
    companyName: 'Stripe',
    roleTitle: 'Senior Full-Stack Engineer (Payments Platform)',
    timestamp: '2026-08-22T16:00:00.000Z',
    sessionDate: '2026-08-22',
    totalQuestions: 4,
    overallScore: 80,
    contentAverage: 82,
    behavioralAverage: 78,
    successLikelihood: {
      percentage: 76,
      uncertaintyRange: 5,
      verdict: 'High Potential',
      probabilisticExplanation: 'Candidate demonstrated rigorous technical precision, structured STAR flow, and well-controlled speech pace (142 WPM) with minimal verbal friction.',
      disclaimer: 'Probabilistic simulation calibrated to Stripe Engineering leveling.'
    },
    successProbabilityPct: 76,
    uncertaintyMarginPct: 5,
    criticalCoachVerdict: 'Strong performance. Delivery pace is in the optimal executive zone (142 WPM). Quantified business impact reached $400M volume metrics. Minor opportunity in framing cross-functional tradeoffs.',
    confidencePaceScore: 85,
    clarityScore: 89,
    starCompletenessScore: 78,
    topImprovementAreas: [
      {
        title: 'Explicitly contrast technical tradeoffs',
        impact: 'Medium',
        starStage: 'Action',
        actionableAdvice: 'Discuss why you rejected alternative architectural approaches before settling on the solution.'
      },
      {
        title: 'Maintain 1-second strategic pauses',
        impact: 'Medium',
        starStage: 'Speech Delivery',
        actionableAdvice: 'Pause before answering complex follow-up questions to formulate key bullets.'
      }
    ],
    speechTrends: {
      averageWpm: 142,
      averageClarity: 89,
      averageConfidence: 86,
      totalFillerWords: 3,
      paceConsistency: 'Optimal & Steady'
    },
    starCoverageMetrics: {
      situationScore: 84,
      taskScore: 80,
      actionScore: 82,
      resultScore: 72
    },
    answers: [
      {
        questionId: 'q_hist3_1',
        questionText: 'Describe a situation where you had to balance technical debt against urgent feature delivery.',
        userTranscript: 'During our Q3 checkout modernization at PayFlow, we had 3 weeks to deliver multi-currency support for a $50M merchant expansion while our core ledger was suffering from unindexed queries. As lead engineer, I negotiated a phased release: week 1 dedicated to ledger index partitioning which brought query latency from 850ms down to 42ms, and weeks 2-3 delivering the multi-currency API on top of the stabilized database.',
        languageUsed: 'en',
        contentScore: 82,
        behavioralScore: 79,
        overallScore: 81,
        speechMetrics: {
          wpm: 142,
          paceStatus: 'Optimal',
          confidenceScore: 87,
          clarityScore: 90,
          fillerWordsCount: 3,
          fillerWordsList: ['um'],
          durationSeconds: 52,
          pauseCount: 3
        },
        starBreakdown: {
          situation: { status: 'Strong', critique: 'Clear revenue stakes ($50M expansion) and technical debt pressure.' },
          task: { status: 'Strong', critique: '3-week timeline and phased deliverable scope clearly articulated.' },
          action: { status: 'Strong', critique: 'Index partitioning and proactive stakeholder negotiation.' },
          result: { status: 'Strong', critique: 'Measurable latency reduction (850ms -> 42ms) and on-time rollout.' }
        },
        criticalFlaws: [],
        interviewerPersonaCritique: 'Exemplary STAR execution with clear business outcomes and technical ownership.',
        modelAnswerExemplar: 'During our Q3 checkout modernization at PayFlow, we were balancing a $50M merchant expansion deadline with an unindexed database bottleneck...'
      }
    ]
  },
  {
    id: 'session_hist_04',
    userId: 'user_returning_01',
    companyName: 'Google',
    roleTitle: 'Staff Systems & Infrastructure Engineer',
    timestamp: '2026-08-26T11:20:00.000Z',
    sessionDate: '2026-08-26',
    totalQuestions: 4,
    overallScore: 88,
    contentAverage: 90,
    behavioralAverage: 86,
    successLikelihood: {
      percentage: 85,
      uncertaintyRange: 4,
      verdict: 'High Potential',
      probabilisticExplanation: 'Exceptional executive presence, rigorous quantitative validation across all STAR stages, and flawless speech control (136 WPM with 1 filler word).',
      disclaimer: 'Probabilistic simulation calibrated to Google L6/Staff Engineering rubrics.'
    },
    successProbabilityPct: 85,
    uncertaintyMarginPct: 4,
    criticalCoachVerdict: 'Commanding performance. Pacing is calibrated at 136 WPM. All STAR quadrants achieved Strong ratings with precise SLA, concurrency, and reliability metrics.',
    confidencePaceScore: 92,
    clarityScore: 94,
    starCompletenessScore: 89,
    topImprovementAreas: [
      {
        title: 'Highlight broader industry open-source impact',
        impact: 'Medium',
        starStage: 'Result',
        actionableAdvice: 'At the Staff level, discuss how architectural frameworks influenced other engineering teams or open-source standards.'
      }
    ],
    speechTrends: {
      averageWpm: 136,
      averageClarity: 94,
      averageConfidence: 93,
      totalFillerWords: 1,
      paceConsistency: 'Masterful / Executive Cadence'
    },
    starCoverageMetrics: {
      situationScore: 92,
      taskScore: 88,
      actionScore: 90,
      resultScore: 86
    },
    answers: [
      {
        questionId: 'q_hist4_1',
        questionText: 'Tell me about a complex distributed system failure you diagnosed and how you prevented its recurrence.',
        userTranscript: 'At CloudScale, our distributed consensus cluster experienced split-brain under asymmetric network partitions, threatening data integrity for 120,000 monthly enterprise users. As Staff Architect, my mandate was to design an automated mitigation within 7 days. I implemented a Raft-based lease renewal protocol with strict quorum fencing and automated chaos test suites. We validated zero split-brain events over 500 simulated network cut tests, and achieved 99.999% availability over the subsequent 18 months.',
        languageUsed: 'en',
        contentScore: 90,
        behavioralScore: 88,
        overallScore: 89,
        speechMetrics: {
          wpm: 136,
          paceStatus: 'Optimal',
          confidenceScore: 93,
          clarityScore: 95,
          fillerWordsCount: 1,
          fillerWordsList: ['um'],
          durationSeconds: 56,
          pauseCount: 4
        },
        starBreakdown: {
          situation: { status: 'Strong', critique: 'High-stakes consensus failure affecting 120k enterprise tenants.' },
          task: { status: 'Strong', critique: '7-day resolution timeline and architectural mandate clearly defined.' },
          action: { status: 'Strong', critique: 'Raft lease renewals, quorum fencing, and automated chaos testing.' },
          result: { status: 'Strong', critique: '500 validated partition simulations and 99.999% uptime achieved.' }
        },
        criticalFlaws: [],
        interviewerPersonaCritique: 'Staff-level technical depth, flawless STAR discipline, and impressive verification rigor.',
        modelAnswerExemplar: 'At CloudScale, our distributed consensus layer encountered split-brain conditions during cloud provider network partitions...'
      }
    ]
  }
];

// Store evaluations in memory pre-populated with historical records
export const sessionEvaluations: Map<string, SessionEvaluation> = new Map();
initialHistoricalSessions.forEach(session => {
  sessionEvaluations.set(session.id, session);
});

