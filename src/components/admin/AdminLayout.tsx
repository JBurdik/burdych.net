import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

// Subtle ambient glow behind the content
function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[110px]"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "8%", right: "8%" }}
      />
      <motion.div
        className="absolute h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-[90px]"
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "16%", left: "18%" }}
      />
    </div>
  );
}

interface AdminShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  email?: string;
}

export function AdminShell({
  children,
  title,
  subtitle,
  email,
}: AdminShellProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[radial-gradient(125%_125%_at_50%_0%,#0c1320_0%,#0a0a0f_45%,#06070b_100%)] text-white">
      <AdminSidebar email={email} />

      <div className="relative flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <AmbientGlow />
        <div className="noise-overlay" />

        {/* Sticky header */}
        {(title || subtitle) && (
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a0f]/70 px-6 py-4 backdrop-blur-xl md:px-8">
            <div className="min-w-0 pl-12 md:pl-0">
              {subtitle && (
                <p className="font-mono text-xs tracking-wide text-cyan-400/90">
                  {subtitle}
                </p>
              )}
              {title && (
                <h1 className="truncate bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
                  {title}
                </h1>
              )}
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:border-cyan-400/40 hover:text-white sm:flex"
            >
              <ExternalLink className="h-4 w-4" />
              Zobrazit web
            </a>
          </header>
        )}

        {/* Animated page content */}
        <main className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Backwards-compatible wrapper: lets any page still render standalone if needed.
export function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <AdminShell title={title} subtitle={subtitle}>
      {children}
    </AdminShell>
  );
}

// Re-export Link so pages can import from one place if desired.
export { Link };
