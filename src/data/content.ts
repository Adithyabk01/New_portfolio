// All editable site content lives here.
import aboutPortrait from "@/assets/about-portrait.png.asset.json";

export const profile = {
  name: "Adithya B K",
  roles: ["Full-Stack Developer", "AI/ML Engineer", "NLP & LLM Builder"],
  tagline:
    "I build full-stack platforms and applied AI products that turn complex data into something people can actually use.",
  location: "Mandya, Karnataka, India",
  phone: "+91 89710 95311",
  email: "adithya.bk01@gmail.com",
  linkedin: "https://www.linkedin.com/in/adithya-10102004bk",
  github: "https://github.com/Adithyabk01",
  githubRepos: 19,
};

export const resumes = [
  { label: "SDE Resume", href: "/resumes/Adithya_BK_SDE_Resume.pdf" },
  { label: "AI/ML Resume", href: "/resumes/Adithya_BK_AIML.pdf" },
];

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export const about = {
  portrait: aboutPortrait.url,

  degree: "B.E. in Computer Science & Engineering — AI & ML",
  college: "PES College of Engineering, Mandya",
  period: "Oct 2023 – Oct 2027",
  cgpa: "7.73",
  paragraphs: [
    "I build production-style full-stack platforms with React, TypeScript, Next.js, FastAPI and PostgreSQL, and applied ML/NLP products with Llama3 via Ollama, Gemini Vision, scikit-learn and LangChain.",
    "I'm comfortable across the stack, from REST APIs, authentication and role-based access to responsive UI and database design.",
  ],
  stats: [
    { value: 10, suffix: "+", label: "Projects built" },
    { value: 5, suffix: "", label: "Hackathon / competition recognitions" },
    { value: 10, suffix: "+", label: "Certifications" },
    { value: 1, suffix: "", label: "ML internship" },
  ],
  academicBackground: [
    {
      institution: "Christ the King PU College, K. R. Pete",
      degree: "2nd PUC · Karnataka State Board",
      score: "89.83%",
      detail: "Achieved 89.83%, demonstrating consistent academic performance and dedication to learning.",
    },
    {
      institution: "SSKC English Medium High School, K. R. Pete",
      degree: "SSLC / 10th Grade · Karnataka State Board",
      score: "80.8%",
      detail: "Achieved 80.8%, building a strong foundation in core academic subjects.",
    },
  ],
};

export const skillGroups = [
  { name: "Languages", skills: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C", "SQL", "Swift"] },
  { name: "Web", skills: ["React.js", "Next.js", "FastAPI", "Tailwind CSS", "REST API design", "JWT auth & RBAC"] },
  {
    name: "AI/ML",
    skills: ["Scikit-learn", "Pandas", "NumPy", "NLP (TF-IDF)", "LangChain", "Llama3 (Ollama)", "Gemini Vision API", "Random Forest", "EDA"],
  },
  { name: "Data", skills: ["MySQL", "PostgreSQL", "SQLite", "Firebase", "Power BI"] },
  { name: "Tools", skills: ["Git", "GitHub", "Vercel", "Linux", "VS Code", "Jupyter", "Judge0 API"] },
  { name: "Core CS", skills: ["Data Structures & Algorithms", "System Design"] },
];

export type Category = "Full-Stack" | "AI/ML" | "Data";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  stack: string[];
  categories: Category[];
  github?: string;
  live?: string;
  privateRepo?: boolean;
  badge?: string;
};

