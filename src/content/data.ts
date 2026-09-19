export const profile = {
  name: "Venugopal V",
  shortName: "Venu",
  monogram: "VV",
  role: "AI/ML Engineer Intern",
  headline: "I build multi-agent AI systems.",
  tagline:
    "AI & Data Science student building multi-agent AI systems, machine learning solutions, and blockchain applications.",
  summary:
    "AI & Data Science student building multi-agent AI systems, machine learning solutions, and blockchain applications. Currently contributing to a production multi-agent digital workforce platform, with experience spanning AI agent implementation, LLM fine-tuning, and decentralized verification systems. Strong foundation in Python, data-driven problem-solving, and modern development tools. Actively seeking internships in Data Science, AI, and Blockchain.",
  openTo: "Internships in Data Science, AI, and Blockchain",
  location: "Madurai, Tamil Nadu, India",
  email: "Venu25122005@gmail.com",
  phone: "+91-7010422347",
  showPhone: false,
  linkedin: "https://linkedin.com/in/venugopal-v-61a50b3a9",
  github: "https://github.com/venu2512",
  resumePdf: "/Venugopal_V_Resume.pdf",
  languages: [
    { name: "Tamil", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "Telugu", level: "Conversational" },
  ],
  heroChips: ["Python", "Multi-Agent Systems", "QLoRA", "Ethereum", "React.js"],
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
    period: "May 2026 – Present",
    current: true,
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
    period: null, // not on resume: do NOT render a date
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
    period: null,
    bullets: [
      "Designed and trained ML models for real-world applications, iterating on architecture based on performance results.",
      "Improved model performance through systematic tuning and optimization.",
    ],
  },
];

export const projects = [
  {
    id: "certchain",
    name: "CertChain",
    subtitle: "Blockchain Certificate Verification System",
    stack: ["Ethereum (Sepolia)", "Smart Contracts", "Web3.js", "MetaMask", "QR Verification"],
    repoUrl: null as string | null, // user fills; render link only if non-null
    bullets: [
      "Architected a decentralized certificate verification system on Ethereum (Sepolia), addressing fake-credential fraud in academic and professional settings.",
      "Designed and deployed tamper-proof smart contracts to guarantee immutable certificate records.",
      "Built QR-based verification for instant, public-facing validation of certificate authenticity.",
      "Developed secure backend APIs for certificate issuance and authentication, with an Admin Portal for institutions and a public User Portal.",
    ],
  },
  {
    id: "legal-ai",
    name: "Legal AI Chatbot",
    subtitle: "Domain-specific legal assistant",
    stack: ["Gemma", "QLoRA", "LLM Fine-Tuning", "Python"],
    repoUrl: null as string | null,
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
    repoUrl: null as string | null,
    bullets: [
      "Built and deployed a scalable MERN stack application with a modern UI, REST APIs, and MongoDB-backed data handling.",
      "Shipped frontend to Vercel and backend to Render, establishing a production-style deployment pipeline.",
    ],
  },
];

export const skills = [
  { id: "lang", label: "Languages", color: "primary", items: ["Python", "SQL", "Java"] },
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
  { id: "viz", label: "Visualization", color: "blush", items: ["Power BI", "Matplotlib", "Seaborn", "Plotly"] },
  {
    id: "web",
    label: "Web Development",
    color: "sky",
    items: ["HTML", "CSS", "MongoDB", "Express.js", "React.js", "Node.js", "REST APIs"],
  },
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

// FAQ: answers derived only from the data above (no new claims).
export const faq = [
  {
    q: "What kind of roles are you looking for?",
    a: "Internships in Data Science, AI, and Blockchain.",
  },
  {
    q: "What are you working on right now?",
    a: "As an AI/ML Engineer Intern at KreupAI Technologies LLC, I contribute to the AISA multi-agent digital workforce platform: agent logic, backend pipelines, and integration testing, including the AI Legal Contract Analyst and modules for the DaftarAccounting platform.",
  },
  {
    q: "What is your technical stack?",
    a: "Python, SQL, and Java; Pandas, NumPy, Scikit-learn, TensorFlow, and OpenCV; the MERN stack; Ethereum, smart contracts, and Web3.js; plus Power BI, Streamlit, Git, and Apache Kafka.",
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

// Derived stats — computed, never hard-coded.
export function deriveStats(): Array<{ value: number | string; label: string }> {
  return [
    { value: experience.length, label: "Internships" },
    { value: projects.length, label: "Projects" },
    { value: skills.length, label: "Skill areas" },
    { value: 2027, label: "B.Tech graduation" },
  ];
}
