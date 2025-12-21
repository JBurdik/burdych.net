import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { experiences } from "../data/portfolio";
import { GlowCard } from "./ui/GlowCard";
import { FadeUp, GradientText } from "./ui/AnimatedText";
import { Briefcase } from "lucide-react";

function TimelineCard({
  experience,
  index,
}: {
  experience: (typeof experiences)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`flex items-center gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Card */}
      <div className="flex-1">
        <GlowCard className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20">
              <Briefcase className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                {experience.role}
              </h3>
              <p className="text-cyan-400 font-medium">{experience.company}</p>
            </div>
          </div>

          <p className="text-gray-400 leading-relaxed mb-4">
            {experience.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-3 py-1 text-sm rounded-full bg-white/5 text-gray-300 border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Timeline dot - hidden on mobile */}
      <div className="hidden md:flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className="relative"
        >
          {/* Pulse effect */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-cyan-500"
          />
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 relative z-10" />
        </motion.div>
      </div>

      {/* Date badge */}
      <div className="flex-1 hidden md:flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="px-4 py-2 rounded-full bg-[#12121a] border border-white/10 text-gray-400 font-mono text-sm"
        >
          {experience.period}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#0a0a0f]"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <FadeUp className="text-center mb-16">
          <p className="text-cyan-400 font-mono text-sm mb-4">
            My Professional Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Work <GradientText>Experience</GradientText>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A timeline of my career highlights and the impact I've made at each
            organization.
          </p>
        </FadeUp>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Cards */}
          <div className="space-y-12 md:space-y-16">
            {experiences.map((experience, index) => (
              <TimelineCard
                key={experience.id}
                experience={experience}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
