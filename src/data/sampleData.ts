export interface SampleResumePreset {
  id: string;
  name: string;
  role: string;
  fileName: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResumePreset[] = [
  {
    id: 'fullstack-senior',
    name: 'Alex Chen (Senior Full-Stack Engineer)',
    role: 'Senior Full-Stack Engineer',
    fileName: 'Alex_Chen_Senior_FullStack.pdf',
    text: `ALEX CHEN — Senior Full-Stack Engineer
Email: alex.chen@example.com | San Francisco, CA | 7+ Years Experience

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 7+ years of experience architecting high-availability web applications, scalable REST/GraphQL APIs, and real-time distributed microservices. Proven track record leading engineering initiatives that boosted system throughput by 40% and supported $400M in annual transactions.

CORE TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5, CSS3
- Frontend: React 19, Next.js, Redux Toolkit, Tailwind CSS, Web Speech API, WebSockets
- Backend & Systems: Node.js, Express, PostgreSQL, Redis, Kafka, Distributed Caching
- Cloud & DevOps: AWS (ECS, S3, RDS, Lambda), Docker, Kubernetes, CI/CD (GitHub Actions), Datadog
- Methodologies: System Design, STAR-based Team Leadership, Micro-Frontends, Agile/Scrum

PROFESSIONAL EXPERIENCE
Staff Software Engineer | PayFlow Inc. (2022 – Present)
- Architected and deployed a multi-tenant payment gateway using Node.js and PostgreSQL, processing $400M in annual transactions with 99.99% uptime.
- Reduced P99 API latency from 850ms to 120ms (an 85% drop) by introducing Redis cluster caching and optimizing database indexing.
- Led a team of 6 engineers across 3 time zones, mentoring junior developers and establishing automated integration testing that reduced regression bugs by 45%.

Senior Frontend Engineer | CloudScale Tech (2019 – 2022)
- Re-architected core customer dashboard in React and TypeScript, improving Core Web Vitals (LCP reduced by 1.8s) for 150,000 monthly active users.
- Built reusable enterprise UI component library adopted by 8 product teams, decreasing frontend sprint cycle time by 25%.
- Partnered with Product & Design leads to execute A/B conversion experiments generating $1.8M incremental ARR.

EDUCATION
B.S. in Computer Science | University of Washington, Seattle (2015 – 2019)`
  },
  {
    id: 'product-manager',
    name: 'Maya Patel (Senior Product Manager)',
    role: 'Senior Product Manager',
    fileName: 'Maya_Patel_Senior_PM.pdf',
    text: `MAYA PATEL — Senior Product Manager
Email: maya.patel@example.com | New York, NY | 6+ Years Experience

SUMMARY
Customer-obsessed Product Manager with 6+ years driving zero-to-one product launches and scale-stage platform growth. Expert in user telemetry, experiment design, developer ecosystems, and cross-functional leadership.

EXPERIENCE
Lead Product Manager | Nexus Platforms (2021 – Present)
- Owned roadmap and GTM strategy for developer API platform, growing active developer base by 210% to 85,000 MAU.
- Prioritized high-impact features using RICE framework, driving a 32% increase in platform retention and $4.5M net-new ARR.
- Partnered with Engineering and UX to launch automated onboarding flow, cutting time-to-first-API-call from 45 minutes to 4 minutes.

Product Manager | FinEdge (2018 – 2021)
- Spearheaded mobile banking features serving 1.2M active retail accounts.
- Ran 40+ iterative A/B tests to optimize credit card checkout conversion, achieving +14% uplift in completed applications.

EDUCATION
B.A. Economics & Computer Science Minor | Columbia University`
  },
  {
    id: 'ai-ml-engineer',
    name: 'David Zhao (Machine Learning Engineer)',
    role: 'Staff ML Engineer',
    fileName: 'David_Zhao_ML_Engineer.pdf',
    text: `DAVID ZHAO — Staff Machine Learning Engineer
Email: david.zhao@example.com | Seattle, WA | 5+ Years Experience

SUMMARY
Machine Learning Engineer specializing in Large Language Models (LLM), embedding search, low-latency model inference, and real-time recommendation systems.

SKILLS
Python, PyTorch, TensorFlow, CUDA, Transformers, LangChain, Vector Databases (Pinecone, Qdrant), Kubernetes, Ray, FastAPI, GCP, AWS.

EXPERIENCE
Senior ML Engineer | Cortex AI (2022 – Present)
- Deployed production RAG pipeline processing 2M queries/day with sub-180ms latency.
- Fine-tuned transformer models for domain-specific code generation, improving token accuracy by 22% over base models.
- Cut GPU inference compute costs by 38% using quantization (INT8/FP8) and vLLM batching.

EDUCATION
M.S. Artificial Intelligence | Carnegie Mellon University`
  }
];

export const SAMPLE_JOB_DESCRIPTIONS: Record<string, { role: string; jd: string }> = {
  'Stripe': {
    role: 'Senior Full-Stack Engineer',
    jd: `Role: Senior Full-Stack Engineer — Payments Infrastructure at Stripe
Location: Remote / San Francisco, CA

About the Role:
Stripe builds economic infrastructure for the internet. As a Senior Full-Stack Engineer on Payments Infrastructure, you will design and build developer-facing dashboards, real-time analytics engines, and resilient payment APIs that power millions of global businesses.

Key Responsibilities:
- Design, build, and maintain mission-critical payment workflows with extreme reliability (99.999% availability).
- Architect clean, high-performance web applications using React, TypeScript, and modern backend services.
- Collaborate closely with product managers, UX researchers, and infrastructure engineers to deliver intuitive financial tooling.
- Champion engineering craft, rigorous code reviews, automated testing, and operational incident response.
- Mentor engineers and contribute to technical roadmaps that scale with 10x transaction growth.

Requirements:
- 5+ years of production full-stack engineering experience.
- Strong proficiency in modern TypeScript/JavaScript, React, Node.js, and relational databases (PostgreSQL).
- Demonstrated experience designing distributed systems, caching layers (Redis), and event-driven architectures.
- Experience with metrics-driven development, system reliability, and API security.
- Clear, structured verbal and written communication.`
  },
  'Google': {
    role: 'Senior Software Engineer (L5)',
    jd: `Role: Senior Software Engineer (L5) — Cloud Platform at Google
Location: Mountain View, CA / Hybrid

About the Role:
Google Cloud enables millions of businesses and developers to build, modernize, and scale applications. We are looking for an experienced Software Engineer to drive architectural decisions and deliver high-throughput, low-latency distributed systems.

Key Responsibilities:
- Design, develop, test, deploy, maintain, and improve large-scale distributed cloud software.
- Manage individual project priorities, deadlines, and deliverables.
- Solve complex algorithmic and architectural bottlenecks across global data centers.
- Collaborate with cross-functional teams to define APIs and technical specifications.

Minimum Qualifications:
- Bachelor's degree in Computer Science or equivalent practical experience.
- 5+ years of software development experience with one or more general purpose programming languages including Go, C++, Java, or TypeScript/Python.
- Experience with distributed computing, data structures, and algorithms.

Preferred Qualifications:
- Experience leading technical projects across multiple teams.
- Knowledge of microservices, Kubernetes, gRPC, and cloud storage systems.`
  },
  'Amazon': {
    role: 'Software Development Engineer II (SDE II)',
    jd: `Role: Software Development Engineer II — AWS Core Services at Amazon
Location: Seattle, WA

About AWS:
Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform. We are seeking an SDE II to build scalable services that handle millions of requests per second.

Key Responsibilities:
- Act as a key contributor in the design, development, and operation of large-scale distributed systems.
- Embody Amazon Leadership Principles (Customer Obsession, Ownership, Deliver Results, Dive Deep).
- Implement robust monitoring, automated CI/CD, and fault-tolerant infrastructure.

Basic Qualifications:
- 3+ years of non-internship professional software development experience.
- Experience with modern programming languages (Java, TypeScript, Python, C#).
- Experience with AWS services (DynamoDB, ECS, S3, SQS).`
  }
};

export const RETURNING_USER_FOCUS_AREAS = [
  {
    id: 'system_design',
    title: 'System Architecture & High-Scale Systems',
    description: 'Drill deep on distributed systems, caching, microservices, latency trade-offs, and database scaling.',
    icon: 'server',
    badge: 'Architecture'
  },
  {
    id: 'leadership_star',
    title: 'STAR Behavioral & Leadership Principles',
    description: 'Practice high-stakes behavioral questions targeting conflict resolution, ownership, and measurable business results.',
    icon: 'users',
    badge: 'Behavioral'
  },
  {
    id: 'incident_debugging',
    title: 'Live Incident Triage & Root Cause Analysis',
    description: 'Simulate high-pressure production debugging, rollback decisions, telemetry profiling, and post-mortem communication.',
    icon: 'alert-triangle',
    badge: 'Operational'
  },
  {
    id: 'product_fit',
    title: 'Company Culture & Values Alignment',
    description: 'Calibrate your answers directly to company specific hiring tenets, Googleyness, or Stripe operating principles.',
    icon: 'award',
    badge: 'Culture Match'
  }
];
