import { motion } from "framer-motion";
import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

// Simplified floating orbs for admin
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", right: "10%" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-[80px]"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "20%", left: "20%" }}
      />
    </div>
  );
}

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Background effects */}
        <FloatingOrbs />
        <div className="noise-overlay" />

        {/* Header */}
        {(title || subtitle) && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 border-b border-white/10"
          >
            {subtitle && (
              <p className="text-cyan-400 font-mono text-sm mb-1">{subtitle}</p>
            )}
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h1>
            )}
          </motion.header>
        )}

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
