import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { about } from "../data/portfolio";
import { FadeUp, GradientText } from "./ui/AnimatedText";
import { MagneticButton } from "./ui/MagneticButton";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Download,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

function SocialLink({
  social,
  index,
}: {
  social: (typeof about.socials)[0];
  index: number;
}) {
  const Icon = iconMap[social.icon];
  const ref = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  function handleMouseMove(e: MouseEvent) {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
      style={{ x: xSpring, y: ySpring }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group relative p-4 rounded-2xl border border-white/10 bg-[#12121a]/80 backdrop-blur-sm hover:border-cyan-500/50 transition-colors"
    >
      {/* Glow effect */}
      <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />

      {Icon && (
        <Icon className="relative z-10 w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
      )}

      {/* Tooltip */}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {social.name}
      </span>
    </motion.a>
  );
}

function AnimatedAvatar() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    springConfig,
  );

  function handleMouseMove(e: MouseEvent) {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Gradient border */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 opacity-75 blur-sm" />

        {/* Avatar container */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-teal-500/20 to-emerald-500/20 border border-white/10 overflow-hidden">
          {/* Placeholder gradient - replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#12121a] to-[#1e1e2e]" />

          {/* Initials as placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              {about.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>

          {/* Animated overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-teal-500/10"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
        >
          <span className="text-xl">💻</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <span className="text-xl">🚀</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const bioLines = about.bio.split("\n\n");

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/5 to-cyan-500/5" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <FadeUp className="text-center mb-16">
          <p className="text-cyan-400 font-mono text-sm mb-4">Get To Know Me</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <GradientText>Me</GradientText>
          </h2>
        </FadeUp>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Avatar */}
          <div className="flex justify-center">
            <AnimatedAvatar />
          </div>

          {/* Info */}
          <div>
            {/* Bio with line-by-line reveal */}
            <div className="space-y-4 mb-8">
              {bioLines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-gray-400 leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Location & Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300 text-sm">{about.location}</span>
              </div>
              <a
                href={`mailto:${about.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors"
              >
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300 text-sm">{about.email}</span>
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {about.socials.map((social, index) => (
                <SocialLink key={social.name} social={social} index={index} />
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              <MagneticButton href={`mailto:${about.email}`}>
                <span className="flex items-center gap-2">
                  Let's Talk
                  <Mail className="w-4 h-4" />
                </span>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
