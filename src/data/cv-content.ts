import portfolioProjects from "../../data/portfolio-projects.json";

export type CvExperience = {
  title: string;
  company: string;
  workSetup?: string;
  dates: string;
  bullets: string[];
};

export type CvSkillGroup = {
  label: string;
  items: string;
};

export type CvProject = {
  title: string;
  category: string;
  description: string;
  liveUrl: string;
};

export const cvProfile = {
  name: "Marc Gregory B. Turno",
  title: "Junior Developer | Computer Engineer",
  location: "Cagayan de Oro City, Misamis Oriental, Philippines",
  phone: "09924133206",
  email: "markyturns@gmail.com",
  githubUrl: "https://github.com/marcgregory",
  updated: "June 2, 2026",
};

export const cvObjective =
  "Highly motivated professional seeking a position to utilize and advance technical expertise in software development and hardware systems, contributing to organizational growth while maximizing career potential.";

export const cvSkillGroups: CvSkillGroup[] = [
  {
    label: "Frontend",
    items:
      "HTML, CSS, JavaScript, React JS, Next.js, TypeScript, Tailwind CSS, Shadcn UI, React Query, Redux, and testing libraries.",
  },
  {
    label: "Backend",
    items:
      "Node Express, PHP WordPress theme development, ACF, custom queries, WP REST API, Prisma, Firebase Auth, Firebase Storage, Firestore, and FastAPI.",
  },
  {
    label: "Cloud, infrastructure, and tools",
    items:
      "AWS Services including Cognito, VPC, EC2, RDS, and Amplify; API integrations including Bux and Movider; Render, Railway, Vercel, Modal, Docker, Redis, Celery, Cloudinary, Google services including Drive, Maps, Docs, and Auth; and Git.",
  },
  {
    label: "IT and hardware",
    items:
      "Computer networking, POS systems, CCTV with EagleEye, data recovery, OS installation, UPS maintenance, and printer maintenance.",
  },
  {
    label: "LLM and automation",
    items:
      "Demucs, faster-whisper, Basic Pitch, Sonnet, Composer, Qwen, GPT LLMs, Python, web scraping with Playwright, and Beautiful Soup.",
  },
  {
    label: "Coding with AI",
    items:
      "Cursor, Claude Code, Antigravity, Lovable, Codex, and GitHub Copilot.",
  },
];

export const cvExperience: CvExperience[] = [
  {
    title: "AHAmatic Junior Engineer / Developer",
    company: "Volenday Philippines Incorporated",
    workSetup: "Hybrid",
    dates: "February 2023 to May 2025",
    bullets: [
      "Developed features in an Agile Scrum environment and managed code with Git.",
      "Built and debugged React and Next.js applications using modern browser developer tools.",
      "Collaborated with design teams to implement high-fidelity UIs using Material UI, Shadcn UI, and Antd.",
      "Produced clean, efficient, and well-documented code adhering to industry standards.",
      "Participated in daily stand-ups and feature estimation meetings to help ensure project timelines were met.",
    ],
  },
  {
    title: "IT Staff",
    company: "Regent Foods Corporation",
    dates: "February 2020 to January 2021",
    bullets: [
      "Provided comprehensive technical support for hardware, software, and network issues.",
      "Installed and maintained computer systems and secured company data through network security measures.",
      "Managed IT procurement and deployment of equipment and software.",
    ],
  },
  {
    title: "IT Staff",
    company: "Ron's Chicken Corporation",
    dates: "January 2019 to September 2019",
    bullets: [
      "Configured and maintained computer networks to ensure consistent operational connectivity.",
      "Troubleshot and resolved technical issues related to peripherals and core systems.",
    ],
  },
];

export const cvEducation = [
  "BS in Computer Engineering, Cagayan de Oro College - PHINMA, 2015.",
  "Certified Safety Officer 2, Basic Occupational Safety and Health, 2018.",
  "IT Internship, Northern Mindanao Medical Center, 2015.",
];

export const cvQualities = [
  "Hardworking and trustworthy.",
  "Strong team collaborator with a growth mindset.",
];

export const cvProjects: CvProject[] = portfolioProjects.map((project) => ({
  title: project.title,
  category: project.category,
  description: project.description,
  liveUrl: project.liveUrl,
}));

export const biosLoadingResources = [
  "keyboardKeydown2",
  "mouseDown",
  "mouseUp",
  "keyboardKeydown1",
  "keyboardKeydown6",
  "ccType",
  "startup",
  "office",
  "portfolio",
  "projects",
  "experience",
  "skills",
  "contact",
  "terminal",
  "cvData",
  "windowManager",
  "taskbar",
  "desktop",
  "complete",
];
