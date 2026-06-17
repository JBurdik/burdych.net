import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  About,
  Experience,
  Project,
  Social,
  Technology,
} from "../../db/schema";
import { getMiniAppHtml } from "../../server/mini-apps";
import {
  Briefcase,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiTailwindcss,
  SiVuedotjs,
  SiNuxtdotjs,
  SiSass,
  SiHtml5,
  SiPhp,
  SiGraphql,
  SiGit,
  SiFigma,
  SiExpo,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

export type AboutWithSocials = About & { socials: Social[] };
export type ProjectWithImages = Project & { images: string[] };

const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  react: SiReact,
  typescript: SiTypescript,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  vue: SiVuedotjs,
  nuxt: SiNuxtdotjs,
  sass: SiSass,
  html: SiHtml5,
  php: SiPhp,
  graphql: SiGraphql,
  git: SiGit,
  figma: SiFigma,
  expo: SiExpo,
  "react-native": TbBrandReactNative,
};

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> =
  {
    github: Github,
    linkedin: Linkedin,
    mail: Mail,
  };

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[11px] text-cyan-300">
      {children}
    </span>
  );
}

/* ───────────────────────────── About ───────────────────────────── */

export function AboutApp({ about }: { about: AboutWithSocials }) {
  return (
    <div className="p-6 text-white/85">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <img
          src={about.avatar || "/me.png"}
          alt={about.name}
          className="h-28 w-28 shrink-0 rounded-2xl border border-white/15 object-cover shadow-lg"
        />
        <div>
          <h2 className="text-2xl font-bold text-white">{about.name}</h2>
          <p className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-lg font-semibold text-transparent">
            {about.title}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
            <MapPin className="h-3.5 w-3.5" /> {about.location}
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-3 whitespace-pre-line text-sm leading-relaxed text-white/70">
        {about.bio}
      </div>
    </div>
  );
}

/* ─────────────────────────── Experience ─────────────────────────── */

export function ExperienceApp({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <div className="p-6">
      <div className="relative ml-3 border-l border-white/10 pl-6">
        {experiences.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative mb-6 last:mb-0"
          >
            <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 ring-4 ring-[#0e0e16]">
              <Briefcase className="h-3 w-3 text-white" />
            </span>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-white">{e.role}</h3>
                <span className="text-xs text-white/40">{e.period}</span>
              </div>
              <p className="text-sm font-medium text-cyan-300">{e.company}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {e.description}
              </p>
              {e.technologies && e.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.technologies.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── Technologies ─────────────────────────── */

export function TechnologiesApp({
  technologies,
}: {
  technologies: Technology[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2">
      {technologies.map((t, i) => {
        const Icon = techIcons[t.icon] ?? SiReact;
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <Icon className="h-5 w-5 text-cyan-300" /> {t.name}
              </span>
              <span className="text-xs text-white/40">{t.proficiency}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${t.proficiency}%` }}
                transition={{ delay: 0.2 + i * 0.03, duration: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── Projects ───────────────────────────── */

export function ProjectsApp({
  projects,
}: {
  projects: ProjectWithImages[];
}) {
  const [active, setActive] = useState<ProjectWithImages | null>(null);
  const [idx, setIdx] = useState(0);

  const openProject = (p: ProjectWithImages) => {
    setActive(p);
    setIdx(0);
  };

  const gallery = active
    ? active.images && active.images.length
      ? active.images
      : [active.image]
    : [];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openProject(p)}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition hover:border-cyan-400/40"
          >
            <div className="aspect-video overflow-hidden bg-black/40">
              <img
                src={(p.images && p.images[0]) || p.image}
                alt={p.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/55">
                {p.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.technologies?.slice(0, 4).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e16]"
            >
              <div className="relative aspect-video bg-black">
                <img
                  src={gallery[idx]}
                  alt={active.title}
                  className="h-full w-full object-contain"
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setIdx((v) => (v - 1 + gallery.length) % gallery.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIdx((v) => (v + 1) % gallery.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {gallery.map((_, gi) => (
                        <span
                          key={gi}
                          className={`h-1.5 w-1.5 rounded-full ${
                            gi === idx ? "bg-cyan-400" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="overflow-auto p-5 os-scroll">
                <h3 className="text-lg font-bold text-white">{active.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {active.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.technologies?.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-3 py-1.5 text-sm font-medium text-black"
                    >
                      <ExternalLink className="h-4 w-4" /> Živá ukázka
                    </a>
                  )}
                  {active.githubUrl && (
                    <a
                      href={active.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white"
                    >
                      <Github className="h-4 w-4" /> Kód
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────────── Contact ───────────────────────────── */

export function ContactApp({ about }: { about: AboutWithSocials }) {
  return (
    <div className="p-6 text-white/85">
      <h2 className="text-xl font-bold text-white">Pojďme se spojit</h2>
      <p className="mt-1 text-sm text-white/55">
        Máte projekt nebo nápad? Napište mi.
      </p>

      <div className="mt-5 space-y-2.5">
        <a
          href={`mailto:${about.email}`}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300">
            <Mail className="h-4 w-4" />
          </span>
          <span className="text-sm">{about.email}</span>
        </a>
        {about.phone && (
          <a
            href={`tel:${about.phone}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-cyan-400/40"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300">
              <Phone className="h-4 w-4" />
            </span>
            <span className="text-sm">{about.phone}</span>
          </a>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {about.socials?.map((s) => {
          const Icon = socialIcons[s.icon] ?? ExternalLink;
          return (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-cyan-400/40"
            >
              <Icon className="h-4 w-4 text-cyan-300" /> {s.name}
            </a>
          );
        })}
      </div>

      {about.cvUrl && (
        <a
          href={about.cvUrl}
          download
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-black"
        >
          <Download className="h-4 w-4" /> Stáhnout CV
        </a>
      )}
    </div>
  );
}

/* ───────────────────────────── Terminal ───────────────────────────── */

export function TerminalApp({ about }: { about: AboutWithSocials }) {
  const lines = [
    { cmd: "whoami", out: about.name },
    { cmd: "cat role.txt", out: about.title },
    { cmd: "cat location.txt", out: about.location },
    { cmd: "cat contact.txt", out: about.email },
    {
      cmd: "echo $STACK",
      out: "React · TypeScript · Next.js · Vue · Nuxt · TailwindCSS · React Native",
    },
  ];
  return (
    <div className="h-full bg-[#06070b] p-4 font-mono text-[13px] leading-relaxed text-emerald-300">
      <p className="text-white/40">burdychOS terminal — zsh</p>
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.25 }}
          className="mt-2"
        >
          <p>
            <span className="text-cyan-400">jirka@burdych</span>
            <span className="text-white/40">:~$ </span>
            <span className="text-white">{l.cmd}</span>
          </p>
          <p className="text-emerald-300">{l.out}</p>
        </motion.div>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.9 }}
        className="mt-2 inline-block h-4 w-2 bg-emerald-300"
      />
    </div>
  );
}

/* ───────────────────────────── MiniApp (iframe) ─────────────────── */

export function MiniAppWindow({ s3Key }: { s3Key: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMiniAppHtml({ data: s3Key })
      .then((r) => setHtml(r.html))
      .catch(() => setError(true));
  }, [s3Key]);

  if (error)
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/40">
        Nepodařilo se načíst
      </div>
    );
  if (!html)
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/40">
        Načítám…
      </div>
    );

  return (
    <iframe
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      className="h-full w-full border-none bg-white"
      title="Mini app"
    />
  );
}
