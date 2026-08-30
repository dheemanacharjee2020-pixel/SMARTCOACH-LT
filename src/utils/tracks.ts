import { CandidateTrack, TrackMetadata, CompanyRole } from '../types';

export const TRACK_QUESTION_COUNTS: Record<CandidateTrack, number> = {
  undergraduate: 2,     // 2 Focused campus/academic questions
  postgraduate_mba: 3,  // 3 Strategic/Leadership/ROI questions
  research_phd: 4,      // 4 In-depth scientific/defense/translation questions
  experienced_pro: 4    // 4 High-stakes systems/incident/architecture questions
};

export const getQuestionCountForTrack = (track?: CandidateTrack | string): number => {
  if (track && track in TRACK_QUESTION_COUNTS) {
    return TRACK_QUESTION_COUNTS[track as CandidateTrack];
  }
  return 2;
};

export const CANDIDATE_TRACKS: TrackMetadata[] = [
  {
    id: 'undergraduate',
    label: 'Undergraduate / College Student',
    badge: 'Campus / Entry Level',
    educationStage: 'Undergraduate / College (B.S./B.A./B.Tech)',
    progressionLevel: 1,
    questionCount: 2,
    expectedDurationMin: 4,
    description: 'College students applying for starting roles, campus placements, or summer internships.',
    targetFocus: 'Foundational CS/analytics principles, capstone/academic projects, hackathons, and learning velocity.',
    sampleRole: 'Software Engineer I (New Grad / Campus Hire)'
  },
  {
    id: 'postgraduate_mba',
    label: 'MBA & Postgraduate / University',
    badge: 'Postgrad / Accelerated',
    educationStage: 'Postgraduate / Master’s / MBA (M.S./MBA/M.Tech)',
    progressionLevel: 2,
    questionCount: 3,
    expectedDurationMin: 6,
    description: 'Postgraduate & MBA students applying for senior, strategic, or leadership development tracks.',
    targetFocus: 'Business acumen, strategic prioritization, cross-functional leadership, PM, and ROI execution.',
    sampleRole: 'Product Manager (MBA Leadership Track)'
  },
  {
    id: 'research_phd',
    label: 'Research / PhD & Academia',
    badge: 'Research / PhD Fellow',
    educationStage: 'Doctoral / Scientific Research (PhD/Postdoc)',
    progressionLevel: 3,
    questionCount: 4,
    expectedDurationMin: 8,
    description: 'Research students, PhD candidates, and postdocs targeting lab scientist or R&D research positions.',
    targetFocus: 'Novel methodologies, algorithmic proofs, experimental rigor, paper defense, and foundational research.',
    sampleRole: 'Research Scientist — Foundation Models & AI Lab (PhD/Postdoc)'
  },
  {
    id: 'experienced_pro',
    label: 'Experienced Professional / Senior',
    badge: 'Industry Lateral',
    educationStage: 'Experienced Industry Lateral (Mid/Senior/Staff)',
    progressionLevel: 4,
    questionCount: 4,
    expectedDurationMin: 8,
    description: 'Experienced industry engineers, tech leads, and managers targeting mid-to-senior lateral roles.',
    targetFocus: 'Distributed architecture, production high-stakes outages, organizational leverage, and scale.',
    sampleRole: 'Senior Staff Software Engineer — Core Systems'
  }
];

