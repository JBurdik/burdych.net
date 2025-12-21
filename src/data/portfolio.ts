// Portfolio Data Types and Dummy Data
// Ready for DB integration - replace dummy data with API calls

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  logo?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Technology {
  name: string;
  icon: string;
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number; // 1-100
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface About {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  cvUrl: string;
  socials: Social[];
}

// Real Data from CV

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Freelance (OSVČ)",
    role: "Frontend Developer",
    period: "2023 - současnost",
    description:
      "Vývoj moderních webových aplikací včetně ERP systémů, e-shopů a portfoliových webů pro modelingové agentury. Práce s nejnovějšími technologiemi a dodávání kvalitních řešení pro klienty.",
    technologies: ["React", "Next.js", "Vue.js", "Nuxt.js", "TypeScript"],
  },
  {
    id: "2",
    company: "Bludička, Litomyšl",
    role: "Kuchař",
    period: "2020 - 2023",
    description:
      "Práce kuchaře při současném rozvíjení programátorských dovedností. Tato zkušenost mě naučila preciznosti, time managementu a schopnosti pracovat pod tlakem.",
    technologies: [],
  },
  {
    id: "3",
    company: "Pivovar Kujebák, Vysoké Mýto",
    role: "Kuchař",
    period: "2019 - 2020",
    description:
      "Získání kulinářských zkušeností v místní pivovarské restauraci, kombinace kreativity s technickým provedením v rychlém prostředí.",
    technologies: [],
  },
  {
    id: "4",
    company: "Bonte Class, Pardubice",
    role: "Kuchař",
    period: "2017 - 2019",
    description:
      "Začátek profesionální kulinářské kariéry při současném učení se webovému vývoji.",
    technologies: [],
  },
  {
    id: "5",
    company: "PHP Brigáda",
    role: "PHP Developer",
    period: "2014 - 2017",
    description:
      "První programátorské zkušenosti s tvorbou mikro e-shopů a dashboardů pro agenturu zastupující YouTubery. Naučil jsem se základy PHP a správu databází.",
    technologies: ["PHP", "Nette", "MySQL"],
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "ERP Systém",
    description:
      "Vlastní systém pro plánování podnikových zdrojů postavený na moderních webových technologiích pro správu firmy a optimalizaci workflow.",
    image: "/projects/erp.jpg",
    technologies: ["Vue.js", "Nuxt.js", "TypeScript", "TailwindCSS"],
    featured: true,
  },
  {
    id: "2",
    title: "E-shop Platforma",
    description:
      "Plně vybavený online obchod se správou produktů, funkcí košíku a integrací plateb.",
    image: "/projects/eshop.jpg",
    technologies: ["React", "Next.js", "Zustand", "TailwindCSS"],
    featured: true,
  },
  {
    id: "3",
    title: "Portfolio pro Modelky",
    description:
      "Portfoliová webová platforma pro modelingové agentury s fotogaleriemi, rezervačním systémem a profily talentů.",
    image: "/projects/portfolio.jpg",
    technologies: ["React", "Next.js", "GraphQL", "Shadcn UI"],
    featured: true,
  },
  {
    id: "4",
    title: "Osobní Portfolio",
    description:
      "Tento web! Postavený na TanStack Start, Framer Motion a TailwindCSS s plynulými animacemi a moderním designem.",
    image: "/projects/personal.jpg",
    technologies: ["React", "TanStack Start", "Framer Motion", "TailwindCSS"],
    githubUrl: "https://github.com/jirkab/burdych.net",
    featured: false,
  },
];

export const technologies: Technology[] = [
  // Frontend - Main skills
  {
    name: "JavaScript",
    icon: "javascript",
    category: "frontend",
    proficiency: 95,
  },
  {
    name: "TypeScript",
    icon: "typescript",
    category: "frontend",
    proficiency: 90,
  },
  { name: "React", icon: "react", category: "frontend", proficiency: 92 },
  { name: "Next.js", icon: "nextjs", category: "frontend", proficiency: 88 },
  { name: "Vue.js", icon: "vue", category: "frontend", proficiency: 85 },
  { name: "Nuxt.js", icon: "nuxt", category: "frontend", proficiency: 82 },

  // Styling
  {
    name: "Tailwind CSS",
    icon: "tailwind",
    category: "frontend",
    proficiency: 95,
  },
  { name: "SCSS/SASS", icon: "sass", category: "frontend", proficiency: 88 },
  { name: "HTML & CSS", icon: "html", category: "frontend", proficiency: 95 },

  // Mobile & Other
  {
    name: "React Native",
    icon: "react",
    category: "frontend",
    proficiency: 75,
  },
  { name: "Expo", icon: "expo", category: "frontend", proficiency: 72 },

  // Backend
  { name: "PHP", icon: "php", category: "backend", proficiency: 70 },
  { name: "GraphQL", icon: "graphql", category: "backend", proficiency: 75 },

  // State & Data
  { name: "Zustand", icon: "zustand", category: "tools", proficiency: 85 },
  {
    name: "TanStack Query",
    icon: "tanstack",
    category: "tools",
    proficiency: 88,
  },

  // Tools
  { name: "Git", icon: "git", category: "tools", proficiency: 90 },
  { name: "Figma", icon: "figma", category: "tools", proficiency: 75 },
];

export const about: About = {
  name: "Jiří Burdych",
  title: "Frontend Developer",
  bio: `Vyučený kuchař s vášní pro programování, který od střední školy rozvíjí své dovednosti v oblasti webového a mobilního vývoje. Začínal jsem s PHP a frameworkem Nette, kde jsem získal první pracovní zkušenosti jako programátor.

Postupně jsem se zaměřil na moderní JavaScriptové frameworky, zejména React, a v poslední době se věnuji multiplatformnímu vývoji nativních aplikací pomocí React Native a Expo. Kombinuji kreativitu a preciznost z kuchařského řemesla s technickou zdatností v programování.

Mimo práci se aktivně věnuji osobním projektům, abych si udržel přehled o nejnovějších trendech a rozšířil své dovednosti. Mám zkušenosti s React, Vue, Astro, Next.js, Nuxt.js, React Native a Expo. Pro stylování využívám Tailwind CSS, SCSS a standardní CSS. Pro správu stavů preferuji Zustand a pro data fetching TanStack Query / React Query. Rovněž se seznamuji s GraphQL a aktivně používám komponenty z Shadcn UI.

Ve volném čase se věnuji hraní stolního tenisu (ping pongu), což mi pomáhá udržovat se v kondici a zároveň si vyčistit hlavu. Rád sleduji a zkouším nejnovější technologie, frameworky, zajímá mě webový vývoj a AI. Volné chvíle pak nejraději trávím s rodinou.`,
  avatar: "/me.png",
  location: "Czech Republic",
  email: "jiri.burdych@icloud.com",
  phone: "+420 605 589 517",
  cvUrl: "/CV.pdf",
  socials: [
    { name: "GitHub", url: "https://github.com/JBurdik/", icon: "github" },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jiří-burdych-4649b2167/",
      icon: "linkedin",
    },
    { name: "Email", url: "mailto:jiri.burdych@icloud.com", icon: "mail" },
  ],
};
