import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Folder,
  Briefcase,
  Code2,
  Settings,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { GradientText } from "../ui/AnimatedText";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projekty", icon: Folder },
  { href: "/admin/experiences", label: "Zkušenosti", icon: Briefcase },
  { href: "/admin/technologies", label: "Technologie", icon: Code2 },
  { href: "/admin/settings", label: "Nastavení", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  index,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.2 }}
      className="relative"
    >
      <Link
        to={href}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-white"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-cyan-500 to-emerald-500"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon
            className={`w-5 h-5 ${isActive ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors`}
          />
        </motion.div>

        <span className="font-medium">{label}</span>

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10"
          initial={false}
        />
      </Link>
    </motion.div>
  );
}

export function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-xl bg-[#12121a] border border-white/10 text-white"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className={`fixed md:relative md:translate-x-0 top-0 left-0 z-40 w-64 h-screen bg-[#0a0a0f] border-r border-white/10 flex flex-col transition-transform md:transition-none`}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-white/10"
        >
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Admin</h1>
              <p className="text-xs text-gray-500">
                <GradientText>Panel</GradientText>
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={isActive(item.href)}
              index={index}
            />
          ))}
        </nav>

        {/* Back to site */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-white/10"
        >
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
            </motion.div>
            <span className="font-medium">Zpět na web</span>
          </Link>
        </motion.div>
      </motion.aside>
    </>
  );
}
