import { createFileRoute, useRouter } from "@tanstack/react-router";
import { authMiddleware } from "../../lib/auth-middleware";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Briefcase } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { Modal, ConfirmModal } from "../../components/admin/Modal";
import { ExperienceForm } from "../../components/admin/forms/ExperienceForm";
import { FadeUp } from "../../components/ui/AnimatedText";
import type { Experience } from "../../db/schema";
import { type ExperienceFormData } from "../../data/schemas";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../server/experiences";

export const Route = createFileRoute("/admin/experiences")({
  component: AdminExperiences,
  server: {
    middleware: [authMiddleware],
  },
  loader: async () => {
    const experiences = await getExperiences();
    return { experiences };
  },
});

function AdminExperiences() {
  const { experiences } = Route.useLoaderData();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  const handleCreate = () => {
    setSelectedExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleDelete = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: ExperienceFormData) => {
    if (selectedExperience) {
      await updateExperience({
        data: {
          id: selectedExperience.id,
          ...data,
        },
      });
    } else {
      await createExperience({
        data: {
          ...data,
        },
      });
    }

    setIsModalOpen(false);
    setSelectedExperience(null);
    router.invalidate();
  };

  const handleConfirmDelete = async () => {
    if (selectedExperience) {
      await deleteExperience({ data: selectedExperience.id });
      setSelectedExperience(null);
      setIsDeleteModalOpen(false);
      router.invalidate();
    }
  };

  const columns = [
    {
      key: "role" as const,
      label: "Role",
      sortable: true,
      render: (item: Experience) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-white font-medium">{item.role}</p>
            <p className="text-gray-500 text-xs">{item.company}</p>
          </div>
        </div>
      ),
    },
    {
      key: "period" as const,
      label: "Období",
      sortable: true,
      render: (item: Experience) => (
        <span className="text-gray-300 font-mono text-sm">{item.period}</span>
      ),
    },
    {
      key: "technologies" as const,
      label: "Technologie",
      render: (item: Experience) => (
        <div className="flex flex-wrap gap-1">
          {(item.technologies ?? []).slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-xs"
            >
              {tech}
            </span>
          ))}
          {(item.technologies ?? []).length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-xs">
              +{(item.technologies ?? []).length - 3}
            </span>
          )}
          {(item.technologies ?? []).length === 0 && (
            <span className="text-gray-600 text-xs">-</span>
          )}
        </div>
      ),
    },
    {
      key: "description" as const,
      label: "Popis",
      className: "max-w-xs",
      render: (item: Experience) => (
        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
      ),
    },
  ];

  const actions = (item: Experience) => (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(item);
        }}
        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(item);
        }}
        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );

  return (
    <AdminLayout title="Zkušenosti" subtitle="Pracovní zkušenosti">
      <FadeUp>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Celkem {experiences.length} zkušeností
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            Přidat zkušenost
          </motion.button>
        </div>

        {/* Table */}
        <DataTable
          data={experiences}
          columns={columns}
          keyField="id"
          searchFields={["role", "company", "description"]}
          searchPlaceholder="Hledat zkušenosti..."
          actions={actions}
          onRowClick={handleEdit}
          emptyMessage="Zatím nemáte žádné pracovní zkušenosti"
        />
      </FadeUp>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExperience(null);
        }}
        title={selectedExperience ? "Upravit zkušenost" : "Nová zkušenost"}
        size="lg"
      >
        <ExperienceForm
          key={selectedExperience?.id ?? "new"}
          defaultValues={
            selectedExperience
              ? {
                  company: selectedExperience.company,
                  role: selectedExperience.role,
                  period: selectedExperience.period,
                  description: selectedExperience.description,
                  technologies: selectedExperience.technologies ?? [],
                  logo: selectedExperience.logo ?? undefined,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedExperience(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExperience(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Smazat zkušenost"
        message={`Opravdu chcete smazat zkušenost "${selectedExperience?.role} - ${selectedExperience?.company}"? Tuto akci nelze vrátit.`}
        confirmText="Smazat"
        variant="danger"
      />
    </AdminLayout>
  );
}