export const featuredProjects: Project[] = [
  {
    id: "kisan-sethu",
    title: "Kisan Sethu",
    subtitle: "Agentic Agricultural Marketplace",
    description:
      "A peer-to-peer marketplace for farmers, buyers, field agents and admins that removes middlemen.",
    highlights: [
      "Autonomous reverse-auction bidding loop running as a background agent",
      "AI crop-quality grading from photos using Gemini Vision (grade, score, shelf life, defects)",
      "Multilingual AI voice onboarding for offline farmers with GPS field-agent dispatch simulation",
      "Razorpay-sandbox payments with delivery-OTP handshake and shipment tracking",
      "Reputation score plus an alternative “Kisan Credit Score” for unbanked farmers",
      "Predictive demand and price charts",
      "Auto-generated digital quality certificates with QR seals",
      "33 REST endpoints and 15 pages",
    ],
    stack: ["Next.js", "React", "TypeScript", "FastAPI", "SQLAlchemy", "SQLite", "Tailwind", "Gemini API", "Recharts"],
    categories: ["Full-Stack", "AI/ML"],
    github: "https://github.com/Adithyabk01/Kisan-Sethu",
    badge: "Academic project",
  },
  {
    id: "recoverai",
    title: "RecoverAI",
    subtitle: "AI Revenue Recovery Agent",
    description:
      "Built for the Razorpay Buildathon, Track 03. A 6-stage pipeline that detects failed-payment revenue at risk and recovers it safely. Key idea: “AI recommendation ≠ authorization.”",
    highlights: [
      "Detects revenue at risk, diagnoses the cause and recommends a recovery action",
      "Independent 9-rule Policy & Safety Gate before any action",
      "Simulates the outcome and records a 100% traceable audit trail",
      "Deterministic 1,000-record synthetic dataset in safe simulation mode",
      "Merchant dashboard and a 1-click judge demo scenarios modal",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind 4"],
    categories: ["Full-Stack", "AI/ML"],
    github: "https://github.com/Adithyabk01/RecoverAI",
  },
  {
    id: "mediread",
    title: "MediRead",
    subtitle: "AI Medical Report Understanding",
    description:
      "Extracts lab values from PDF medical reports and explains them in plain, multilingual language with voice output.",
    highlights: [
      "Lab value extraction from PDFs with parsing and regex",
      "Flags abnormal values with rule-based concern classification",
      "Llama3 via Ollama, plus a Hugging Face–powered web version",
      "Multilingual plain-language explanations with voice output",
    ],
    stack: ["Python", "NLP", "Llama3", "React", "Vite", "Vercel"],
    categories: ["AI/ML"],
    github: "https://github.com/Adithyabk01/mediread-web",
    live: "https://mediread-web.vercel.app",
    badge: "Academic project",
  },
  {
    id: "smartpave",
    title: "SmartPave",
    subtitle: "AI-Based Pavement Maintenance Optimization",
    description:
      "A civil-engineering decision-support system for the NH-275 (Mysuru) corridor. “Smarter Roads | Better Decisions | Longer Life”.",
    highlights: [
      "Automated Pavement Condition Index evaluation",
      "Degradation prediction with a scikit-learn Random Forest (300 trees, dynamic feature importance, R²/MAE/RMSE)",
      "Life-cycle-cost present-value optimisation across 12 road sections",
      "Rule-based intervention matrix and future-PCI scenario simulator",
      "Dataset upload and validation, plus a print-ready viva report",
    ],
    stack: ["FastAPI", "scikit-learn", "Pandas", "React 19", "TypeScript", "Tailwind", "Recharts"],
    categories: ["AI/ML", "Full-Stack"],
    privateRepo: true,
  },
  {
    id: "typing-arena",
    title: "The Typing Arena",
    subtitle: "Real-Time Typing Competition Platform",
    description:
      "Built for an ISTE event, with multi-round competitions, authentication, automated scoring and a live leaderboard.",
    highlights: [
      "Rounds: Typing Master, Blind Typing, Code Rush",
      "Authentication and automated scoring",
      "Live leaderboard for simultaneous participants",
    ],
    stack: ["React", "TypeScript", "Lovable"],
    categories: ["Full-Stack"],
    privateRepo: true,
  },
  {
    id: "startup-investment",
    title: "Startup Investment Trends in India",
    subtitle: "Data pipeline & dashboards",
    description:
      "Python + MySQL pipeline to clean and structure startup funding data, with interactive Power BI dashboards.",
    highlights: [
      "Cleans and structures startup funding data",
      "Sector-wise investment and top startup hubs",
      "Funding growth trends in Power BI",
    ],
    stack: ["Python", "MySQL", "Power BI"],
    categories: ["Data"],
    github: "https://github.com/Adithyabk01/Startup-Investment-Analysis",
  },
];

export const moreProjects: Project[] = [
  {
    id: "krishimitra",
    title: "KrishiMitra",
    subtitle: "Digital Agriculture Coordination Platform",
    description:
      "System design connecting Farmers, FPOs and Gram Panchayats, with crop reporting, scheme tracking, market info and a QR-based Digital Farmer ID.",
    highlights: [],
    stack: ["System design"],
    categories: ["Full-Stack"],
  },
  {
    id: "vedam",
    title: "Vedam Nutri Plan",
    subtitle: "Nutrition planning",
    description: "Nutrition-planning web app in TypeScript.",
    highlights: [],
    stack: ["TypeScript"],
    categories: ["Full-Stack"],
    github: "https://github.com/Adithyabk01/vedam-nutri-plan",
  },
  {
    id: "cancer-cell",
    title: "Cancer Cell Prediction (ML)",
    subtitle: "Supervised classification",
    description: "Supervised classification with feature reduction from 32 to 18 via correlation analysis and 5-fold cross-validation.",
    highlights: [],
    stack: ["Python", "Scikit-learn"],
    categories: ["AI/ML"],
  },
];

export const journey = [
  { date: "Oct 2023 – Oct 2027", title: "B.E. CSE (AI & ML)", org: "PES College of Engineering, Mandya", detail: "" },
  {
    date: "Aug 2024 – Oct 2024",
    title: "Machine Learning Trainee Intern",
    org: "Employability.life (with Federation University Australia)",
    detail: "Built a cancer-cell classification pipeline, cut features from 32 to 18, validated with 5-fold cross-validation.",
  },
  { date: "2025", title: "Qualified for Smart India Hackathon (SIH) 2025", org: "National level", detail: "" },
  { date: "ISTE", title: "Runner-Up, Minute to Win", org: "ISTE", detail: "2nd of 50+ participants." },
  { date: "ISTE", title: "Organizer, Typing Arena", org: "ISTE", detail: "" },
  { date: "Buildathon", title: "Participant, Razorpay Buildathon Track 03", org: "RecoverAI", detail: "" },
  {
    date: "Course",
    title: "TechSaksham Industry 4.0 Foundation Course",
    org: "Microsoft & SAP, Edunet Foundation, AICTE",
    detail: "",
  },
];

export const certifications = [
  "IBM Machine Learning with Python",
  "IBM Intro to DevOps",
  "Fundamentals of NLP (Univ. of Colorado Boulder)",
  "Intro to AI & ML on Google Cloud",
  "HKUST Software Design & Project Management",
  "Vanderbilt Prompt Engineering",
  "Deloitte Australia Technology and Data Analytics simulations (Forage)",
];
