import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  useEffect,
  useState,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  gradient?: string;
  suffix?: string;
}

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

// Animated counter hook
function useAnimatedCounter(value: number, duration: number = 1500) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const springCount = useSpring(count, { duration });

  useEffect(() => {
    springCount.set(value);
  }, [value, springCount]);

  return rounded;
}

export function StatCard({
  title,
  value,
  icon,
  gradient = "from-cyan-500 to-teal-500",
  suffix = "",
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const animatedValue = useAnimatedCounter(value);

  // Use useTransform to create reactive background position
  const glowX = useTransform(mouseX, (v) => `${v * 100}%`);
  const glowY = useTransform(mouseY, (v) => `${v * 100}%`);

  function handleMouseMove(e: MouseEvent) {
    if (isMobile || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm p-6 overflow-hidden"
    >
      {/* Glow effect following mouse - disabled on mobile */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(300px circle at ${x} ${y}, rgba(6, 182, 212, 0.15), transparent 50%)`,
            ),
          }}
        />
      )}

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 mb-4`}
          style={{
            background: `linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(20, 184, 166, 0.2))`,
          }}
        >
          <div className="text-cyan-400">{icon}</div>
        </motion.div>

        {/* Title */}
        <p className="text-gray-400 text-sm mb-2">{title}</p>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <motion.span className="text-3xl font-bold text-white">
            {animatedValue}
          </motion.span>
          {suffix && <span className="text-gray-400 text-lg">{suffix}</span>}
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`}
      />
    </motion.div>
  );
}
