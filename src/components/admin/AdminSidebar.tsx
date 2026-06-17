import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Folder,
  Briefcase,
  Code2,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  AppWindow,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "../../lib/auth-client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projekty", icon: Folder },
  { href: "/admin/experiences", label: "Zkušenosti", icon: Briefcase },
  { href: "/admin/technologies", label: "Technologie", icon: Code2 },
  { href: "/admin/mini-apps", label: "Mini Apps", icon: AppWindow },
  { href: "/admin/app-links", label: "App Linky", icon: LinkIcon },
  { href: "/admin/settings", label: "Nastavení", icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors duration-200 ${
        isActive
          ? "text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="adminNavActive"
          className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-emerald-500/15"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {isActive && (
        <motion.div
          layoutId="adminNavBar"
          className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-400 to-emerald-500"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon
        className={`h-5 w-5 shrink-0 transition-colors ${
          isActive ? "text-cyan-300" : "group-hover:text-cyan-300"
        }`}
      />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

export function AdminSidebar({ email }: { email?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const isActive = (href: string) =>
    href === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(href);

  const initials = (email ?? "A").slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-white/10 bg-[#12121a]/80 p-2.5 text-white backdrop-blur-xl md:hidden"
        aria-label="Menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0b0b12]/80 backdrop-blur-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="border-b border-white/10 p-5">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 text-sm font-black text-black shadow-lg shadow-cyan-500/20">
              JB
            </span>
            <div>
              <p className="font-semibold leading-tight text-white">
                burdych<span className="text-cyan-400">OS</span>
              </p>
              <p className="text-xs text-gray-500">Administrace</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={isActive(item.href)}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        {/* User + actions */}
        <div className="space-y-1 border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 text-xs font-bold text-cyan-200">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {email ?? "Admin"}
              </p>
              <p className="text-xs text-emerald-400">● Online</p>
            </div>
          </div>
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:text-cyan-300" />
            Zpět na web
          </Link>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            Odhlásit se
          </button>
        </div>
      </aside>
    </>
  );
}
