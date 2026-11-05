export const profile = {
  name: "Venugopal V",
  shortName: "Venu",
  monogram: "VV",
  role: "Aspiring AI Engineer",
  headline: "Venugopal V",
  tagline:
    "Aspiring AI Engineer building multi-agent AI systems, LLM applications, and enterprise AI platforms.",
  summary:
    "Aspiring AI Engineer with practical experience in multi-agent AI systems, LLM applications, and enterprise AI platforms. Passionate about Agentic AI, Generative AI, and Machine Learning, with a strong interest in developing scalable AI solutions that solve real-world business challenges. Seeking opportunities to contribute to innovative AI products while continuously expanding my technical expertise.",
  openTo:
    "Full-time roles and internships in AI, ML, Data Analytics, and Full Stack Development",
  openToShort: "Open to full-time roles and internships",
  location: "Madurai, Tamil Nadu, India",
  phone: "+91-7010422347",
  showPhone: true,
  email: "Venu25122005@gmail.com",
  linkedin: "https://linkedin.com/in/venugopal-v",
  github: "https://github.com/venu2512",
  resumePdf: "/Venugopal_V_Resume.pdf",
  languages: [
    { name: "Tamil", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "Telugu", level: "Conversational" },
  ],
  heroChips: ["Python", "Multi-Agent Systems", "LLM Fine-Tuning (QLoRA)", "Docker", "Power BI"],
  photo: {
    src: "/profile/profile.jpg",
    cutout: "/profile/profile-cutout.png",
    alt: "Portrait of Venugopal V",
    focus: { x: 0.5, y: 0.3 },
  },
};

export const experience = [
  // most recent first, as on the resume
  {
    id: "kreupai",
    org: "KreupAI Technologies LLC",
    title: "AI/ML Engineer Intern",
    location: "Dubai, UAE (Remote)",
    startDate: "May 2026",
    endDate: "August 2026",
    current: false,
    bullets: [
      "Built five enterprise AI agents (Contract Analyst, Executive Assistant, Procurement Officer, QA Coordinator, Payroll Agent) for the AISA AI Workforce Platform, plus AI-powered modules and a multilingual AI Assistant for the Daftar Accounting platform.",
      "Tech Stack: Python, LLM Prompt Engineering, Multi-Agent Orchestration, Kafka, React, REST APIs",
    ],
    tools: [
      "Contract Analyst",
      "Executive Assistant",
      "Procurement Officer",
      "QA Coordinator",
      "Payroll Agent",
      "Daftar Accounting AI Assistant",
    ],
  },
  {
    id: "quadedutor",
    org: "QuadEdutor Pvt. Ltd.",
    title: "Data Science Intern",
    location: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
    current: false,
    bullets: [
      "Cleaned real-world datasets and ran EDA/visualizations; built ML models translating data into actionable insights.",
      "Tech Stack: Python, Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn",
    ],
  },
  {
    id: "nitroware",
    org: "Nitroware Technologies",
    title: "AI & ML Intern",
    location: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
    current: false,
    bullets: [
      "Designed and tuned ML models for real-world applications, improving performance through iteration.",
      "Tech Stack: Python, Scikit-learn, TensorFlow, Pandas, NumPy",
    ],
  },
];

/** "May 2026 – August 2026" or "May 2026 – Completed" when endDate is null; never "Present". */
export function experiencePeriod(job: (typeof experience)[number]): string {
  if (job.startDate && job.endDate) return `${job.startDate} – ${job.endDate}`;
  if (job.startDate) return `${job.startDate} – Completed`;
  return "";
}

