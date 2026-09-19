export const profile = {
  name: "Venugopal V",
  shortName: "Venu",
  monogram: "VV",
  role: "AI/ML Engineer Intern",
  headline: "Venugopal V",
  tagline:
    "AI & Data Science student building multi-agent AI systems, machine learning solutions, and blockchain applications.",
  // Owner-provided wording (§3.1). Confirm before ship.
  summary:
    "AI & Data Science student building multi-agent AI systems, machine learning solutions, and blockchain applications. Recently completed an internship contributing to a production multi-agent digital workforce platform, with experience spanning AI agent implementation, LLM fine-tuning, and decentralized verification systems. Strong foundation in Python, data-driven problem-solving, and modern development tools. Looking for full-time roles and internships in AI, ML, Data Analytics, and Full Stack Development.",
  // Long form: CTA banner subtext, meta description, JSON-LD description.
  openTo:
    "Full-time roles and internships in AI, ML, Data Analytics, and Full Stack Development",
  // Short form: hero eyebrow pill, announcement bar.
  openToShort: "Open to full-time roles and internships",
  // OWNER: confirm
  location: "Madurai, Tamil Nadu, India",
  email: "Venu25122005@gmail.com",
  // No `phone` field exists: while the owner's number is private, the site
  // contains no phone JSX and no phone string anywhere (§3.3 structural guard).
  // When the owner wants it shown, re-add `phone` AND the JSX in CtaBanner.
  showPhone: false,
  linkedin: "https://linkedin.com/in/venugopal-v-61a50b3a9",
  github: "https://github.com/venu2512",
  resumePdf: "/Venugopal_V_Resume.pdf",
  languages: [
    { name: "Tamil", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "Telugu", level: "Conversational" },
  ],
  // All five chips exist in the skills data below (§3.1).
  heroChips: ["Python", "Multi-Agent Systems", "QLoRA", "React.js", "Power BI"],
  photo: {
    src: "/profile/profile.jpg", // required for best result
    cutout: "/profile/profile-cutout.png", // optional transparent PNG
    alt: "Portrait of Venugopal V",
    focus: { x: 0.5, y: 0.3 }, // face position, 0 = top/left, 1 = bottom/right
  },
};

export const experience = [
  // most recent first, as on the resume
  {
    id: "kreupai",
    org: "KreupAI Technologies LLC",
    title: "AI/ML Engineer Intern",
    startDate: "May 2026",
    // Real end date from public/Venugopal_V_Resume.pdf ("May 2026 – August 2026").
    endDate: "August 2026",
    current: false,
    bullets: [
      "Contribute across multiple repositories within KreupAI's AISA multi-agent digital workforce platform, spanning agent logic, backend pipelines, and integration testing.",
      "Implemented and integrated multiple AI agents, including the AI Legal Contract Analyst, building ContractParserTool, ClauseExtractorTool, ContractRiskScorerTool, and ObligationTrackerTool for automated contract parsing, clause extraction, risk scoring, and obligation tracking.",
      "Built out modules for the DaftarAccounting platform, including an AI Assistant, to automate and streamline accounting workflows.",
      "Partner cross-functionally on multi-agent implementation and testing to ship scalable, production-ready agent-based workflows.",
    ],
    tools: [
      "ContractParserTool",
      "ClauseExtractorTool",
      "ContractRiskScorerTool",
      "ObligationTrackerTool",
      "DaftarAccounting AI Assistant",
    ],
  },
  {
    id: "quadedutor",
    org: "QuadEdutor Pvt. Ltd.",
    title: "Data Science Intern",
    startDate: null as string | null,
    endDate: null as string | null,
    current: false,
    bullets: [
      "Cleaned and preprocessed real-world datasets, resolving quality issues ahead of downstream analysis.",
      "Ran exploratory data analysis and built visualizations to surface key trends for stakeholders.",
      "Built machine learning models that translated raw data into actionable insights.",
    ],
  },
  {
    id: "nitroware",
    org: "Nitroware Technologies",
    title: "AI & ML Intern",
    startDate: null as string | null,
    endDate: null as string | null,
    current: false,
    bullets: [
      "Designed and trained ML models for real-world applications, iterating on architecture based on performance results.",
      "Improved model performance through systematic tuning and optimization.",
    ],
  },
];

/** "May 2026 – Completed" when endDate is null; never "Present". */
export function experiencePeriod(job: (typeof experience)[number]): string {
  if (job.startDate && job.endDate) return `${job.startDate} – ${job.endDate}`;
  if (job.startDate) return `${job.startDate} – Completed`;
  return "";
}

