import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  type MouseEvent,
  type ReactNode,
} from "react";

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

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create background position transforms
  const backgroundX = useTransform(mouseX, (x) => `${x}px`);
  const backgroundY = useTransform(mouseY, (y) => `${y}px`);

  function handleMouseMove({ clientX, clientY }: MouseEvent) {
    if (isMobile || !ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Skip glow effect on mobile
  if (isMobile) {
    return (
      <motion.div
        className={`group relative rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden ${className}`}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glow effect - using CSS custom properties for position */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.15), transparent 80%)`,
            // @ts-ignore - CSS custom properties
            "--mouse-x": backgroundX,
            "--mouse-y": backgroundY,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Simpler glow card without mouse tracking
export function SimpleGlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`group relative rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden ${className}`}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px -20px rgba(6, 182, 212, 0.3)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 bg-[#12121a]/90 m-[1px] rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
}
