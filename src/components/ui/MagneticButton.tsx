import { motion, useMotionValue, useSpring } from "framer-motion";
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

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  function handleMouseMove(e: MouseEvent) {
    if (isMobile || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Component = href ? motion.a : motion.button;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Component
        href={href}
        onClick={onClick}
        style={isMobile ? undefined : { x: xSpring, y: ySpring }}
        whileHover={isMobile ? undefined : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-all ${className}`}
      >
        {/* Gradient background */}
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500" />

        {/* Content */}
        <span className="relative z-10 px-8 py-3 text-white">{children}</span>
      </Component>
    </div>
  );
}

// Outline variant
export function MagneticOutlineButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  function handleMouseMove(e: MouseEvent) {
    if (isMobile || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Component = href ? motion.a : motion.button;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Component
        href={href}
        onClick={onClick}
        style={isMobile ? undefined : { x: xSpring, y: ySpring }}
        whileHover={isMobile ? undefined : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium ${className}`}
      >
        {/* Border gradient */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 p-[2px]">
          <span className="absolute inset-[2px] rounded-full bg-[#0a0a0f]" />
        </span>

        {/* Content */}
        <span className="relative z-10 px-8 py-3 flex items-center bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent [&>svg]:text-cyan-400">
          {children}
        </span>
      </Component>
    </div>
  );
}