export const projects = [
  {
    id: "legal-ai",
    name: "Legal AI Chatbot",
    subtitle: "Domain-specific legal assistant",
    stack: ["Gemma", "QLoRA", "LLM Fine-Tuning", "Python"],
    repoUrl: "https://github.com/venu2512/lex-chatbot",
    bullets: [
      "Built a domain-specific legal chatbot by fine-tuning an LLM (Gemma) using QLoRA for efficient, low-resource deployment.",
      "Implemented contextual understanding to deliver accurate, relevant responses to legal queries.",
    ],
  },
  {
    id: "cloud-nova",
    name: "Cloud Nova",
    subtitle: "Full Stack Web Application",
    stack: ["MongoDB", "Express.js", "React.js", "Node.js", "Vercel", "Render"],
    repoUrl: "https://github.com/venu2512/cloud-web",
    bullets: [
      "Built and deployed a scalable MERN stack application with a modern UI, REST APIs, and MongoDB-backed data handling.",
      "Shipped frontend to Vercel and backend to Render, establishing a production-style deployment pipeline.",
    ],
  },
  {
    id: "certchain",
    name: "CertChain",
    subtitle: "Blockchain Certificate Verification System",
    stack: ["Ethereum (Sepolia)", "Smart Contracts", "Web3.js", "MetaMask", "QR Verification"],
    repoUrl: "https://github.com/venu2512/certchain",
    bullets: [
      "Architected a decentralized certificate verification system on Ethereum (Sepolia), addressing fake-credential fraud in academic and professional settings.",
      "Designed and deployed tamper-proof smart contracts to guarantee immutable certificate records.",
      "Built QR-based verification for instant, public-facing validation of certificate authenticity.",
      "Developed secure backend APIs for certificate issuance and authentication, with an Admin Portal for institutions and a public User Portal.",
    ],
  },
];

export const skills = [
  {
    id: "ai",
    label: "AI / Machine Learning",
    color: "lavender",
    items: [
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "TensorFlow",
      "OpenCV",
      "LLM Fine-Tuning (QLoRA)",
      "Multi-Agent Systems",
      "Prompt Engineering",
    ],
  },
  { id: "lang", label: "Languages", color: "primary", items: ["Python", "SQL", "Java"] },
  {
    id: "web",
    label: "Web Development",
    color: "sky",
    items: ["HTML", "CSS", "JavaScript", "MongoDB", "Angular.js", "React.js", "Node.js", "REST APIs"],
  },
  { id: "viz", label: "Visualization", color: "blush", items: ["Power BI", "Matplotlib", "Seaborn", "Plotly"] },
  {
    id: "vcs",
    label: "Version Control",
    color: "ink",
    items: [
      "Git (branching, merging, pull requests, rebasing, conflict resolution)",
      "GitHub",
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    color: "white",
    items: ["VS Code", "Streamlit", "MetaMask", "Apache Kafka"],
  },
  {
    id: "chain",
    label: "Blockchain",
    color: "cream",
    items: ["Ethereum", "Smart Contracts", "Web3.js"],
  },
];

// Keycap label rule: text before " (" (e.g. "Git", "LLM Fine-Tuning"). The DOM list shows the full text.
export function keycapLabel(item: string): string {
  const paren = item.indexOf(" (");
  return paren > 0 ? item.slice(0, paren) : item;
}

export const education = [
  {
    id: "ppg",
    school: "PPG Institute of Technology, Coimbatore",
    credential: "B.Tech in Artificial Intelligence and Data Science",
    period: "2023 – 2027",
  },
  {
    id: "msr",
    school: "MSR Matric Hr. Sec. School, Madurai",
    credential: "Higher Secondary Certificate",
    period: "2020 – 2023",
  },
];

// FAQ (§3.2): answers use only resume facts or owner statements.
export const faq = [
  {
    q: "What kind of roles are you looking for?",
    a: "I am looking for a job in the roles of AI Engineer, ML Engineer, Data Analyst, and Full Stack Developer.",
  },
  {
    q: "What are you working on right now?",
    a: "I recently completed my internship at KreupAI Technologies LLC, where I worked as an AI/ML Engineer Intern on the AISA multi-agent digital workforce platform. I'm not working anywhere right now, and I'm looking for my next opportunity.",
  },
  {
    q: "What is your technical stack?",
    a: "I work mainly in Python, SQL, and Java. For AI and machine learning, I use Pandas, NumPy, Scikit-learn, TensorFlow, and OpenCV, along with LLM fine-tuning (QLoRA), multi-agent systems, and prompt engineering. On the web side, I build with HTML, CSS, REST APIs, and the MERN stack (MongoDB, Express.js, React.js, Node.js). I visualize data with Power BI, Matplotlib, Seaborn, and Plotly, and I work with Git, GitHub, VS Code, Streamlit, and Apache Kafka.",
  },
  {
    q: "Do you have experience fine-tuning LLMs?",
    a: "Yes. My Legal AI Chatbot fine-tunes Gemma using QLoRA for efficient, low-resource deployment.",
  },
  {
    q: "Where can I see your code?",
    a: "On GitHub at github.com/venu2512.",
  },
  {
    q: "Where are you based and which languages do you speak?",
    a: "Madurai, Tamil Nadu, India. Tamil (native), English (professional), Telugu (conversational).",
  },
  {
    q: "Can I download your resume?",
    a: "Yes, use the Download Resume button on this page.",
  },
];

// Derived stats — computed, never hard-coded (§3.3).
export function deriveStats(): Array<{ value: number | string; label: string }> {
  return [
    { value: experience.length, label: "Internships" },
    { value: projects.length, label: "Projects" },
    { value: skills.length, label: "Skill areas" },
    { value: 2027, label: "B.Tech graduation" },
  ];
}
