export type Project = {
  category: string;
  title: string;
  anchor: string;
  year?: string;
  description: string;
  highlights: string[];
  tags: string[];
  variant: "rag" | "fullstack" | "quality" | "skin";
  status: string;
};

export const profile = {
  name: "Sushil Kumar Prajapati",
  eyebrow: "AI ENGINEERING · SOFTWARE · QUALITY SYSTEMS",
  headline: ["AI engineering", "meets software", "that works"],
  summary:
    "Verification and validation engineer with a full-stack foundation, building practical AI applications and agentic workflows. I pair hands-on software projects with a quality mindset: define expected behavior, test it, and improve what the evidence shows.",
  status: "V&V ENGINEER · BUILDING WITH AI",
  email: "sushillk20201@gmail.com",
  linkedin: "https://www.linkedin.com/in/sushil-kumar-prajapati-201810222/",
  github: "https://github.com/sushilk99",
  resume: "",
};

export const projects: Project[] = [
  {
    category: "AI APPLICATION · VOICE + TEXT",
    title: "AI Skin Specialist",
    anchor: "project-ai-skin-specialist",
    year: "2026",
    description:
      "Built a skincare assistant for text and voice conversations. It uses a locally hosted Ollama model, Hugging Face speech-to-text, and Kokoro text-to-speech to turn spoken questions into spoken responses.",
    highlights: [
      "Text and voice input",
      "Local model inference",
      "Speech-to-text and speech output",
    ],
    tags: [
      "Python",
      "Streamlit",
      "Ollama",
      "Hugging Face",
      "PyAudio",
      "Kokoro",
    ],
    variant: "skin",
    status: "PERSONAL PROJECT · LOCAL INFERENCE",
  },
  {
    category: "FULL-STACK APPLICATION",
    title: "E-commerce App",
    anchor: "project-e-commerce-app",
    year: "2024",
    description:
      "Built a MERN shopping experience with product listings and details, cart and checkout flows, card and cash payment options, and an admin panel for products and orders. Added sorting, filtering, and pagination for product discovery.",
    highlights: [
      "Customer shopping flow",
      "Product and order admin",
      "Sorting, filtering, and pagination",
    ],
    tags: ["MongoDB", "Express.js", "React", "Node.js", "Redux"],
    variant: "fullstack",
    status: "PERSONAL PROJECT · FULL-STACK",
  },
  {
    category: "LOCAL AI AGENT · RESUME / JOB MATCHING",
    title: "Resume Scorer",
    anchor: "project-resume-scorer",
    description:
      "Built a local web app that compares a PDF résumé with pasted job text or a job link. It returns a score out of 100, a skills, experience, keywords, and education breakdown, missing keywords, and specific improvement suggestions without recommending invented experience.",
    highlights: [
      "Clear recovery guidance for errors",
      "Stop control while scoring runs",
      "Fresh state for each new request",
    ],
    tags: [
      "Python 3.10+",
      "Streamlit",
      "LangGraph",
      "LangChain",
      "Ollama · Qwen3:4b",
      "PyMuPDF",
      "Pydantic",
      "Requests",
      "BeautifulSoup",
      "Playwright (optional)",
    ],
    variant: "quality",
    status: "PERSONAL PROJECT · RUNS LOCALLY · NO API KEY",
  },
  {
    category: "PLANNED PERSONAL PROJECT · GROUNDED CHAT",
    title: "RAG Knowledge Assistant",
    anchor: "project-rag-knowledge-assistant",
    description:
      "Built a retrieval-augmented chatbot that finds relevant information in a knowledge base before generating answers. Used LangChain and LangGraph to coordinate the retrieval and response workflow, with Hugging Face tools to evaluate answer quality and grounding..",
    highlights: [
      "Retrieves relevant context from source documents before answering.",
      "Orchestrates the retrieval and response flow with LangChain and LangGraph.",
      "Uses Hugging Face tools to evaluate answer relevance and grounding.",
    ],
    tags: [
      "PLANNED",
      "RAG",
      "LangChain",
      "LangGraph",
      "Hugging Face",
      "LLM evaluation",
      "Evals",
      "Guardrails",
    ],
    variant: "rag",
    status: "PERSONAL PROJECT · RUNS LOCALLY · NO API KEY",
  },
];

export const capabilities = [
  {
    number: "01",
    title: "Understand",
    detail: "Clarify the user, requirement, and success criteria.",
  },
  {
    number: "02",
    title: "Design",
    detail: "Map the system, data flow, and important failure paths.",
  },
  {
    number: "03",
    title: "Build",
    detail: "Connect usable interfaces, services, and AI components.",
  },
  {
    number: "04",
    title: "Verify",
    detail: "Check behavior, quality, and evidence before delivery.",
  },
];

export const experience = [
  {
    period: "MAY 2026 — PRESENT",
    role: "Verification & Validation Engineer",
    company: "Schneider Electric",
    description:
      "Develop Python automation scripts for repetitive validation work and execution workflows. Perform functional, regression, and integration testing, and analyze defects to support application quality and system reliability.",
    tags: [
      "Python automation",
      "Functional testing",
      "Regression",
      "Integration",
      "Defect analysis",
    ],
  },
  {
    period: "JAN 2025 — MAY 2026",
    role: "Graduate Engineer Trainee",
    company: "HCLTech",
    description:
      "Developed Node.js and Express backend modules and REST APIs, connected MongoDB through Mongoose, and implemented JWT authentication, middleware, input validation, and error handling.",
    tags: ["Node.js", "Express.js", "REST APIs", "MongoDB", "Mongoose", "JWT"],
  },
];

export const skillGroups = [
  {
    title: "AI APPLICATIONS",
    skills: [
      "Local LLMs",
      "Ollama",
      "Prompt engineering",
      "LangGraph",
      "LangChain",
      "Hugging Face",
      "RAG",
    ],
  },
  {
    title: "SOFTWARE DEVELOPMENT",
    skills: [
      "Python",
      "JavaScript",
      "C++",
      "React",
      "Redux",
      "Node.js",
      "Express.js",
      "REST APIs",
    ],
  },
  {
    title: "QUALITY & V&V",
    skills: [
      "Python automation",
      "Functional testing",
      "Regression testing",
      "Integration testing",
      "API testing",
      "Postman",
      "Defect analysis",
    ],
  },
  {
    title: "DATA & AI TOOLING",
    skills: [
      "MongoDB",
      "Mongoose",
      "MySQL",
      "Streamlit",
      "PyMuPDF",
      "Pydantic",
      "BeautifulSoup",
      "Playwright",
    ],
  },
];

export const education = [
  {
    degree: "Bachelor of Engineering · Computer Science",
    institution: "Chandigarh University",
    result: "7.85 CGPA",
  },
  {
    degree: "Intermediate · CBSE",
    institution: "Army Public School No. 1, Roorkee",
    result: "92%",
  },
  {
    degree: "Matriculation · CBSE",
    institution: "Army Public School No. 1, Roorkee",
    result: "88%",
  },
];

export const certification = "NPTEL · Software Testing";

export const learningTopics = [
  "Hugging Face evaluation",
  "RAG",
  "LangChain",
  "LangGraph",
  "AutoGen",
  "MCP",
  "Multi-agent systems",
];

export const assistantSuggestions = [
  "What does the Resume Scorer do?",
  "Which projects use local AI models?",
  "What is Sushil's verification and validation experience?",
];