export const projects = [
  {
    id: "ai-college",
    name: "AI College Management System",
    subtitle: "Autonomous multi-agent university operating system",
    image: "/projects/ai-college.svg",
    stack: ["LangGraph", "FastAPI", "PostgreSQL (pgvector)", "RAG", "XGBoost", "React", "Docker"],
    repoUrl: "https://github.com/venu2512/AI-COLLEGE-MANAGEMENT",
    bullets: [
      "Designed and built an autonomous multi-agent university operating system with eight specialized AI agents handling academic and administrative workflows.",
      "Integrated RAG with PostgreSQL (pgvector) vector store, LangGraph agent workflows, and predictive analytics using XGBoost.",
    ],
  },
  {
    id: "ebook-studio",
    name: "Ebook Studio AI",
    subtitle: "AI-powered ebook generation & publishing platform",
    image: "/projects/ebook-studio.svg",
    stack: ["Next.js", "Python", "FastAPI", "LLMs", "Prompt Engineering", "Tailwind CSS"],
    repoUrl: "https://github.com/venu2512/ebook-studio-ai",
    bullets: [
      "Built an end-to-end AI platform that structures, writes, formats, and illustrates complete books from conversational prompts.",
      "Implemented automated chapter sequencing, narrative style consistency, cover generation, and one-click export to PDF and EPUB.",
    ],
  },
  {
    id: "code-judge",
    name: "Code Breakers Judge",
    subtitle: "Automated code execution & competitive programming judge",
    image: "/projects/code-judge.svg",
    stack: ["Python", "FastAPI", "Docker", "React.js", "Redis", "REST APIs"],
    repoUrl: "https://github.com/venu2512/code-breakers-judge",
    bullets: [
      "Architected an automated code judging platform executing user-submitted code in isolated sandbox containers across multiple programming languages.",
      "Engineered real-time test case evaluation, memory/time limit enforcement, and dynamic leaderboard scoring.",
    ],
  },
  {
    id: "automl-pipeline",
    name: "AutoML & EDA Pipeline",
    subtitle: "Automated Data Analysis & ML Pipeline with Streamlit",
    image: "/projects/automl-pipeline.svg",
    stack: ["Python", "Streamlit", "Pandas", "Scikit-learn", "Plotly", "AutoML"],
    repoUrl: "https://github.com/venu2512/Automated-Data-Analysis-and-Machine-Learning-Pipeline-with-Streamlit",
    bullets: [
      "Built an end-to-end automated exploratory data analysis (EDA) and machine learning pipeline with an interactive Streamlit web interface.",
      "Automated missing value handling, categorical feature encoding, hyperparameter tuning, model comparison, and interactive Plotly visualizations.",
    ],
  },
  {
    id: "legal-ai",
    name: "Legal AI Chatbot",
    subtitle: "Domain-specific legal assistant",
    image: "/projects/legal-ai.svg",
    stack: ["Python", "Ollama", "QLoRA", "Gemma", "Prompt Engineering"],
    repoUrl: "https://github.com/venu2512/lex-chatbot",
    bullets: [
      "Fine-tuned an LLM (Gemma) using QLoRA to build a low-resource, domain-specific legal chatbot for answering legal queries.",
      "Implemented contextual query understanding and efficient inference using Ollama.",
    ],
  },
  {
    id: "cloud-nova",
    name: "Cloud Nova",
    subtitle: "Full Stack Web Application",
    image: "/projects/cloud-nova.svg",
    stack: ["MERN Stack", "REST APIs", "Vercel", "Render", "CI/CD"],
    repoUrl: "https://github.com/venu2512/cloud-web",
    bullets: [
      "Built and deployed a full-stack web application with REST APIs, enabling core business workflows end-to-end.",
      "Shipped frontend to Vercel and backend to Render, establishing a production-style deployment pipeline.",
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
  {
    id: "lang",
    label: "Languages",
    color: "primary",
    items: ["Python", "Java"],
  },
  {
    id: "db",
    label: "Databases",
    color: "cream",
    items: ["MongoDB", "SQL"],
  },
  {
    id: "web",
    label: "Web Development",
    color: "sky",
    items: ["HTML", "CSS", "MERN Stack"],
  },
  {
    id: "viz",
    label: "Visualization",
    color: "blush",
    items: ["Power BI", "Matplotlib", "Seaborn", "Plotly"],
  },
  {
    id: "vcs",
    label: "Version Control",
    color: "ink",
    items: ["Git", "GitHub"],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    color: "white",
    items: ["VS Code", "Streamlit", "Docker"],
  },
  {
    id: "chain",
    label: "Blockchain",
    color: "cream",
    items: ["Ethereum", "Smart Contracts"],
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

// FAQ: answers use only resume facts or verified project details.
export const faq = [
  {
    q: "What kind of roles are you looking for?",
    a: "I am looking for full-time roles and internships as an AI Engineer, ML Engineer, Data Analyst, and Full Stack Developer.",
  },
  {
    q: "What are you working on right now?",
    a: "I recently completed my internship at KreupAI Technologies LLC, where I built enterprise AI agents and platform features on the AISA multi-agent digital workforce platform. I also designed and built the AI College Multiagent System, an autonomous university operating system with eight specialized AI agents.",
  },
  {
    q: "What is your technical stack?",
    a: "For AI and ML, I work with Python, Pandas, NumPy, Scikit-learn, TensorFlow, OpenCV, LangGraph, LLM Fine-Tuning (QLoRA, Gemma, Ollama), Multi-Agent Systems, and Prompt Engineering. For backend and web development, I build with FastAPI, MERN Stack (MongoDB, Express, React, Node.js), REST APIs, SQL, and Docker. I visualize data with Power BI, Matplotlib, Seaborn, and Plotly, and deploy via Vercel and Render.",
  },
  {
    q: "Do you have experience building multi-agent systems?",
    a: "Yes. At KreupAI Technologies, I built five enterprise AI agents (Contract Analyst, Executive Assistant, Procurement Officer, QA Coordinator, Payroll Agent) for the AISA AI Workforce Platform. In addition, I architected the AI College Multiagent System, coordinating eight specialized agents across academic and administrative workflows using LangGraph and FastAPI.",
  },
  {
    q: "Do you have experience fine-tuning LLMs?",
    a: "Yes. My Legal AI Chatbot fine-tunes Gemma using QLoRA for efficient, low-resource deployment with Ollama.",
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
    a: "Yes, use the Download Resume button on this page to get the latest PDF.",
  },
];

/**
 * Four capability tiles — one per target role (AI Engineer, ML Engineer, Data Analyst, Full Stack Developer).
 * Every line maps directly to experiences and projects from the resume.
 */
export const roles = [
  {
    id: "ai",
    title: "AI Engineer",
    line: "Autonomous university OS with eight agents & five enterprise workforce agents",
    source: "projects[ai-college] + experience[kreupai]",
    href: "#projects",
    color: "lavender",
    chips: ["Multi-Agent Systems", "Prompt Engineering", "LLM Fine-Tuning (QLoRA)"],
  },
  {
    id: "ml",
    title: "ML Engineer",
    line: "LLM fine-tuning with QLoRA & model iteration across internships",
    source: "projects[legal-ai] + experience[nitroware]",
    href: "#projects",
    color: "sky",
    chips: ["TensorFlow", "Scikit-learn", "NumPy"],
  },
  {
    id: "data",
    title: "Data Analyst",
    line: "Cleaning, EDA and visualization on real-world datasets with ML insights",
    source: "experience[quadedutor]",
    href: "#experience",
    color: "blush",
    chips: ["Pandas", "Power BI", "Plotly"],
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    line: "Full-stack web application with REST APIs, deployed to Vercel and Render",
    source: "projects[cloud-nova]",
    href: "#projects",
    color: "cream",
    chips: ["MERN Stack", "REST APIs", "Docker"],
  },
] as const;

// Derived stats — computed, never hard-coded.
export function deriveStats(): Array<{
  value: number | string;
  label: string;
  caption: string;
  href: string;
}> {
  return [
    { value: experience.length, label: "Internships", caption: "roles on the résumé", href: "#experience" },
    { value: "10+", label: "Projects", caption: "built & deployed", href: "#projects" },
    { value: skills.length, label: "Skill areas", caption: "categories under Skills", href: "#skills" },
    { value: 2027, label: "B.Tech graduation", caption: education[0]?.school ?? "", href: "#education" },
  ];
}
