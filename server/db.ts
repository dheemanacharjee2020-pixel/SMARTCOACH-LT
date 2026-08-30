import { CompanyProfile, UserProfile, SessionEvaluation } from '../src/types';

// Pre-seeded internal verified companies database
export const internalCompanyDatabase: Record<string, CompanyProfile> = {
  'openai': {
    name: 'OpenAI',
    domain: 'openai.com',
    industry: 'Frontier Artificial Intelligence & AGI Research / Platform Engineering',
    headquarters: 'San Francisco, CA',
    description: `OpenAI is a leading artificial intelligence research and deployment company dedicated to ensuring that artificial general intelligence (AGI) benefits all of humanity. OpenAI builds industry-defining foundation models, reasoning engines, and consumer products including the GPT family (GPT-4o, GPT-4o mini), the OpenAI o-series reasoning models (o1, o3-mini), the Sora text-to-video diffusion architecture, Whisper speech recognition, DALL-E, and ChatGPT—which serves hundreds of millions of weekly active users worldwide.\n\nThe organization operates at the absolute frontier of deep learning, reinforcement learning from human feedback (RLHF), safety and alignment (mechanistic interpretability, automated alignment, red-teaming), and extreme-scale distributed infrastructure. OpenAI engineers and researchers design custom compute clusters running tens of thousands of GPUs, low-latency multi-modal inference engines, Triton kernel programming, and developer APIs powering global enterprise ecosystems.`,
    interviewStyle: 'High talent density and relentless focus on technical depth, first-principles reasoning, and research velocity. Probes candidates on deep system bottlenecks, scaling laws, model training vs inference tradeoffs, high ownership under rapid iteration, and safety alignment ethics. Expect rigorous algorithmic problem solving, distributed systems architecture, and deep domain debugging.',
    keyValues: ['AGI Focus & Safety', 'Intense Technical Rigor', 'First-Principles Thinking', 'High Ownership & Velocity', 'Direct Collaborative Candor', 'Deliver Impact at Global Scale'],
    coreTechOrSkills: ['PyTorch & Triton', 'Distributed Training & Inference', 'CUDA & GPU Optimization', 'LLM Architecture & Fine-Tuning', 'High-Throughput Systems', 'Safety Alignment & Red Teaming', 'Data-Driven Telemetry & Analytics'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'openai_data_analyst',
        roleTitle: 'Senior Data Analyst — Product & Growth Analytics',
        category: 'Data & Analytics',
        level: 'Senior',
        description: 'Drive data-informed product decisions, user cohort retention, model usage telemetry, and executive KPI reporting across ChatGPT and the OpenAI API.',
        responsibilities: [
          'Design, build, and maintain automated dashboards and dimensional data pipelines tracking weekly active users (WAU), retention curves, model token consumption, and conversion funnels.',
          'Formulate and analyze hypothesis-driven A/B experiments and multivariate tests evaluating new model features, UI changes, and subscription tiers.',
          'Author high-performance SQL models in Snowflake / BigQuery using dbt and develop executive reporting suites in Looker and Tableau.',
          'Conduct deep-dive exploratory data analysis to uncover user behavior patterns, latency bottlenecks, and churn drivers.',
          'Partner cross-functionally with Product, Research, Engineering, and Finance leads to establish core north-star metrics and strategic forecasts.'
        ],
        requirements: [
          '4+ years of professional experience in product analytics, business intelligence, or quantitative data analysis at a high-scale technology company.',
          'Expert SQL proficiency (complex CTEs, window functions, query plan optimization) and Python / R for statistical computing.',
          'Extensive experience with modern data stacks (Snowflake, BigQuery, dbt, Airflow) and business intelligence tools (Looker, Tableau).',
          'Strong foundational knowledge of statistics, experimental design, causal inference, and metrics storytelling.'
        ],
        sampleJd: `Role: Senior Data Analyst — Product & Growth Analytics at OpenAI
Location: San Francisco, CA / Hybrid

About the Team:
The Data & Analytics team at OpenAI empowers teams across the company to make rigorous, data-driven decisions that accelerate our mission to develop safe, beneficial AGI. We analyze billions of weekly user interactions, model inference telemetry, and platform conversion funnels across ChatGPT and the OpenAI Developer API.

Key Responsibilities:
- Design, build, and maintain automated dashboards, reporting suites, and data models tracking core business metrics (active users, prompt latency, token throughput, retention cohorts, revenue run-rate).
- Partner directly with Product Managers, Research Scientists, and Engineering leads to design and evaluate rigorous A/B experiments, feature rollouts, and pricing models.
- Write robust, modular SQL data transformations (dbt, Snowflake/BigQuery) and build reliable telemetry pipelines that translate raw event streams into actionable executive insights.
- Conduct exploratory analysis, cohort segmentation, and causal inference modeling to explain variance in user engagement and identify high-leverage growth opportunities.
- Communicate complex quantitative findings clearly to technical and non-technical stakeholders through written syntheses and executive presentations.

Qualifications:
- 4+ years of data analytics, product analytics, or quantitative analysis experience.
- Expert-level SQL skills and experience working with large-scale relational/columnar datasets (Snowflake, BigQuery, Redshift).
- Strong proficiency in Python or R for statistical analysis, data manipulation (pandas, numpy), and visualization.
- Deep understanding of statistical methods, hypothesis testing, A/B testing frameworks, and cohort analysis.
- Experience with BI visualization tools such as Looker, Tableau, or Metabase.
- Strong communication skills with a proven track record of influencing product roadmaps through data.`
      },
      {
        id: 'openai_research_engineer',
        roleTitle: 'Research Engineer — Foundation Models & Reasoning',
        category: 'AI & Machine Learning',
        level: 'Staff / MTS',
        description: 'Advance frontier deep learning models, pre-training/post-training algorithms, reinforcement learning, and high-performance distributed scaling.',
        responsibilities: [
          'Develop and scale novel pre-training and post-training architectures for frontier LLMs and multi-modal reasoning models.',
          'Implement ultra-efficient distributed training primitives across thousands of interconnected GPUs using PyTorch and Triton.',
          'Analyze model loss curves, scaling laws, benchmark evaluations, and failure modes to guide algorithmic breakthroughs.'
        ],
        requirements: [
          'Strong track record implementing deep learning algorithms and distributed training architectures in PyTorch.',
          'Deep expertise in transformer architectures, attention mechanisms, reinforcement learning (PPO/RLHF), or CUDA optimization.',
          'B.S., M.S., or Ph.D. in Computer Science, Machine Learning, Physics, Mathematics, or equivalent practical experience.'
        ],
        sampleJd: `Role: Research Engineer — Foundation Models & Reasoning at OpenAI
Location: San Francisco, CA

About the Role:
We are seeking exceptional Research Engineers to push the boundaries of artificial intelligence. In this role, you will design, train, and deploy frontier foundation models and reasoning systems.

Key Responsibilities:
- Scale pre-training and post-training runs across massive GPU supercomputers with 99.9% hardware utilization.
- Prototype and implement novel model architectures, loss functions, and synthetic data generation pipelines.
- Collaborate with alignment researchers to embed safety constraints and robust reasoning verifiers into foundation models.

Requirements:
- 4+ years of experience with deep learning, large-scale model training, and distributed systems in PyTorch.
- Experience profiling and optimizing GPU kernels (CUDA, Triton).`
      },
      {
        id: 'openai_swe_platform',
        roleTitle: 'Senior Software Engineer — Developer API & Infrastructure',
        category: 'Engineering',
        level: 'Senior',
        description: 'Build high-throughput, fault-tolerant inference APIs, rate limiters, token billing systems, and distributed caching for millions of developers.',
        responsibilities: [
          'Design, scale, and operate global inference gateway APIs serving tens of thousands of requests per second with sub-50ms overhead.',
          'Architect multi-region distributed streaming infrastructure, caching layers, and real-time WebSocket endpoints.',
          'Implement resilient traffic orchestration, rate-limiting, and fine-grained quota enforcement systems.'
        ],
        requirements: [
          '5+ years of software engineering experience building mission-critical distributed backend systems.',
          'Strong proficiency in Python, Go, Rust, or modern TypeScript/Node.js.',
          'Deep experience with distributed storage, Redis, Kubernetes, high-concurrency event loops, and cloud architecture.'
        ],
        sampleJd: `Role: Senior Software Engineer — Developer API & Infrastructure at OpenAI
Location: San Francisco, CA / Hybrid

About the Role:
The API Infrastructure team builds the platform that connects the world to OpenAI models. We process billions of API calls daily with strict reliability, low latency, and enterprise-grade security.

Key Responsibilities:
- Architect high-throughput distributed systems in Python, Go, and Rust that interface directly with our GPU inference fleets.
- Design streaming API protocols (SSE, WebSockets), real-time rate limiting, and multi-tenant authentication.
- Champion operational excellence, observability (Prometheus, Datadog), and automated failover.

Requirements:
- 5+ years of production experience building high-scale distributed backends.
- Solid understanding of networking protocols (HTTP/2, gRPC, WebSockets), distributed consensus, and concurrency.`
      },
      {
        id: 'openai_product_manager',
        roleTitle: 'Product Manager — ChatGPT Enterprise & Developer Platform',
        category: 'Product & Strategy',
        level: 'Lead / Senior',
        description: 'Define product strategy, enterprise workflows, developer experience, and model capabilities across OpenAI applications.',
        responsibilities: [
          'Drive roadmap and feature prioritization for ChatGPT Enterprise and Developer APIs from conception to global rollout.',
          'Synthesize technical capabilities of frontier models into intuitive developer tools and enterprise features.',
          'Partner with Research, Engineering, Design, and Legal to ensure safe, high-velocity product execution.'
        ],
        requirements: [
          '5+ years of product management experience at high-growth developer platform or SaaS companies.',
          'Deep technical literacy with AI APIs, developer workflows, and system architecture.',
          'Demonstrated ability to turn ambiguous technological breakthroughs into market-leading products.'
        ],
        sampleJd: `Role: Product Manager — ChatGPT Enterprise at OpenAI
Location: San Francisco, CA

About the Role:
As a Product Manager, you will shape how millions of businesses and developers interact with frontier AI.

Key Responsibilities:
- Define product requirements, telemetry metrics, and user feedback loops for enterprise ChatGPT features.
- Lead cross-functional execution across engineering, research, and go-to-market teams.
- Establish standards for data privacy, enterprise compliance, and model reliability.`
      }
    ]
  },
  'open ai': {
    name: 'OpenAI',
    domain: 'openai.com',
    industry: 'Frontier Artificial Intelligence & AGI Research / Platform Engineering',
    headquarters: 'San Francisco, CA',
    description: `OpenAI is a leading artificial intelligence research and deployment company dedicated to ensuring that artificial general intelligence (AGI) benefits all of humanity. OpenAI builds industry-defining foundation models, reasoning engines, and consumer products including the GPT family (GPT-4o, GPT-4o mini), the OpenAI o-series reasoning models (o1, o3-mini), the Sora text-to-video diffusion architecture, Whisper speech recognition, DALL-E, and ChatGPT—which serves hundreds of millions of weekly active users worldwide.\n\nThe organization operates at the absolute frontier of deep learning, reinforcement learning from human feedback (RLHF), safety and alignment (mechanistic interpretability, automated alignment, red-teaming), and extreme-scale distributed infrastructure. OpenAI engineers and researchers design custom compute clusters running tens of thousands of GPUs, low-latency multi-modal inference engines, Triton kernel programming, and developer APIs powering global enterprise ecosystems.`,
    interviewStyle: 'High talent density and relentless focus on technical depth, first-principles reasoning, and research velocity. Probes candidates on deep system bottlenecks, scaling laws, model training vs inference tradeoffs, high ownership under rapid iteration, and safety alignment ethics. Expect rigorous algorithmic problem solving, distributed systems architecture, and deep domain debugging.',
    keyValues: ['AGI Focus & Safety', 'Intense Technical Rigor', 'First-Principles Thinking', 'High Ownership & Velocity', 'Direct Collaborative Candor', 'Deliver Impact at Global Scale'],
    coreTechOrSkills: ['PyTorch & Triton', 'Distributed Training & Inference', 'CUDA & GPU Optimization', 'LLM Architecture & Fine-Tuning', 'High-Throughput Systems', 'Safety Alignment & Red Teaming', 'Data-Driven Telemetry & Analytics'],
    source: 'db',
    verified: true
  },
  'google': {
    name: 'Google',
    domain: 'google.com',
    industry: 'Technology / Cloud / AI / Consumer Hardware',
    headquarters: 'Mountain View, CA',
    description: 'A global technology leader focusing on search, cloud computing (Google Cloud), artificial intelligence (Gemini), online advertising, YouTube video streaming, Android operating system, and consumer electronics.',
    interviewStyle: 'Rigorous behavioral interviews using Googleyness & Leadership principles. Emphasizes structured problem-solving, scale, metrics, and STAR method precision.',
    keyValues: ['Googleyness', 'Bias for Action', 'Collaborative Leadership', 'Scale-Oriented Engineering', 'Focus on the User'],
    coreTechOrSkills: ['Distributed Systems', 'System Design', 'Algorithmic Efficiency', 'Cross-Functional Collaboration', 'Data-Driven Decision Making', 'SQL & Data Analytics'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'google_data_analyst',
        roleTitle: 'Senior Data Analyst — Product Analytics & Business Intelligence',
        category: 'Data & Analytics',
        level: 'L5',
        description: 'Provide quantitative analysis, user behavior modeling, and business insights to optimize Google Search, YouTube, and Google Cloud products.',
        responsibilities: [
          'Design and maintain scalable BigQuery data models, executive dashboards, and real-time metric tracking pipelines.',
          'Conduct statistical A/B test analysis, cohort retention modeling, and causal inference to guide product feature decisions.',
          'Collaborate with Product Managers and Software Engineers to define telemetry logging schemas and north-star KPIs.'
        ],
        requirements: [
          '4+ years of data analytics experience with advanced SQL, BigQuery, Python, and Looker/Tableau.',
          'Strong knowledge of applied statistics, experimental design, and hypothesis testing.'
        ],
        sampleJd: `Role: Senior Data Analyst (L5) — Product Analytics at Google
Location: Mountain View, CA / Hybrid

About the Role:
As a Senior Data Analyst at Google, you will evaluate billions of user interactions to optimize product performance, user trust, and global engagement across Google products.

Key Responsibilities:
- Architect and execute quantitative analyses and statistical models using SQL and Python.
- Build automated, intuitive dashboards in Looker and internal BI tools for executive leadership.
- Partner with product and engineering teams to design, launch, and evaluate randomized controlled experiments (A/B testing).
- Perform deep-dive root cause analyses on performance fluctuations and identify systemic product improvement opportunities.

Qualifications:
- Bachelor's or Master's degree in a quantitative discipline (Statistics, Computer Science, Economics, Mathematics) or equivalent practical experience.
- 4+ years of professional experience analyzing large-scale datasets using SQL and Python/R.
- Demonstrated experience with experiment design, statistical modeling, and stakeholder presentation.`
      },
      {
        id: 'google_swe_l5',
        roleTitle: 'Senior Software Engineer (L5) — Cloud Platform',
        category: 'Engineering',
        level: 'L5',
        description: 'Architect and scale high-availability distributed systems, Kubernetes infrastructure, and cloud storage systems across global data centers.',
        responsibilities: [
          'Design, develop, test, deploy, and maintain large-scale distributed systems in Go, C++, Java, or TypeScript.',
          'Solve complex concurrency, latency, and throughput bottlenecks across global clusters.'
        ],
        requirements: ['5+ years of software development experience with distributed systems, data structures, and algorithms.'],
        sampleJd: `Role: Senior Software Engineer (L5) — Cloud Platform at Google\nLocation: Mountain View, CA / Hybrid\n\nKey Responsibilities:\n- Design, develop, test, deploy, maintain, and improve large-scale distributed cloud software.\n- Manage individual project priorities, deadlines, and deliverables.\n- Solve complex algorithmic and architectural bottlenecks across global data centers.\n\nQualifications:\n- 5+ years of software development experience with Go, C++, Java, or Python/TypeScript.\n- Experience leading technical initiatives and distributed systems architecture.`
      },
      {
        id: 'google_pm',
        roleTitle: 'Product Manager — AI & Cloud Solutions',
        category: 'Product & Strategy',
        level: 'L5',
        description: 'Define product roadmap, developer tooling, and enterprise AI integrations for Google Cloud Platform.',
        responsibilities: ['Lead zero-to-one product development, user research, and cross-functional engineering alignment.'],
        requirements: ['4+ years of product management experience with enterprise SaaS or developer infrastructure.'],
        sampleJd: `Role: Product Manager — AI & Cloud Solutions at Google\nLocation: Sunnyvale, CA\n\nKey Responsibilities:\n- Drive product vision, user journey mapping, and technical specs for Google Cloud AI capabilities.\n- Work closely with engineering and UX to deliver enterprise-grade reliability.`
      }
    ]
  },
  'stripe': {
    name: 'Stripe',
    domain: 'stripe.com',
    industry: 'Financial Technology / Developer Infrastructure',
    headquarters: 'San Francisco, CA & Dublin, Ireland',
    description: 'Financial infrastructure platform powering internet commerce, global payments, treasury networks, billing subscriptions, and financial services for millions of businesses worldwide.',
    interviewStyle: 'Pragmatic, execution-heavy interviews. Evaluates written clarity, real-world debugging, rigorous communication, and operating with extreme precision.',
    keyValues: ['Users First', 'Move Fast and Iterate', 'Rigorous Craftsmanship', 'Think Rigorously', 'Global Optimism'],
    coreTechOrSkills: ['API Design', 'System Reliability', 'Fintech Compliance', 'Clear Technical Communication', 'Pragmatic Engineering', 'SQL & Telemetry'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'stripe_data_analyst',
        roleTitle: 'Senior Data Analyst — Payments & Revenue Operations',
        category: 'Data & Analytics',
        level: 'L3 / Senior',
        description: 'Analyze global payment transaction authorization rates, fraud loss mitigation, user retention, and merchant monetization metrics.',
        responsibilities: [
          'Build and own foundational SQL data models in Presto / Trino / Snowflake tracking $1T+ in annual processed volume.',
          'Evaluate merchant authorization rate optimizations and perform causal impact analysis on payment routing algorithms.',
          'Develop executive dashboards in Tableau and Looker detailing global processing margins and chargeback risk.'
        ],
        requirements: [
          '4+ years of data analytics experience in fintech, payments, or SaaS.',
          'Advanced SQL proficiency, Python for data manipulation, and strong metrics rigor.'
        ],
        sampleJd: `Role: Senior Data Analyst — Payments & Revenue Operations at Stripe
Location: Remote / San Francisco, CA

About the Role:
At Stripe, data analysts work at the heart of our mission to grow the GDP of the internet. You will dive into massive financial datasets to optimize authorization rates, reduce payment friction, and power business-critical decisions.

Key Responsibilities:
- Build, monitor, and scale core data models that track payment processing reliability, dispute rates, and international settlement flows.
- Partner with product managers and engineers to conduct rigorous experiment analyses and identify optimization opportunities for Stripe Billing and Checkout.
- Transform complex multi-currency transactional data into clear, actionable executive insights.

Qualifications:
- 4+ years of data analytics experience with a track record of driving business outcomes.
- Master of SQL; strong command of data warehousing (Snowflake, BigQuery, Redshift) and BI tools (Tableau, Looker).
- High written and analytical communication skills with attention to detail.`
      },
      {
        id: 'stripe_fullstack',
        roleTitle: 'Senior Full-Stack Engineer — Payments Infrastructure',
        category: 'Engineering',
        level: 'L4 / Senior',
        description: 'Design and build developer-facing dashboards, real-time analytics engines, and resilient payment APIs powering global businesses.',
        responsibilities: [
          'Design, build, and maintain mission-critical payment workflows with 99.999% availability.',
          'Architect clean, high-performance web applications using React, TypeScript, and modern backend services.'
        ],
        requirements: ['5+ years of full-stack production engineering experience with TypeScript/Node.js and PostgreSQL.'],
        sampleJd: `Role: Senior Full-Stack Engineer — Payments Infrastructure at Stripe\nLocation: Remote / San Francisco, CA\n\nKey Responsibilities:\n- Design, build, and maintain mission-critical payment workflows with extreme reliability (99.999% availability).\n- Architect clean, high-performance web applications using React, TypeScript, and modern backend services.\n- Champion engineering craft, rigorous code reviews, automated testing, and operational incident response.\n\nRequirements:\n- 5+ years of production full-stack engineering experience.\n- Strong proficiency in modern TypeScript/JavaScript, React, Node.js, and relational databases (PostgreSQL).`
      }
    ]
  },
  'microsoft': {
    name: 'Microsoft',
    domain: 'microsoft.com',
    industry: 'Enterprise Software / Cloud / AI',
    headquarters: 'Redmond, WA',
    description: 'Global developer of enterprise platforms, cloud services (Azure), productivity software (Microsoft 365), gaming (Xbox), and artificial intelligence solutions (Copilot).',
    interviewStyle: 'Competency-based behavioral rounds focused on Growth Mindset, customer obsession, and systems scalability.',
    keyValues: ['Growth Mindset', 'Customer Obsession', 'Diversity and Inclusion', 'One Microsoft', 'Making a Difference'],
    coreTechOrSkills: ['Cloud Architecture', 'Customer Empathy', 'Cross-Team Collaboration', 'Scalable Code Quality'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'msft_data_analyst',
        roleTitle: 'Senior Data Analyst — Azure & AI Growth Analytics',
        category: 'Data & Analytics',
        level: 'Senior / L63',
        description: 'Analyze Azure cloud consumption, enterprise customer telemetry, and AI Copilot adoption trends.',
        responsibilities: [
          'Construct enterprise data models using Azure Synapse, Databricks, and Power BI.',
          'Identify usage patterns, customer expansion opportunities, and capacity forecasting.'
        ],
        requirements: ['4+ years of data analysis experience with Power BI, SQL, Python, and cloud telemetry.'],
        sampleJd: `Role: Senior Data Analyst — Azure & AI Growth Analytics at Microsoft\nLocation: Redmond, WA / Remote\n\nKey Responsibilities:\n- Deliver impactful data insights and predictive analytics on Azure consumption.\n- Create Power BI executive reports and statistical regression models for leadership.`
      },
      {
        id: 'msft_swe',
        roleTitle: 'Senior Software Engineer — Azure Distributed Systems',
        category: 'Engineering',
        level: 'L63 / Senior',
        description: 'Develop resilient cloud microservices, control planes, and hyper-scale infrastructure on Azure.',
        responsibilities: ['Build high-scale distributed backend services with C#, Go, and Kubernetes.'],
        requirements: ['5+ years of backend development and cloud architecture.'],
        sampleJd: `Role: Senior Software Engineer — Azure Distributed Systems at Microsoft\nLocation: Redmond, WA\n\nKey Responsibilities:\n- Architect high-scale Azure cloud infrastructure and microservices with C#, Go, and C++.`
      }
    ]
  },
  'amazon': {
    name: 'Amazon',
    domain: 'amazon.com',
    industry: 'E-Commerce / Cloud Computing / Logistics',
    headquarters: 'Seattle, WA',
    description: 'World leader in cloud infrastructure (AWS), e-commerce logistics, digital streaming, and automated supply chains.',
    interviewStyle: 'Strict Leadership Principles (LP) STAR interrogation by a dedicated Bar Raiser. Expect deep probing into metrics, ownership, and disagree & commit.',
    keyValues: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Are Right, A Lot', 'Bias for Action', 'Deliver Results'],
    coreTechOrSkills: ['AWS', 'Operational Excellence', 'Metrics-Driven Results', 'Root Cause Analysis (5 Whys)'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'amzn_data_analyst',
        roleTitle: 'Business Intelligence & Data Analyst II',
        category: 'Data & Analytics',
        level: 'L5 / Level II',
        description: 'Drive operational efficiencies, fulfillment metrics, and customer satisfaction using AWS analytics tools.',
        responsibilities: [
          'Design automated ETL pipelines, Redshift data warehouses, and QuickSight dashboards.',
          'Analyze fulfillment network bottlenecks, shipping SLAs, and customer return cohorts.'
        ],
        requirements: ['3+ years experience with SQL, AWS Redshift, Python, and QuickSight/Tableau.'],
        sampleJd: `Role: Business Intelligence & Data Analyst II at Amazon\nLocation: Seattle, WA\n\nKey Responsibilities:\n- Write optimized SQL queries on Amazon Redshift and DynamoDB to analyze customer purchasing patterns.\n- Build self-service QuickSight dashboards for supply chain and fulfillment operations leadership.`
      },
      {
        id: 'amzn_sde2',
        roleTitle: 'Software Development Engineer II (SDE II) — AWS Core',
        category: 'Engineering',
        level: 'SDE II / L5',
        description: 'Build scalable cloud services that handle millions of requests per second with strict fault tolerance.',
        responsibilities: ['Design and deploy microservices on AWS (DynamoDB, ECS, S3, SQS).'],
        requirements: ['3+ years professional software engineering experience with Java, Python, or Go.'],
        sampleJd: `Role: Software Development Engineer II — AWS Core Services at Amazon\nLocation: Seattle, WA\n\nKey Responsibilities:\n- Act as a key contributor in the design, development, and operation of large-scale distributed systems.\n- Embody Amazon Leadership Principles (Customer Obsession, Ownership, Deliver Results, Dive Deep).\n- Implement robust monitoring, automated CI/CD, and fault-tolerant infrastructure.`
      }
    ]
  },
  'netflix': {
    name: 'Netflix',
    domain: 'netflix.com',
    industry: 'Streaming Entertainment & High-Scale Media',
    headquarters: 'Los Gatos, CA',
    description: 'Leading subscription streaming service and content studio operating global streaming infrastructure and machine learning recommendation algorithms for hundreds of millions of subscribers.',
    interviewStyle: 'Culture memo-aligned interviews assessing high talent density, context over control, direct candid feedback, and stunning colleagues.',
    keyValues: ['Freedom and Responsibility', 'Context Not Control', 'Highly Aligned Loosely Coupled', 'Stunning Colleagues', 'Direct Candor'],
    coreTechOrSkills: ['Microservices', 'High-Throughput Distributed Systems', 'Self-Direction', 'High-Ownership Judgement', 'Data Analytics'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'netflix_data_analyst',
        roleTitle: 'Senior Data Analyst — Content & Streaming Telemetry',
        category: 'Data & Analytics',
        level: 'Senior',
        description: 'Analyze viewer engagement, stream quality of experience (QoE), and content performance metrics globally.',
        responsibilities: [
          'Design Big Data analyses in Spark/SQL on Apache Iceberg and build visualization suites.',
          'Evaluate A/B experiments on recommendation algorithms, UI artwork personalization, and player playback.'
        ],
        requirements: ['5+ years of data analysis experience in media streaming, gaming, or high-scale consumer apps.'],
        sampleJd: `Role: Senior Data Analyst — Content & Streaming Telemetry at Netflix\nLocation: Los Gatos, CA / Remote\n\nKey Responsibilities:\n- Deliver data insights on streaming bitrate quality, rebuffering rates, and global title engagement.\n- Formulate statistical experiment designs to test novel personalization algorithms.`
      },
      {
        id: 'netflix_senior_swe',
        roleTitle: 'Senior Distributed Systems Engineer — Core Delivery',
        category: 'Engineering',
        level: 'Senior',
        description: 'Architect open-source edge proxies, microservices mesh, and real-time video streaming pipelines.',
        responsibilities: ['Build high-throughput systems handling terabits of video traffic per second.'],
        requirements: ['5+ years designing distributed systems in Java, Go, or Node.js.'],
        sampleJd: `Role: Senior Distributed Systems Engineer at Netflix\nLocation: Los Gatos, CA\n\nKey Responsibilities:\n- Architect high-throughput video delivery systems and edge routing proxies.\n- Own end-to-end reliability under Netflix Freedom & Responsibility culture.`
      }
    ]
  },
  'meta': {
    name: 'Meta',
    domain: 'meta.com',
    industry: 'Social Technologies, AI & Virtual Reality',
    headquarters: 'Menlo Park, CA',
    description: 'Builder of technologies that help people connect, find communities, and grow businesses across Instagram, WhatsApp, Quest, and open-source AI (Llama models).',
    interviewStyle: 'Signal-driven behavioral and architecture interviews assessing Move Fast, Be Bold, and executing under high ambiguity.',
    keyValues: ['Move Fast', 'Focus on Long-Term Impact', 'Build Awesome Things', 'Live in the Future', 'Be Direct and Respectful'],
    coreTechOrSkills: ['Large Scale Systems', 'Product Sense', 'Rapid Iteration', 'Async Communication', 'SQL & Experimentation'],
    source: 'db',
    verified: true,
    availableRoles: [
      {
        id: 'meta_data_analyst',
        roleTitle: 'Data Analyst / Product Analytics — Instagram Growth',
        category: 'Data & Analytics',
        level: 'IC4 / IC5',
        description: 'Analyze creator engagement, video Reels consumption, algorithm ranking metrics, and user growth.',
        responsibilities: [
          'Author complex SQL queries in Presto/Scuba and design metric frameworks for Reels and Stories.',
          'Execute statistical A/B test readouts on recommendation algorithms and social interactions.'
        ],
        requirements: ['4+ years in product analytics, SQL, Python, and experimental causal inference.'],
        sampleJd: `Role: Product Analytics / Data Analyst at Meta\nLocation: Menlo Park, CA / Remote\n\nKey Responsibilities:\n- Define KPIs and execute exploratory data analyses on Instagram and WhatsApp product features.\n- Partner with engineering to diagnose funnel drop-offs and drive user retention.`
      }
    ]
  },
  'apple': {
    name: 'Apple',
    domain: 'apple.com',
    industry: 'Consumer Hardware, Operating Systems & Services',
    headquarters: 'Cupertino, CA',
    description: 'Creator of iPhone, Mac, iPad, Apple Watch, Vision Pro, iOS/macOS operating systems, Apple Silicon, and privacy-centric ecosystem services.',
    interviewStyle: 'Deep domain mastery, confidentiality, fanatic attention to detail, and cross-functional alignment.',
    keyValues: ['Attention to Detail', 'User Privacy', 'Simplicity', 'End-to-End Excellence'],
    coreTechOrSkills: ['Performance Optimization', 'Clean Architecture', 'Deep Technical Craftsmanship'],
    source: 'db',
    verified: true
  },
  'goldman sachs': {
    name: 'Goldman Sachs',
    domain: 'goldmansachs.com',
    industry: 'Investment Banking & Financial Markets',
    headquarters: 'New York, NY',
    description: 'Global financial institution providing investment banking, securities, asset management, prime brokerage, and risk analysis.',
    interviewStyle: 'High-pressure case scenarios evaluating risk management, quantitative rigor, integrity, and client presentation skills.',
    keyValues: ['Client Service', 'Integrity', 'Excellence', 'Partnership'],
    coreTechOrSkills: ['Risk Modeling', 'Low-Latency Architecture', 'Financial Compliance', 'Analytical Rigor', 'SQL & Python'],
    source: 'db',
    verified: true
  },
  'uber': {
    name: 'Uber',
    domain: 'uber.com',
    industry: 'Mobility & Delivery Marketplace',
    headquarters: 'San Francisco, CA',
    description: 'On-demand platform connecting riders, drivers, couriers, and merchants globally in real-time.',
    interviewStyle: 'Real-time marketplace dynamics, fast problem decomposition, resilience, and operational scaling.',
    keyValues: ['Go Get It', 'Trip Zero', 'Build with Heart', 'Great Minds Do Not Think Alike'],
    coreTechOrSkills: ['Real-Time Geospatial Systems', 'Dispatch Algorithms', 'High Availability', 'Pragmatism'],
    source: 'db',
    verified: true
  },
  'tesla': {
    name: 'Tesla',
    domain: 'tesla.com',
    industry: 'Automotive, Autonomous Systems & Energy',
    headquarters: 'Austin, TX',
    description: 'Accelerating the world transition to sustainable energy through electric vehicles, solar power, battery storage, and AI robotics (Autopilot/FSD).',
    interviewStyle: 'First-principles thinking, intense work ethic, rapid problem solving, and ability to handle extreme constraints.',
    keyValues: ['First Principles Reasoning', 'Extreme Urgency', 'Direct Communication', 'Hands-On Problem Solving'],
    coreTechOrSkills: ['Hardware-Software Integration', 'Computer Vision / Robotics', 'Optimization', 'Speed of Execution'],
    source: 'db',
    verified: true
  },
  'mckinsey': {
    name: 'McKinsey & Company',
    domain: 'mckinsey.com',
    industry: 'Management Consulting & Strategic Advisory',
    headquarters: 'New York, NY',
    description: 'Global management consulting firm advising top corporations, institutions, and governments on strategy, digital transformation, and operations.',
    interviewStyle: 'Rigid Case Interview framework and Personal Experience Interview (PEI) assessing leadership, structured problem decomposition, and MECE logic.',
    keyValues: ['Obligation to Dissent', 'Client First', 'Top-down Communication', 'Structured Problem Solving'],
    coreTechOrSkills: ['MECE Frameworks', 'Hypothesis-Driven Synthesis', 'Executive Presence', 'Quant Analysis'],
    source: 'db',
    verified: true
  }
};

