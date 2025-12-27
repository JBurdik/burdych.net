import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect, type MouseEvent } from "react";
import type { Project } from "../db/schema";
import {
  FadeUp,
  GradientText,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedText";
import { ExternalLink, Github, Folder } from "lucide-react";

// Detect mobile/touch devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0,
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ clientX, clientY }: MouseEvent) {
    if (isMobile || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  // Featured projects get larger grid area
  const gridClass = project.featured
    ? index === 0
      ? "md:col-span-2 md:row-span-2"
      : "md:col-span-2"
    : "";

  // Check if project has images
  const hasImages = project.images && project.images.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative ${gridClass}`}
      style={
        isMobile
          ? undefined
          : {
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }
      }
    >
      <motion.div
        className="relative h-full rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden"
        style={
          isMobile
            ? undefined
            : {
                rotateX: useMotionTemplate`${mouseY.get() * -10}deg`,
                rotateY: useMotionTemplate`${mouseX.get() * 10}deg`,
              }
        }
        whileHover={
          isMobile
            ? { scale: 1.02 }
            : {
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25)",
              }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Gradient glow on hover - skip on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(
                600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%,
                rgba(6, 182, 212, 0.1),
                transparent 40%
              )`,
            }}
          />
        )}

        {/* Project image area */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10 overflow-hidden">
          {/* Show actual images if available */}
          {hasImages ? (
            <>
              <img
                src={project.images![currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Image navigation dots */}
              {project.images!.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {project.images!.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "bg-cyan-400 w-4"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
            </>
          ) : (
            <>
              {/* Animated gradient overlay - simplified for mobile */}
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                />
              )}

              {/* Folder icon for projects without images */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={isMobile ? undefined : { scale: 1.1, rotate: 5 }}
                  className="p-6 rounded-2xl bg-[#0a0a0f]/50 backdrop-blur-sm"
                >
                  <Folder className="w-12 h-12 text-cyan-400" />
                </motion.div>
              </div>
            </>
          )}

          {/* Links overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-[#0a0a0f]/80 flex items-center justify-center gap-4"
          >
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white/10 hover:bg-cyan-500/20 transition-colors"
              >
                <ExternalLink className="w-6 h-6 text-cyan-400" />
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white/10 hover:bg-emerald-500/20 transition-colors"
              >
                <Github className="w-6 h-6 text-emerald-400" />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Featured badge */}
          {project.featured && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30 mb-3"
            >
              Hlavní
            </motion.span>
          )}

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400 font-mono"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 4 && (
              <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-500 font-mono">
                +{(project.technologies || []).length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Shimmer effect on hover - skip on mobile for performance */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 md:py-32 bg-[#0a0a0f]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <FadeUp className="text-center mb-16">
          <p className="text-cyan-400 font-mono text-sm mb-4">
            Co jsem vytvořil
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Vybrané <GradientText>projekty</GradientText>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Výběr projektů, které ukazují mé dovednosti ve tvorbě škálovatelných
            a uživatelsky přívětivých aplikací.
          </p>
        </FadeUp>

        {/* Bento grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredProjects.map((project, index) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <>
            <FadeUp className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white">Další projekty</h3>
            </FadeUp>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <StaggerItem key={project.id}>
                  <ProjectCard
                    project={project}
                    index={index + featuredProjects.length}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}
      </div>
    </section>
  );
}
