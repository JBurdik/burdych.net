import { motion, useMotionValue, useTransform } from "framer-motion";
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

function ProjectCard({ project }: { project: Project }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create transforms for 3D effect - always create hooks, use conditionally
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

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

  // Check if project has images
  const hasImages = project.images && project.images.length > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full"
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
        className="relative h-full rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden flex flex-col"
        style={isMobile ? undefined : { rotateX, rotateY }}
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
        {/* Project image area */}
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10 overflow-hidden flex-shrink-0">
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
              {/* Static gradient for mobile, animated for desktop */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20" />

              {/* Folder icon for projects without images */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 rounded-2xl bg-[#0a0a0f]/50 backdrop-blur-sm">
                  <Folder className="w-12 h-12 text-cyan-400" />
                </div>
              </div>
            </>
          )}

          {/* Links overlay */}
          <div className="absolute inset-0 bg-[#0a0a0f]/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-cyan-500/20 transition-colors hover:scale-110 active:scale-95"
              >
                <ExternalLink className="w-6 h-6 text-cyan-400" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-emerald-500/20 transition-colors hover:scale-110 active:scale-95"
              >
                <Github className="w-6 h-6 text-emerald-400" />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Featured badge */}
          {project.featured && (
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30 mb-3 w-fit">
              Hlavní
            </span>
          )}

          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
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

        {/* Featured projects grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 auto-rows-fr">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <>
            <FadeUp className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white">Další projekty</h3>
            </FadeUp>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
              {otherProjects.map((project) => (
                <StaggerItem key={project.id} className="h-full">
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}
      </div>
    </section>
  );
}