export const TRACK_CURATED_ROLES: Record<CandidateTrack, CompanyRole[]> = {
  undergraduate: [
    {
      id: 'ug_swe_1',
      roleTitle: 'Software Engineer I (New Grad / Campus Hire)',
      category: 'Engineering',
      level: 'Entry Level / College',
      description: 'Starting software engineering role focusing on writing clean code, unit testing, and contributing to core services.',
      responsibilities: [
        'Design, write, and test clean, maintainable code in TypeScript, Python, or Java under mentor guidance.',
        'Participate actively in code reviews, sprint planning, and architectural discussions.',
        'Debug issues, write automated unit and integration tests, and help monitor CI/CD pipelines.',
        'Collaborate with product and senior engineering peers to ship features on time.'
      ],
      requirements: [
        'Pursuing or recently completed B.S. in Computer Science, Software Engineering, or related STEM field.',
        'Strong grasp of algorithms, data structures, object-oriented design, and complexity analysis.',
        'Experience building personal, hackathon, or university coursework projects.',
        'Curious mindset with demonstrated eagerness to learn production frameworks.'
      ],
      sampleJd: `Role: Software Engineer I (New Grad / Campus Placement)
Location: Hybrid / On-Site

About the Opportunity:
We are looking for high-potential college graduates and undergraduate students to join our engineering team. As a starting engineer, you will collaborate with experienced mentors to solve real-world problems and write high-impact production code.

Key Responsibilities:
- Build, test, and deploy features across our core web and backend services.
- Write robust unit tests and participate in technical design reviews.
- Troubleshoot bug reports and assist with observability and performance monitoring.
- Collaborate cross-functionally with designers, QA, and product managers.

Requirements:
- Bachelor's degree (or graduating senior) in Computer Science, Data Science, or related STEM discipline.
- Solid understanding of core computer science fundamentals (data structures, algorithms, runtime complexity).
- Proficiency in at least one modern language (Python, TypeScript, JavaScript, Java, C++, or Go).
- Strong communication, proactive team collaboration, and passion for problem-solving.`
    },
    {
      id: 'ug_da_1',
      roleTitle: 'Junior Data Analyst (Campus Placement / Entry Level)',
      category: 'Data & Analytics',
      level: 'Entry Level / College',
      description: 'Entry-level analytics role extracting insights, constructing SQL queries, and designing operational dashboards.',
      responsibilities: [
        'Write SQL queries to extract, transform, and aggregate business metrics across company databases.',
        'Build and maintain intuitive charts and KPI dashboards in Tableau, Power BI, or Looker.',
        'Assist senior analysts with cohort retention analysis, trend forecasting, and survey summaries.',
        'Document data definitions, metric logic, and operational reporting catalogs.'
      ],
      requirements: [
        'Degree in Statistics, Mathematics, Economics, Computer Science, or Business Analytics.',
        'Proficiency in SQL (joins, aggregations, basic subqueries) and Excel/Google Sheets.',
        'Familiarity with Python (Pandas/NumPy) or R for exploratory data analysis.',
        'High attention to detail and strong quantitative reasoning skills.'
      ],
      sampleJd: `Role: Junior Data Analyst (Campus Hire / Graduate Trainee)
Location: Hybrid / Remote

About the Role:
Kickstart your analytics career by translating quantitative data into actionable insights for product and business teams.

Key Responsibilities:
- Write optimized SQL queries and maintain automated daily metric feeds.
- Build clean, interactive dashboards and visual reports for team stakeholders.
- Partner with product managers to validate metric tracking and logging.
- Perform exploratory analyses on user behavior and engagement trends.

Qualifications:
- Bachelor's degree in Quantitative field (Math, Statistics, CS, Economics, Analytics).
- Proficient in SQL and statistical tools (Python, R, or Excel).
- Eagerness to dive into complex datasets and communicate findings clearly.`
    },
    {
      id: 'ug_pm_intern',
      roleTitle: 'Associate Product / Business Trainee (College Level)',
      category: 'Product & Strategy',
      level: 'Entry Level / College',
      description: 'Entry-level product associate driving feature specs, user research interviews, and sprint coordination.',
      responsibilities: [
        'Draft user stories, acceptance criteria, and product requirements documents (PRDs).',
        'Synthesize customer feedback, support tickets, and telemetry to identify friction points.',
        'Coordinate sprint ceremonies and track milestone deliverables alongside engineering leads.'
      ],
      requirements: [
        'Bachelor’s degree in Business, CS, Design, or interdisciplinary studies.',
        'Demonstrated leadership in college student clubs, hackathons, or previous internships.',
        'Exceptional structured written and verbal communication.'
      ],
      sampleJd: `Role: Associate Product Trainee (College Level)
Location: Hybrid

About the Role:
Join as an Associate Product Trainee to learn product management from the ground up, translating customer needs into high-impact software features.`
    }
  ],

  postgraduate_mba: [
    {
      id: 'mba_pm_1',
      roleTitle: 'Product Manager (MBA Leadership Track / Senior Postgrad)',
      category: 'Product & Strategy',
      level: 'Postgraduate / MBA',
      description: 'Strategic product management role defining product vision, business model ROI, go-to-market, and cross-functional execution.',
      responsibilities: [
        'Own the product vision, quarterly roadmap, and unit economics for key platform pillars.',
        'Lead cross-functional squads of engineers, designers, data scientists, and marketers to launch high-growth features.',
        'Perform market sizing, competitor benchmarking, pricing strategy, and ROI trade-off modeling.',
        'Define North Star metrics, oversee A/B experimentation roadmaps, and present updates to executive leadership.'
      ],
      requirements: [
        'MBA or Master’s degree in Management, Business, or Technology Strategy.',
        'Strong business acumen combined with technical fluency and quantitative analytical rigor.',
        'Proven track record leading multidisciplinary teams and managing executive stakeholders.',
        'Experience with product discovery, user journeys, and financial unit economics.'
      ],
      sampleJd: `Role: Product Manager (MBA Leadership Development Program / Senior Postgrad)
Location: Hybrid

About the Role:
As a Product Manager joining from an MBA or Master's program, you will spearhead strategic initiatives from concept to scaled monetization, collaborating directly with executive stakeholders and engineering directors.`
    },
    {
      id: 'mba_strat_1',
      roleTitle: 'Senior Strategy & Operations Associate (Postgraduate / MBA)',
      category: 'Product & Strategy',
      level: 'Postgraduate / MBA',
      description: 'High-impact strategy and operations role driving expansion, operational efficiency, and board-level initiatives.',
      responsibilities: [
        'Lead strategic problem decomposition for expansion, market entry, and cost optimization.',
        'Build financial models, scenario forecasts, and business case evaluations.',
        'Drive operational implementation across international or cross-functional departments.'
      ],
      requirements: [
        'Master’s degree or MBA with background in Consulting, Corporate Strategy, or Investment Banking.',
        'Expertise in structured hypothesis-driven frameworks (MECE, Porter’s, 80/20).'
      ],
      sampleJd: `Role: Senior Strategy & Operations Associate (MBA / Master's)
Location: On-Site / Hybrid

About the Role:
Drive strategic growth and operational excellence across executive business units.`
    },
    {
      id: 'mba_tech_lead',
      roleTitle: 'Senior Engineering / Tech Lead (Postgraduate M.S./M.Tech)',
      category: 'Engineering',
      level: 'Postgraduate / M.S.',
      description: 'Advanced technical lead architecting distributed systems and bridging technical design with product strategy.',
      responsibilities: [
        'Architect scalable cloud-native architectures and distributed data pipelines.',
        'Guide technical roadmaps, mentor junior engineers, and manage technical debt.'
      ],
      requirements: [
        'M.S./M.Tech in Computer Science, Computer Engineering, or related technical discipline.',
        'Deep architectural understanding of distributed consensus, cloud infrastructure, and security.'
      ],
      sampleJd: `Role: Senior Engineering Specialist (M.S. / Postgraduate Track)
Location: Remote / Hybrid`
    }
  ],

  research_phd: [
    {
      id: 'res_phd_ai_1',
      roleTitle: 'Research Scientist — Foundation Models & AI Lab (PhD / Postdoc)',
      category: 'AI & Machine Learning',
      level: 'PhD / Research Fellow',
      description: 'Frontier scientific research developing novel deep learning architectures, multimodal reasoning, and foundational AI algorithms.',
      responsibilities: [
        'Conduct fundamental and applied research in large language models, reinforcement learning, multimodal representations, or diffusion systems.',
        'Derive mathematical proofs, design novel loss functions, and architect compute-efficient training procedures on distributed GPU/TPU clusters.',
        'Author top-tier research papers for publication in NeurIPS, ICML, ICLR, CVPR, or ACL.',
        'Collaborate with applied engineering teams to transfer theoretical breakthroughs into scalable production models.'
      ],
      requirements: [
        'PhD or Postdoctoral candidate in Computer Science, Machine Learning, Applied Mathematics, or Physics.',
        'Strong publication record in tier-1 machine learning and AI conferences (NeurIPS, ICML, ICLR, CVPR).',
        'Deep mathematical proficiency in linear algebra, probability theory, optimization, and information theory.',
        'Proficiency in PyTorch, JAX, CUDA kernels, and distributed training frameworks (DeepSpeed, Megatron).'
      ],
      sampleJd: `Role: Research Scientist — Foundation Models & Frontier AI (PhD / Postdoc)
Location: Research Lab / Hybrid

About the Role:
Join our AI Research Lab to pioneer fundamental breakthroughs in generative intelligence, reasoning capabilities, and algorithmic efficiency.

Key Responsibilities:
- Formulate and rigorously test hypotheses on novel model architectures and optimization dynamics.
- Scale training recipes across multi-node GPU clusters and analyze convergence stability.
- Publish novel research and represent the laboratory at top academic symposiums.

Qualifications:
- PhD / Postdoc in Machine Learning, Artificial Intelligence, Computational Statistics, or Theoretical CS.
- First-author publications in premier venues (NeurIPS, ICML, ICLR, ACL).`
    },
    {
      id: 'res_phd_quant',
      roleTitle: 'Quantitative Research Scientist (PhD / Postgraduate Research)',
      category: 'Data & Analytics',
      level: 'PhD / Research',
      description: 'Researching statistical arbitrage, stochastic calculus models, and high-frequency predictive signals.',
      responsibilities: [
        'Design statistical predictive models using extreme-value theory, stochastic differential equations, and time-series analysis.',
        'Backtest hypotheses against petabyte-scale historical market tick feeds.'
      ],
      requirements: [
        'PhD in Mathematics, Physics, Statistics, Financial Engineering, or Computational Science.',
        'Expertise with C++, Python, and high-performance numerical libraries.'
      ],
      sampleJd: `Role: Quantitative Research Scientist (PhD / Postdoctoral Track)
Location: On-Site`
    }
  ],

  experienced_pro: [
    {
      id: 'exp_staff_swe',
      roleTitle: 'Senior / Staff Software Engineer — Distributed Systems',
      category: 'Engineering',
      level: 'Senior / Staff',
      description: 'Lead architecture, reliability, and cross-team execution for high-throughput distributed services and platforms.',
      responsibilities: [
        'Architect, scale, and maintain high-throughput backend services and event-driven architectures with 99.99% SLA.',
        'Lead cross-organization engineering initiatives, conduct architecture reviews, and resolve high-stakes production incidents.',
        'Mentor and elevate senior and mid-level software engineers across multiple squads.'
      ],
      requirements: [
        '5+ years of software engineering experience building distributed, resilient systems.',
        'Expertise in TypeScript, Go, Java, or Rust with deep PostgreSQL, Redis, and cloud infrastructure experience.'
      ],
      sampleJd: `Role: Senior / Staff Software Engineer — Distributed Systems
Location: Remote / Hybrid`
    },
    {
      id: 'exp_lead_da',
      roleTitle: 'Lead Data & Analytics Strategist',
      category: 'Data & Analytics',
      level: 'Senior / Lead',
      description: 'Architect company-wide metric architecture, data warehousing, and executive intelligence frameworks.',
      responsibilities: [
        'Architect scalable metric layers and executive analytics pipelines.',
        'Partner with C-suite stakeholders to guide operational and investment priorities.'
      ],
      requirements: [
        '6+ years in business intelligence and data engineering leadership.'
      ],
      sampleJd: `Role: Lead Data & Analytics Strategist
Location: Hybrid`
    }
  ]
};
