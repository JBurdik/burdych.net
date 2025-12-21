import { motion } from "framer-motion";
import { technologies } from "../data/portfolio";
import {
  FadeUp,
  GradientText,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedText";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiVuedotjs,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiGraphql,
  SiRedis,
  SiGit,
  SiDocker,
  SiAmazonwebservices,
  SiFigma,
  SiLinux,
} from "react-icons/si";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  react: SiReact,
  typescript: SiTypescript,
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  vue: SiVuedotjs,
  nodejs: SiNodedotjs,
  python: SiPython,
  postgresql: SiPostgresql,
  graphql: SiGraphql,
  redis: SiRedis,
  git: SiGit,
  docker: SiDocker,
  aws: SiAmazonwebservices,
  figma: SiFigma,
  linux: SiLinux,
};

// Category colors
const categoryColors = {
  frontend: {
    bg: "from-cyan-500/20 to-cyan-500/5",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  backend: {
    bg: "from-teal-500/20 to-teal-500/5",
    text: "text-teal-400",
    border: "border-teal-500/30",
  },
  tools: {
    bg: "from-emerald-500/20 to-emerald-500/5",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  other: {
    bg: "from-gray-500/20 to-gray-500/5",
    text: "text-gray-400",
    border: "border-gray-500/30",
  },
};

function TechCard({
  tech,
  index,
}: {
  tech: (typeof technologies)[0];
  index: number;
}) {
  const Icon = iconMap[tech.icon];
  const colors = categoryColors[tech.category];

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div
        className={`relative p-6 rounded-2xl border ${colors.border} bg-[#12121a]/80 backdrop-blur-sm overflow-hidden cursor-pointer`}
        whileHover={{
          y: -8,
          scale: 1.02,
          boxShadow: "0 20px 40px -20px rgba(6, 182, 212, 0.3)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Floating animation */}
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          {/* Icon */}
          {Icon && (
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`mb-4 ${colors.text}`}
            >
              <Icon className="w-10 h-10 md:w-12 md:h-12" />
            </motion.div>
          )}

          {/* Name */}
          <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
            {tech.name}
          </h3>

          {/* Proficiency bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500`}
              initial={{ width: 0 }}
              whileInView={{ width: `${tech.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.05 + 0.5 }}
            />
          </div>
          <span className="text-xs text-gray-500 mt-1">
            {tech.proficiency}%
          </span>
        </motion.div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          whileHover={{ x: "100%", opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {tech.category.charAt(0).toUpperCase() + tech.category.slice(1)}
      </motion.div>
    </motion.div>
  );
}

export function Technologies() {
  const frontend = technologies.filter((t) => t.category === "frontend");
  const backend = technologies.filter((t) => t.category === "backend");
  const tools = technologies.filter((t) => t.category === "tools");

  return (
    <section id="technologies" className="relative py-24 md:py-32 bg-[#0a0a0f]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px]"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ top: "20%", left: "10%" }}
      />
      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px]"
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        style={{ bottom: "20%", right: "15%" }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <FadeUp className="text-center mb-16">
          <p className="text-cyan-400 font-mono text-sm mb-4">My Tech Stack</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Technologies & <GradientText>Skills</GradientText>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The tools and technologies I use to bring ideas to life.
          </p>
        </FadeUp>

        {/* Category: Frontend */}
        <div className="mb-12">
          <FadeUp>
            <h3 className="text-xl font-semibold text-cyan-400 mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-cyan-500 to-transparent" />
              Frontend
            </h3>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {frontend.map((tech, index) => (
              <TechCard key={tech.name} tech={tech} index={index} />
            ))}
          </div>
        </div>

        {/* Category: Backend */}
        <div className="mb-12">
          <FadeUp>
            <h3 className="text-xl font-semibold text-teal-400 mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-teal-500 to-transparent" />
              Backend
            </h3>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {backend.map((tech, index) => (
              <TechCard
                key={tech.name}
                tech={tech}
                index={index + frontend.length}
              />
            ))}
          </div>
        </div>

        {/* Category: Tools */}
        <div>
          <FadeUp>
            <h3 className="text-xl font-semibold text-emerald-400 mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-emerald-500 to-transparent" />
              Tools & Platforms
            </h3>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {tools.map((tech, index) => (
              <TechCard
                key={tech.name}
                tech={tech}
                index={index + frontend.length + backend.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
