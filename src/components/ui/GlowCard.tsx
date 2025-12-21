import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(6, 182, 212, 0.15)",
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ clientX, clientY }: MouseEvent) {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm overflow-hidden ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glow effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />

      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.4),
              transparent 80%
            )
          `,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 bg-[#12121a]/90 m-[1px] rounded-2xl">
        {children}
      </div>
    </motion.div>
  );
}
