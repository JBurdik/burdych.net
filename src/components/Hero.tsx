import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedText, GradientText } from "./ui/AnimatedText";
import { MagneticButton, MagneticOutlineButton } from "./ui/MagneticButton";
import { about } from "../data/portfolio";
import { ChevronDown, Download } from "lucide-react";

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

// Floating orbs background - optimized for mobile
function FloatingOrbs() {
  const isMobile = useIsMobile();

  // Simpler, less resource-intensive animations for mobile
  const mobileTransition = {
    duration: 30,
    repeat: Infinity,
    ease: "linear" as const,
  };

  const desktopTransition = {
    duration: 20,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large cyan orb - reduced blur on mobile */}
      <motion.div
        className={`absolute rounded-full bg-cyan-500/20 ${
          isMobile
            ? "w-[300px] h-[300px] blur-[60px]"
            : "w-[500px] h-[500px] blur-[100px]"
        }`}
        animate={
          isMobile
            ? { opacity: [0.5, 0.7, 0.5] }
            : { x: [0, 100, 0], y: [0, -50, 0] }
        }
        transition={isMobile ? mobileTransition : desktopTransition}
        style={{ top: "10%", left: "10%", willChange: "transform, opacity" }}
      />

      {/* Medium teal orb */}
      <motion.div
        className={`absolute rounded-full bg-teal-500/20 ${
          isMobile
            ? "w-[250px] h-[250px] blur-[50px]"
            : "w-[400px] h-[400px] blur-[80px]"
        }`}
        animate={
          isMobile
            ? { opacity: [0.4, 0.6, 0.4] }
            : { x: [0, -80, 0], y: [0, 80, 0] }
        }
        transition={
          isMobile
            ? { ...mobileTransition, delay: 2 }
            : { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ top: "30%", right: "15%", willChange: "transform, opacity" }}
      />

      {/* Small emerald orb */}
      <motion.div
        className={`absolute rounded-full bg-emerald-500/15 ${
          isMobile
            ? "w-[200px] h-[200px] blur-[40px]"
            : "w-[300px] h-[300px] blur-[60px]"
        }`}
        animate={
          isMobile
            ? { opacity: [0.3, 0.5, 0.3] }
            : { x: [0, 50, 0], y: [0, 100, 0] }
        }
        transition={
          isMobile
            ? { ...mobileTransition, delay: 4 }
            : { duration: 18, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ bottom: "20%", left: "30%", willChange: "transform, opacity" }}
      />
    </div>
  );
}

// Animated particles - reduced count for mobile performance
function Particles() {
  const isMobile = useIsMobile();

  const [particles] = useState(() =>
    Array.from({ length: isMobile ? 15 : 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    })),
  );

  // Skip particles on mobile for better performance
  if (isMobile) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Cursor glow effect - disabled on mobile/touch devices
function CursorGlow() {
  const isMobile = useIsMobile();
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Move useTransform hooks to top level - MUST be called unconditionally
  const glowX = useTransform(cursorXSpring, (x) => x - 200);
  const glowY = useTransform(cursorYSpring, (y) => y - 200);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY, isMobile]);

  // Skip cursor glow on mobile - no mouse cursor anyway
  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        x: glowX,
        y: glowY,
        willChange: "transform",
      }}
    />
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      <FloatingOrbs />
      <Particles />
      <CursorGlow />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-cyan-400 font-mono text-lg mb-6"
        >
          Ahoj, jmenuji se
        </motion.p>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4">
          <AnimatedText text={about.name} delay={0.3} />
        </h1>

        {/* Title with gradient */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8"
        >
          <GradientText>{about.title}</GradientText>
        </motion.h2>

        {/* Bio snippet */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Tvořím výjimečné digitální zážitky s čistým kódem a kreativními
          řešeními. Pojďme spolu vytvořit něco úžasného.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <MagneticButton href="#projects">Moje projekty</MagneticButton>
          <MagneticOutlineButton href={about.cvUrl || "/CV.pdf"}>
            <Download className="w-4 h-4 mr-2" />
            Stáhnout CV
          </MagneticOutlineButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </section>
  );
}
