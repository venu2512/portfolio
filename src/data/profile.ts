/**
 * SINGLE SOURCE OF TRUTH for every word on the site.
 * Edit values here and they flow through the whole page. Do not hard-code copy
 * inside components.
 */

export type AgentDot = "accent" | string;

export interface FloatingAgent {
  name: string;
  dot: AgentDot;
  rotate: number;
}

export interface Stat {
  value: string;
  label: string;
  color: string;
}

export interface ProjectCard {
  title: string;
  text: string;
  stack: string;
  gradient: string;
  href?: string;
  live?: string;
}

export interface ExperienceItem {
  role: string;
  org: string;
  when: string;
  where?: string;
  text: string;
  stack: string;
}

export interface SkillGroup {
  group: string;
  tone: "violet" | "orange" | "blue" | "green";
  items: string[];
  extra?: { group: string; items: string[] };
}

export const profile = {
  name: "Venugopal V",
  location: "Madurai, Tamil Nadu, India",
  email: "Venu25122005@gmail.com",
  linkedin: "https://linkedin.com/in/venugopal-v",
  github: "https://github.com/venu2512",
  status: "Open to AI / ML opportunities · Class of 2027",
  headline: "AI engineer building agents that do real work.",
  intro:
    "I design multi-agent systems, LLM applications and full-stack products. Most recently I shipped five enterprise agents for the AISA AI Workforce Platform.",
  floatingAgents: [
    { name: "Contract Analyst", dot: "accent", rotate: -5 },
    { name: "Procurement Officer", dot: "#5B3DF0", rotate: 4 },
    { name: "Payroll Agent", dot: "#1F9D55", rotate: 3 },
    { name: "QA Coordinator", dot: "#0B7BD6", rotate: -4 },
  ] satisfies FloatingAgent[],
  stats: [
    {
      value: "5",
      label: "enterprise AI agents built at KreupAI",
      color: "accent",
    },
    {
      value: "8",
      label: "specialised agents in my campus operating system",
      color: "#5B3DF0",
    },
    {
      value: "3",
      label: "internships across AI, ML and data science",
      color: "#0B7BD6",
    },
    {
      value: "2027",
      label: "B.Tech in AI and Data Science",
      color: "#1F7A45",
    },
  ] satisfies Stat[],
  featuredProject: {
    eyebrow: "FINAL-YEAR PROJECT",
    title: "AI College Multiagent System",
    text: "An autonomous multi-agent university operating system. Eight specialised AI agents handle academic and administrative workflows end to end.",
    stack: [
      "LangGraph",
      "FastAPI",
      "PostgreSQL + pgvector",
      "RAG",
      "XGBoost",
      "React",
      "Docker",
    ],
    cta: { label: "View on GitHub", href: "https://github.com/venu2512" },
  },
  projects: [
    {
      title: "AISA AI Workforce Platform",
      text: "Five enterprise agents: Contract Analyst, Executive Assistant, Procurement Officer, QA Coordinator and Payroll Agent, built during my KreupAI internship.",
      stack: "Python · Kafka · React · REST APIs",
      gradient: "linear-gradient(135deg,#FFD6BE,#F4C6F5)",
    },
    {
      title: "Legal AI Chatbot",
      text: "A low-resource, domain-specific legal assistant. Gemma fine-tuned with QLoRA to answer legal queries.",
      stack: "Python · Ollama · QLoRA · Gemma",
      gradient: "linear-gradient(135deg,#C6D2FF,#BFEBD6)",
    },
    {
      title: "Cloud Nova",
      text: "A full-stack web application with REST APIs covering core business workflows, deployed through a production-style CI/CD pipeline.",
      stack: "MERN · Vercel · Render",
      gradient: "linear-gradient(135deg,#FFE9A8,#FFD6BE)",
    },
  ] satisfies ProjectCard[],
  experience: [
    {
      role: "AI/ML Engineer Intern",
      org: "KreupAI Technologies LLC",
      when: "May 2026 – Aug 2026",
      where: "Dubai, UAE (Remote)",
      text: "Built five enterprise AI agents for the AISA AI Workforce Platform, plus AI-powered modules and a multilingual AI Assistant for the Daftar Accounting platform.",
      stack:
        "Python · LLM prompt engineering · Multi-agent orchestration · Kafka · React · REST APIs",
    },
    {
      role: "Data Science Intern",
      org: "QuadEdutor Pvt. Ltd.",
      when: "Internship",
      text: "Cleaned real-world datasets, ran EDA and visualisations, and built ML models that turn data into actionable insight.",
      stack: "Python · Pandas · NumPy · Scikit-learn · Matplotlib · Seaborn",
    },
    {
      role: "AI & ML Intern",
      org: "Nitroware Technologies",
      when: "Internship",
      text: "Designed and tuned ML models for real-world applications, improving performance through iteration.",
      stack: "Python · Scikit-learn · TensorFlow · Pandas · NumPy",
    },
  ] satisfies ExperienceItem[],
  skills: [
    {
      group: "AI & Machine Learning",
      tone: "violet",
      items: [
        "Multi-Agent Systems",
        "LLM Fine-Tuning (QLoRA)",
        "Prompt Engineering",
        "TensorFlow",
        "Scikit-learn",
        "OpenCV",
        "Pandas",
        "NumPy",
      ],
    },
    {
      group: "Languages",
      tone: "orange",
      items: ["Python", "Java"],
      extra: { group: "Blockchain", items: ["Ethereum", "Smart Contracts"] },
    },
    {
      group: "Web & Databases",
      tone: "blue",
      items: ["HTML", "CSS", "MERN Stack", "MongoDB", "SQL"],
    },
    {
      group: "Data Visualisation",
      tone: "green",
      items: ["Power BI", "Matplotlib", "Seaborn", "Plotly"],
      extra: {
        group: "Tools",
        items: ["Git & GitHub", "Docker", "Streamlit", "VS Code"],
      },
    },
  ] satisfies SkillGroup[],
  about: {
    heading: "Agentic AI, built to solve real business problems.",
    text: "I am drawn to Agentic AI, Generative AI and Machine Learning, and to building scalable AI solutions that solve real-world business challenges. I am looking for a team building innovative AI products where I can keep growing.",
  },
  education: [
    {
      when: "2023 – 2027",
      what: "B.Tech, Artificial Intelligence and Data Science",
      where: "PPG Institute of Technology, Coimbatore",
    },
    {
      when: "2020 – 2023",
      what: "Higher Secondary Certificate",
      where: "MSR Matric Hr. Sec. School, Madurai",
    },
  ],
  languages: "Tamil (native) · English (professional) · Telugu (conversational)",
} as const;

/**
 * PLACEHOLDER - canonical URL.
 * Replace with the real production domain after the Vercel deploy. It is used
 * for the canonical tag, hreflang target, sitemap.xml and robots.txt.
 */
export const SITE_URL = "https://venugopal-v.vercel.app";

export const META_DESCRIPTION =
  "I design multi-agent systems, LLM applications and full-stack products. Most recently I shipped five enterprise agents for the AISA AI Workforce Platform.";
