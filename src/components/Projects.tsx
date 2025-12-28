import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, type MouseEvent } from "react";
import type { Project } from "../db/schema";
import {
  FadeUp,
  GradientText,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedText";
import {
  ExternalLink,
  Github,
  Folder,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";

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

// Project Detail Modal
function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = project.images && project.images.length > 0;
  const hasMultipleImages = hasImages && project.images!.length > 1;

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasMultipleImages) {
        setCurrentImageIndex((prev) =>
          prev === 0 ? project.images!.length - 1 : prev - 1,
        );
      } else if (e.key === "ArrowRight" && hasMultipleImages) {
        setCurrentImageIndex((prev) =>
          prev === project.images!.length - 1 ? 0 : prev + 1,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasMultipleImages, project.images, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === project.images!.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.images!.length - 1 : prev - 1,
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#12121a] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image carousel */}
            <div className="relative aspect-video bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10">
              {hasImages ? (
                <>
                  <img
                    src={project.images![currentImageIndex]}
                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain bg-[#0a0a0f]"
                  />

                  {/* Navigation arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all hover:scale-110"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white transition-all hover:scale-110"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image counter & dots */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-black/60 text-sm text-white/80">
                        {currentImageIndex + 1} / {project.images!.length}
                      </span>
                      <div className="flex gap-2">
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
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-8 rounded-2xl bg-[#0a0a0f]/50">
                    <Folder className="w-16 h-16 text-cyan-400/50" />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Featured badge */}
              {project.featured && (
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30 mb-4">
                  Hlavní projekt
                </span>
              )}

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {project.title}
              </h2>

              <p className="text-gray-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(project.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm rounded-lg bg-white/5 text-gray-300 font-mono border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Živá ukázka
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectCard({
  project,
  onOpenModal,
}: {
  project: Project;
  onOpenModal: () => void;
}) {
  // All hooks must be at the top, before any conditional logic
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create transforms for 3D effect - always create hooks
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  // Check if project has images (after all hooks)
  const hasImages = project.images && project.images.length > 0;
  const hasMultipleImages = hasImages && project.images!.length > 1;

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

  const nextImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === project.images!.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? project.images!.length - 1 : prev - 1,
      );
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full cursor-pointer"
      style={
        isMobile
          ? undefined
          : {
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }
      }
      onClick={onOpenModal}
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

              {/* Navigation arrows - show on hover */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:text-white transition-all z-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:text-white transition-all z-10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Image navigation dots */}
              {hasMultipleImages && (
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent pointer-events-none" />
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

          {/* Expand indicator on hover */}
          <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Maximize2 className="w-4 h-4" />
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

          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(project.technologies || []).slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400 font-mono"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 3 && (
              <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-500 font-mono">
                +{(project.technologies || []).length - 3}
              </span>
            )}
          </div>

          {/* Quick links - always visible at bottom */}
          <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Github className="w-3 h-3" />
                Kód
              </a>
            )}
            <span className="ml-auto text-xs text-gray-500 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" />
              Detail
            </span>
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
              <ProjectCard
                project={project}
                onOpenModal={() => setSelectedProject(project)}
              />
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
                  <ProjectCard
                    project={project}
                    onOpenModal={() => setSelectedProject(project)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}
      </div>

      {/* Project detail modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
