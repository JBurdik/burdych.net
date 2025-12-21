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
  socials: Social[];
}

// Dummy Data - Replace with DB fetches later

export const experiences: Experience[] = [
  {
    id: "1",
    company: "TechCorp Innovation",
    role: "Senior Full-Stack Developer",
    period: "2022 - Present",
    description:
      "Leading development of cloud-native applications, architecting microservices, and mentoring junior developers. Reduced deployment time by 60% through CI/CD pipeline optimization.",
    technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "Full-Stack Developer",
    period: "2020 - 2022",
    description:
      "Built and scaled a real-time collaboration platform from 0 to 50K users. Implemented WebSocket architecture and optimized database queries for 10x performance improvement.",
    technologies: ["Vue.js", "Python", "Django", "Redis", "Docker"],
  },
  {
    id: "3",
    company: "Digital Agency Pro",
    role: "Frontend Developer",
    period: "2018 - 2020",
    description:
      "Developed responsive web applications for Fortune 500 clients. Created reusable component libraries that reduced development time by 40%.",
    technologies: ["React", "SCSS", "JavaScript", "Webpack", "Figma"],
  },
  {
    id: "4",
    company: "Freelance",
    role: "Web Developer",
    period: "2016 - 2018",
    description:
      "Delivered 30+ projects for clients worldwide. Specialized in e-commerce solutions and custom WordPress themes.",
    technologies: ["PHP", "WordPress", "MySQL", "jQuery", "Bootstrap"],
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "CloudSync Pro",
    description:
      "Real-time file synchronization platform with end-to-end encryption. Handles millions of files with sub-second sync times.",
    image: "/projects/cloudsync.jpg",
    technologies: ["React", "Node.js", "WebSocket", "AWS S3", "PostgreSQL"],
    liveUrl: "https://cloudsync.example.com",
    githubUrl: "https://github.com/example/cloudsync",
    featured: true,
  },
  {
    id: "2",
    title: "AI Task Manager",
    description:
      "Smart task management app with AI-powered prioritization and natural language processing for task creation.",
    image: "/projects/taskmanager.jpg",
    technologies: ["Next.js", "OpenAI", "Prisma", "Tailwind", "Vercel"],
    liveUrl: "https://aitasks.example.com",
    githubUrl: "https://github.com/example/aitasks",
    featured: true,
  },
  {
    id: "3",
    title: "CryptoTracker",
    description:
      "Real-time cryptocurrency portfolio tracker with price alerts, historical charts, and portfolio analytics.",
    image: "/projects/crypto.jpg",
    technologies: ["React", "D3.js", "WebSocket", "CoinGecko API"],
    liveUrl: "https://crypto.example.com",
    featured: true,
  },
  {
    id: "4",
    title: "DevBlog Platform",
    description:
      "Modern blogging platform for developers with MDX support, syntax highlighting, and SEO optimization.",
    image: "/projects/devblog.jpg",
    technologies: ["Astro", "MDX", "Tailwind", "Cloudflare"],
    githubUrl: "https://github.com/example/devblog",
    featured: false,
  },
  {
    id: "5",
    title: "E-Commerce Dashboard",
    description:
      "Analytics dashboard for e-commerce businesses with real-time sales tracking and inventory management.",
    image: "/projects/ecommerce.jpg",
    technologies: ["Vue.js", "Chart.js", "Express", "MongoDB"],
    featured: false,
  },
  {
    id: "6",
    title: "Weather Forecast App",
    description:
      "Beautiful weather app with 7-day forecasts, interactive maps, and severe weather alerts.",
    image: "/projects/weather.jpg",
    technologies: ["React Native", "OpenWeather API", "Mapbox"],
    liveUrl: "https://weather.example.com",
    featured: false,
  },
];

export const technologies: Technology[] = [
  // Frontend
  { name: "React", icon: "react", category: "frontend", proficiency: 95 },
  {
    name: "TypeScript",
    icon: "typescript",
    category: "frontend",
    proficiency: 90,
  },
  { name: "Next.js", icon: "nextjs", category: "frontend", proficiency: 88 },
  {
    name: "Tailwind CSS",
    icon: "tailwind",
    category: "frontend",
    proficiency: 92,
  },
  { name: "Vue.js", icon: "vue", category: "frontend", proficiency: 75 },

  // Backend
  { name: "Node.js", icon: "nodejs", category: "backend", proficiency: 88 },
  { name: "Python", icon: "python", category: "backend", proficiency: 80 },
  {
    name: "PostgreSQL",
    icon: "postgresql",
    category: "backend",
    proficiency: 85,
  },
  { name: "GraphQL", icon: "graphql", category: "backend", proficiency: 78 },
  { name: "Redis", icon: "redis", category: "backend", proficiency: 72 },

  // Tools
  { name: "Git", icon: "git", category: "tools", proficiency: 92 },
  { name: "Docker", icon: "docker", category: "tools", proficiency: 85 },
  { name: "AWS", icon: "aws", category: "tools", proficiency: 80 },
  { name: "Figma", icon: "figma", category: "tools", proficiency: 75 },
  { name: "Linux", icon: "linux", category: "tools", proficiency: 82 },
];

export const about: About = {
  name: "Jirka Burdych",
  title: "Full-Stack Developer & UI/UX Enthusiast",
  bio: `I'm a passionate developer with 8+ years of experience building web applications that make a difference. I love turning complex problems into simple, beautiful solutions.

When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge through blog posts and tech talks.

I believe in writing clean, maintainable code and creating user experiences that delight. Let's build something amazing together!`,
  avatar: "/avatar.jpg",
  location: "Czech Republic",
  email: "hello@burdych.net",
  socials: [
    { name: "GitHub", url: "https://github.com/jirkab", icon: "github" },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/jirkab",
      icon: "linkedin",
    },
    { name: "Twitter", url: "https://twitter.com/jirkab", icon: "twitter" },
    { name: "Email", url: "mailto:hello@burdych.net", icon: "mail" },
  ],
};
