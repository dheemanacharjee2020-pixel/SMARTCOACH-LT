import { InterviewQuestion, CompanyProfile, CandidateTrack } from '../types';

/**
 * Safely executes a fetch request and parses JSON response.
 * Prevents "Unexpected token <" HTML parsing errors if an endpoint fails or drops.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      const text = await res.text();
      return {
        success: false,
        error: `Server returned non-JSON response (${res.status}): ${text.substring(0, 80)}`
      };
    }

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        data,
        error: data?.error || `Request failed with HTTP status ${res.status}`
      };
    }

    return {
      success: true,
      data
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error occurred while contacting the server.'
    };
  }
}

/**
 * Generates instant, high-quality STAR interview questions matching the company, role, & candidate track.
 * Used as a zero-latency fallback if Gemini or network takes extra time.
 */
export function getFallbackInterviewQuestions(
  companyName: string = 'Target Enterprise',
  roleTitle: string = 'Software Engineer',
  focusArea?: string,
  candidateTrack: CandidateTrack | string = 'undergraduate'
): InterviewQuestion[] {
  const company = companyName || 'Target Enterprise';
  const role = roleTitle || 'Software Engineer';

  // 1. Undergraduate / College Track: 2 Questions (Campus & Academic Foundational)
  if (candidateTrack === 'undergraduate') {
    return [
      {
        id: 'q1_ug',
        questionNumber: 1,
        totalQuestions: 2,
        category: 'behavioral',
        questionText: `Tell me about a complex academic course project, hackathon, or internship assignment where you faced an unexpected technical roadblock or tight deadline. How did you work through it for ${role}?`,
        contextOrGoal: `Evaluates fundamental problem decomposition, perseverance, individual contribution, and practical application of college coursework at ${company}.`,
        suggestedStarHints: {
          situation: "Describe the college course project, hackathon, or internship assignment and technical requirements.",
          task: "Your specific technical responsibility within the student team.",
          action: "How you researched documentation, debugged the core issue, and collaborated with peers.",
          result: "The grade, working demo, performance metric, or feature delivered on time."
        }
      },
      {
        id: 'q2_ug',
        questionNumber: 2,
        totalQuestions: 2,
        category: 'situational',
        questionText: `Describe a situation during a team project or campus activity where a teammate was not contributing their fair share or had a conflicting opinion on the design. How did you handle the situation?`,
        contextOrGoal: `Assesses teamwork, constructive conflict resolution, peer empathy, and ownership in a college or entry-level environment.`,
        suggestedStarHints: {
          situation: "Set the team context, project deadline, and nature of the disagreement.",
          task: "Your responsibility to keep the project on track while preserving team morale.",
          action: "Direct, empathetic communication steps you took and objective trade-offs evaluated.",
          result: "How the team resolved the issue and the final project outcome."
        }
      }
    ];
  }

  // 2. Postgraduate / MBA Track: 3 Questions (Strategic, ROI, Leadership)
  if (candidateTrack === 'postgraduate_mba') {
    return [
      {
        id: 'q1_mba',
        questionNumber: 1,
        totalQuestions: 3,
        category: 'leadership',
        questionText: `Tell me about a time you had to align conflicting cross-functional stakeholders (e.g. Engineering, Sales, and Product) around a high-stakes roadmap decision for ${role} at ${company}.`,
        contextOrGoal: `Evaluates structured stakeholder management, quantitative business case trade-offs, and strategic leadership.`,
        suggestedStarHints: {
          situation: "The business context, diverging stakeholder incentives, and market urgency.",
          task: "Your objective to establish alignment without alienating key stakeholders.",
          action: "Frameworks used (data analysis, unit economics, customer interviews, MECE logic).",
          result: "Consensus reached, executive sign-off, and business impact (% growth, revenue, or SLA)."
        }
      },
      {
        id: 'q2_mba',
        questionNumber: 2,
        totalQuestions: 3,
        category: 'situational',
        questionText: `Walk me through how you would prioritize between short-term revenue monetization and long-term customer retention when resources are constrained at ${company}.`,
        contextOrGoal: `Probes strategic depth, market prioritization, financial ROI modeling, and customer-first values.`,
        suggestedStarHints: {
          situation: "A past scenario or strategic case involving tight trade-offs.",
          task: "Your individual leadership mandate and strategic evaluation metric.",
          action: "Data modeling, cohort lifetime value (LTV) vs customer acquisition cost (CAC) calculations.",
          result: "The final strategic recommendation and measurable outcome."
        }
      },
      {
        id: 'q3_mba',
        questionNumber: 3,
        totalQuestions: 3,
        category: 'behavioral',
        questionText: `Can you describe a failed initiative or strategic bet from your past experience? What went wrong and what operational changes did you implement afterwards?`,
        contextOrGoal: `Evaluates intellectual honesty, resilience, post-mortem rigor, and executive maturity.`,
        suggestedStarHints: {
          situation: "Context and underlying hypothesis of the initiative.",
          task: "Your responsibility in executing and tracking performance.",
          action: "Root cause analysis conducted without blame, and process improvements implemented.",
          result: "Subsequent wins achieved by applying the learned insights."
        }
      }
    ];
  }

  // 3. Research / PhD Track: 4 Questions (Hypothesis, Ablation, Production Translation, Peer Defense)
  if (candidateTrack === 'research_phd') {
    return [
      {
        id: 'q1_res',
        questionNumber: 1,
        totalQuestions: 4,
        category: 'technical',
        questionText: `Describe a novel hypothesis or algorithmic contribution from your thesis/research where initial experimental results contradicted your expectations. How did you isolate the underlying mathematical cause?`,
        contextOrGoal: `Assesses scientific experimental rigor, mathematical depth, analytical discipline, and resilience in research.`,
        suggestedStarHints: {
          situation: "Research objective, experimental setup, baseline benchmark, and unexpected data anomaly.",
          task: "Your responsibility in diagnosing the theoretical or empirical discrepancy.",
          action: "Ablation studies, mathematical proofs, loss landscape analysis, or synthetic testing performed.",
          result: "Theoretical discovery validated, improved benchmark score (SOTA), or paper published."
        }
      },
      {
        id: 'q2_res',
        questionNumber: 2,
        totalQuestions: 4,
        category: 'situational',
        questionText: `When translating a theoretical research model into a scalable, compute-constrained production system at ${company}, how do you evaluate the trade-offs between model accuracy and inference latency/memory footprint?`,
        contextOrGoal: `Probes applied research acumen, hardware awareness (GPU/TPU memory, quantization, pruning), and practical engineering judgment.`,
        suggestedStarHints: {
          situation: "The theoretical model architecture versus production SLA/budget limits.",
          task: "Your objective to optimize throughput and memory without degrading qualitative performance.",
          action: "Techniques used: distillation, INT8/FP8 quantization, kernel optimization, or architectural simplification.",
          result: "Measured speedup (e.g. 3x latency reduction, 50% memory decrease) with preserved accuracy."
        }
      },
      {
        id: 'q3_res',
        questionNumber: 3,
        totalQuestions: 4,
        category: 'behavioral',
        questionText: `Tell me about a time you defended your research methodologies or paper findings during a rigorous peer review, academic defense, or hostile critique. How did you handle the objections?`,
        contextOrGoal: `Evaluates scholarly rigor, objective argumentation, open-mindedness, and communication of high-complexity concepts.`,
        suggestedStarHints: {
          situation: "The review context, venue (NeurIPS/ICML/defense), and specific technical objections.",
          task: "Your mandate to address critiques with empirical evidence and mathematical clarity.",
          action: "New control experiments, mathematical bounds formulated, and transparent rebuttal written.",
          result: "Acceptance of paper, consensus reached, or validation by the scientific community."
        }
      },
      {
        id: 'q4_res',
        questionNumber: 4,
        totalQuestions: 4,
        category: 'leadership',
        questionText: `Describe a collaborative research effort involving multiple labs or cross-functional scientists where team members had conflicting experimental priorities or code standards. How did you maintain velocity and rigor?`,
        contextOrGoal: `Evaluates scientific collaboration, research reproducibility, co-author management, and technical standards.`,
        suggestedStarHints: {
          situation: "Multi-author research project scope and divergence in methodology.",
          task: "Your role in establishing reproducibility pipelines and unified evaluation benchmarks.",
          action: "Standardized experiment trackers (W&B/MLflow), clear ablation ownership, and consensus meetings.",
          result: "Unified paper submission, reproducible artifacts open-sourced, and project milestone met."
        }
      }
    ];
  }

  // 4. Experienced Professional Track: 4 Questions (Scale, Conflict, Incident Triage, Mentorship)
  return [
    {
      id: 'q1_exp',
      questionNumber: 1,
      totalQuestions: 4,
      category: 'behavioral',
      questionText: `Can you describe a high-stakes project at your previous role where you had to manage competing technical priorities under a strict deadline for ${role}?`,
      contextOrGoal: `Evaluates Situation, Task, Action, Result with focus on prioritization and measurable delivery at ${company}.`,
      suggestedStarHints: {
        situation: "Set the context: project scope, timeline constraints, and key stakeholders.",
        task: "State your specific responsibility versus broader team ownership.",
        action: "Detail step-by-step technical and triage prioritization decisions made.",
        result: "Quantify the final delivery impact (latency, uptime, revenue, or on-time delivery metric)."
      }
    },
    {
      id: 'q2_exp',
      questionNumber: 2,
      totalQuestions: 4,
      category: 'situational',
      questionText: `Tell me about a time you strongly disagreed with an architectural or product decision chosen by a team lead or stakeholder at ${company}. How did you handle the debate?`,
      contextOrGoal: `Probes data-driven persuasion, professional disagreement, and alignment with corporate engineering values.`,
      suggestedStarHints: {
        situation: "Describe the architectural or product disagreement clearly.",
        task: "Your objective in seeking the optimal business or system outcome.",
        action: "How you presented benchmarks, prototypes, or objective criteria without friction.",
        result: "The final consensus reached and measurable project outcome."
      }
    },
    {
      id: 'q3_exp',
      questionNumber: 3,
      totalQuestions: 4,
      category: 'technical',
      questionText: `Looking at the systems and scale requirements for ${role} at ${company}, describe how you would diagnose and mitigate a severe latency bottleneck or incident in production.`,
      contextOrGoal: `Assesses operational rigor, telemetry analysis, root cause isolation, and calm execution under pressure.`,
      suggestedStarHints: {
        situation: "Incident context, traffic volume, and blast radius.",
        task: "Immediate customer safeguard and mitigation responsibility.",
        action: "Profiling protocol, query optimization, caching strategies, and rollback steps.",
        result: "Measured latency reduction (ms), recovery time, and post-mortem safeguards."
      }
    },
    {
      id: 'q4_exp',
      questionNumber: 4,
      totalQuestions: 4,
      category: 'leadership',
      questionText: `How have you mentored mid-level engineers, established organizational engineering standards, and successfully reduced systemic technical debt across multiple squads?`,
      contextOrGoal: `Evaluates senior leadership leverage, engineering culture elevation, mentorship depth, and architectural sustainability.`,
      suggestedStarHints: {
        situation: "The organization's state of technical debt or junior engineering team capability.",
        task: "Your initiative to scale best practices, testing standards, and design review culture.",
        action: "Mentorship frameworks established, design RFC templates implemented, and technical debt sprints organized.",
        result: "Measurable drop in production defects, faster onboarding time, and career promotion of mentees."
      }
    }
  ];
}

