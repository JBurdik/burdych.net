import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Code2 } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Modal, ConfirmModal } from "../../components/admin/Modal";
import { TechnologyForm } from "../../components/admin/forms/TechnologyForm";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
} from "../../components/ui/AnimatedText";
import type { Technology } from "../../db/schema";
import { type TechnologyFormData } from "../../data/schemas";
import {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../../server/technologies";

export const Route = createFileRoute("/admin/technologies")({
  component: AdminTechnologies,
  loader: async () => {
    const technologies = await getTechnologies();
    return { technologies };
  },
});

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Nástroje",
  other: "Ostatní",
};

const categoryColors: Record<string, string> = {
  frontend: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30",
  backend: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
  tools: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  other: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
};

function TechnologyCard({
  tech,
  onEdit,
  onDelete,
}: {
  tech: Technology;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-4 rounded-2xl bg-gradient-to-br ${categoryColors[tech.category]} border backdrop-blur-sm group`}
    >
      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
        <Code2 className="w-6 h-6 text-white" />
      </div>

      {/* Name */}
      <h3 className="text-white font-medium mb-1">{tech.name}</h3>

      {/* Category */}
      <p className="text-gray-400 text-xs mb-3">
        {categoryLabels[tech.category]}
      </p>

      {/* Proficiency bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Úroveň</span>
          <span className="text-cyan-400">{tech.proficiency}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tech.proficiency}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
          />
        </div>
      </div>
    </motion.div>
  );
}

function AdminTechnologies() {
  const { technologies } = Route.useLoaderData();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = ["frontend", "backend", "tools", "other"];

  const filteredTech = activeCategory
    ? technologies.filter((t) => t.category === activeCategory)
    : technologies;

  const handleCreate = () => {
    setSelectedTech(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tech: Technology) => {
    setSelectedTech(tech);
    setIsModalOpen(true);
  };

  const handleDelete = (tech: Technology) => {
    setSelectedTech(tech);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: TechnologyFormData) => {
    if (selectedTech) {
      await updateTechnology({
        data: {
          id: selectedTech.id,
          ...data,
        },
      });
    } else {
      await createTechnology({
        data: {
          ...data,
        },
      });
    }

    setIsModalOpen(false);
    setSelectedTech(null);
    router.invalidate();
  };

  const handleConfirmDelete = async () => {
    if (selectedTech) {
      await deleteTechnology({ data: selectedTech.id });
      setSelectedTech(null);
      setIsDeleteModalOpen(false);
      router.invalidate();
    }
  };

  return (
    <AdminLayout title="Technologie" subtitle="Správa technologií">
      <FadeUp>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <p className="text-gray-400">
            Celkem {technologies.length} technologií
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            Přidat technologii
          </motion.button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === null
                ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            Všechny ({technologies.length})
          </motion.button>
          {categories.map((cat) => {
            const count = technologies.filter((t) => t.category === cat).length;
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                }`}
              >
                {categoryLabels[cat]} ({count})
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTech.map((tech) => (
            <StaggerItem key={tech.name}>
              <TechnologyCard
                tech={tech}
                onEdit={() => handleEdit(tech)}
                onDelete={() => handleDelete(tech)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filteredTech.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Žádné technologie v této kategorii
          </div>
        )}
      </FadeUp>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTech(null);
        }}
        title={selectedTech ? "Upravit technologii" : "Nová technologie"}
        size="md"
      >
        <TechnologyForm
          defaultValues={
            selectedTech
              ? {
                  name: selectedTech.name,
                  icon: selectedTech.icon,
                  category: selectedTech.category,
                  proficiency: selectedTech.proficiency,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTech(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTech(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Smazat technologii"
        message={`Opravdu chcete smazat technologii "${selectedTech?.name}"? Tuto akci nelze vrátit.`}
        confirmText="Smazat"
        variant="danger"
      />
    </AdminLayout>
  );
}