// Demo users to allow seamless testing of candidate tracks and returning user flows
export const seedUsers: Record<string, UserProfile> = {
  'demo-undergrad': {
    id: 'user_ug_01',
    name: 'Rohan Patel',
    email: 'rohan.patel@college.edu',
    isReturningUser: false,
    candidateTrack: 'undergraduate',
    savedCompanyName: 'Google',
    savedRoleTitle: 'Software Engineer I (New Grad / Campus Placement)',
    savedResumeFileName: 'Rohan_Patel_College_CS_Resume.pdf',
    savedAtsScore: 82,
    savedResumeText: `ROHAN PATEL - Undergraduate Senior (B.S. in Computer Science, Graduating May 2026)
Education: University of Michigan — GPA: 3.8/4.0
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Systems, Web Development, Distributed Systems.
Projects:
- Campus Course Planner (Full Stack): Built a React + Node.js course recommendation platform used by 2,500+ undergraduate students during course registration. Implemented Dijkstra algorithm for conflict-free schedule generation.
- Hackathon Winner (HackState): Developed real-time collaborative code review tool using WebSockets and TypeScript.
Technical Skills: Python, TypeScript, React, Java, C++, PostgreSQL, Git, Docker, REST APIs.`
  },
  'demo-mba': {
    id: 'user_mba_01',
    name: 'Priya Sharma',
    email: 'priya.sharma@mba.edu',
    isReturningUser: true,
    candidateTrack: 'postgraduate_mba',
    lastSessionDate: '2026-08-28',
    savedCompanyName: 'Amazon',
    savedRoleTitle: 'Product Manager (MBA Leadership Track)',
    savedResumeFileName: 'Priya_Sharma_MBA_PM_Resume.pdf',
    savedAtsScore: 88,
    savedResumeText: `PRIYA SHARMA - MBA Candidate & Former Tech Consultant
Education: Kellogg School of Management, Northwestern University (MBA, Class of 2026)
Prior Experience:
- Senior Associate Consultant at Bain & Company (3 Years): Spearheaded digital transformation strategy for Fortune 500 retail client, identifying $18M in supply chain efficiency gains. Led cross-functional squad of 8 analysts.
- Associate Product Manager Intern: Defined PRD and go-to-market strategy for enterprise SaaS analytics dashboard, increasing trial conversion by 22%.
Skills: Product Discovery, User Journey Mapping, Financial Modeling, Stakeholder Management, SQL, Agile/Scrum, Unit Economics.`
  },
  'demo-research': {
    id: 'user_res_01',
    name: 'Dr. Aris Vance',
    email: 'aris.vance@lab.edu',
    isReturningUser: false,
    candidateTrack: 'research_phd',
    savedCompanyName: 'Microsoft',
    savedRoleTitle: 'Research Scientist — Foundation Models & AI Lab (PhD/Postdoc)',
    savedResumeFileName: 'Dr_Aris_Vance_AI_Research_Resume.pdf',
    savedAtsScore: 92,
    savedResumeText: `DR. ARIS VANCE - PhD in Computer Science (Machine Learning & NLP)
Education: Stanford University (PhD in Computer Science, 2026); B.S. in Applied Mathematics (MIT).
Publications:
- First-author in NeurIPS 2025: 'Efficient Attention Routing and Latent Reasoning in Multimodal Transformers'.
- First-author in ICML 2024: 'Provable Convergence Bounds in Sparse Mixture-of-Experts Scaling'.
Research Experience: AI Research Intern at OpenAI/DeepMind. Designed custom CUDA kernels and distributed TPU training recipes in PyTorch and JAX.
Skills: Deep Learning, PyTorch, JAX, CUDA, Foundation Models, Mathematical Proofs, Statistical Physics, Distributed Cluster Training.`
  },
  'demo-returning': {
    id: 'user_returning_01',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    isReturningUser: true,
    candidateTrack: 'experienced_pro',
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

// Session evaluation store - initialized empty, populated strictly as users complete live interview drills
export const initialHistoricalSessions: SessionEvaluation[] = [];

export const sessionEvaluations: Map<string, SessionEvaluation> = new Map();


