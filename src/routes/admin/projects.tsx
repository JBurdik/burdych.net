import { createFileRoute, useRouter } from "@tanstack/react-router";
import { authMiddleware } from "../../lib/auth-middleware";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Star, ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { Modal, ConfirmModal } from "../../components/admin/Modal";
import { ProjectForm } from "../../components/admin/forms/ProjectForm";
import { FadeUp } from "../../components/ui/AnimatedText";
import type { Project } from "../../db/schema";
import { type ProjectFormData } from "../../data/schemas";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../server/projects";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
  server: {
    middleware: [authMiddleware],
  },
  loader: async () => {
    const projects = await getProjects();
    return { projects };
  },
});

function AdminProjects() {
  const { projects } = Route.useLoaderData();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    if (selectedProject) {
      // Update existing
      await updateProject({
        data: {
          id: selectedProject.id,
          ...data,
        },
      });
    } else {
      // Create new
      await createProject({
        data: {
          ...data,
          image: data.image || "/projects/placeholder.jpg",
        },
      });
    }

    setIsModalOpen(false);
    setSelectedProject(null);
    router.invalidate();
  };

  const handleConfirmDelete = async () => {
    if (selectedProject) {
      await deleteProject({ data: selectedProject.id });
      setSelectedProject(null);
      setIsDeleteModalOpen(false);
      router.invalidate();
    }
  };

  const columns = [
    {
      key: "title" as const,
      label: "Název",
      sortable: true,
      render: (item: Project) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
            <span className="text-cyan-400 font-bold text-sm">
              {item.title.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{item.title}</p>
            <p className="text-gray-500 text-xs line-clamp-1 max-w-[200px]">
              {item.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "technologies" as const,
      label: "Technologie",
      render: (item: Project) => (
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
        </div>
      ),
    },
    {
      key: "featured" as const,
      label: "Hlavní",
      className: "w-24",
      render: (item: Project) =>
        item.featured ? (
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        ) : (
          <span className="text-gray-600">-</span>
        ),
    },
    {
      key: "links" as const,
      label: "Odkazy",
      className: "w-24",
      render: (item: Project) => (
        <div className="flex items-center gap-2">
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
  ];

  const actions = (item: Project) => (
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
    <AdminLayout title="Projekty" subtitle="Správa projektů">
      <FadeUp>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">Celkem {projects.length} projektů</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            Přidat projekt
          </motion.button>
        </div>

        {/* Table */}
        <DataTable
          data={projects}
          columns={columns}
          keyField="id"
          searchFields={["title", "description"]}
          searchPlaceholder="Hledat projekty..."
          actions={actions}
          onRowClick={handleEdit}
          emptyMessage="Zatím nemáte žádné projekty"
        />
      </FadeUp>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        title={selectedProject ? "Upravit projekt" : "Nový projekt"}
        size="lg"
      >
        <ProjectForm
          key={selectedProject?.id ?? "new"}
          defaultValues={
            selectedProject
              ? {
                  title: selectedProject.title,
                  description: selectedProject.description,
                  image: selectedProject.image ?? undefined,
                  technologies: selectedProject.technologies ?? [],
                  liveUrl: selectedProject.liveUrl ?? undefined,
                  githubUrl: selectedProject.githubUrl ?? undefined,
                  featured: selectedProject.featured ?? false,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Smazat projekt"
        message={`Opravdu chcete smazat projekt "${selectedProject?.title}"? Tuto akci nelze vrátit.`}
        confirmText="Smazat"
        variant="danger"
      />
    </AdminLayout>
  );
}
