import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Folder,
  Briefcase,
  Code2,
  Star,
  Plus,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { StatCard } from "../../components/admin/StatCard";
import { GlowCard } from "../../components/ui/GlowCard";
import { FadeUp, GradientText } from "../../components/ui/AnimatedText";
import { experiences, projects, technologies } from "../../data/portfolio";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    {
      title: "Celkem projektů",
      value: projects.length,
      icon: <Folder className="w-5 h-5" />,
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      title: "Pracovní zkušenosti",
      value: experiences.length,
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      title: "Technologie",
      value: technologies.length,
      icon: <Code2 className="w-5 h-5" />,
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "Hlavní projekty",
      value: projects.filter((p) => p.featured).length,
      icon: <Star className="w-5 h-5" />,
      gradient: "from-cyan-500 to-emerald-500",
    },
  ];

  const recentProjects = projects.slice(0, 3);
  const recentExperiences = experiences.slice(0, 3);

  return (
    <AdminLayout title="Dashboard" subtitle="Přehled">
      {/* Stats Grid */}
      <FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Quick Actions */}
      <FadeUp>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Rychlé akce</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/projects">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Přidat projekt
              </motion.button>
            </Link>
            <Link to="/admin/experiences">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-400 hover:border-teal-500/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Přidat zkušenost
              </motion.button>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Zobrazit web
              </motion.button>
            </a>
          </div>
        </div>
      </FadeUp>

      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <FadeUp>
          <GlowCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Poslední <GradientText>projekty</GradientText>
              </h2>
              <Link
                to="/admin/projects"
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
              >
                Zobrazit vše
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Folder className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {project.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {project.technologies.slice(0, 2).join(", ")}
                        {project.technologies.length > 2 && "..."}
                      </p>
                    </div>
                  </div>
                  {project.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </FadeUp>

        {/* Recent Experiences */}
        <FadeUp>
          <GlowCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Poslední <GradientText>zkušenosti</GradientText>
              </h2>
              <Link
                to="/admin/experiences"
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
              >
                Zobrazit vše
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                      <Briefcase className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {exp.role}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {exp.company} • {exp.period}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </FadeUp>
      </div>
    </AdminLayout>
  );
}
