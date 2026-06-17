import { createFileRoute, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Globe,
  FileCode,
  BookOpen,
  Code,
  Layers,
  Zap,
  Star,
  Heart,
  Music,
  Camera,
  Coffee,
  Gamepad2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "../../components/admin/DataTable";
import { Modal, ConfirmModal } from "../../components/admin/Modal";
import { FadeUp } from "../../components/ui/AnimatedText";
import type { AppLink } from "../../db/schema";
import {
  getAppLinks,
  createAppLink,
  updateAppLink,
  deleteAppLink,
} from "../../server/app-links";
import { getPresignedUploadUrl } from "../../server/upload";

export const Route = createFileRoute("/admin/app-links")({
  component: AdminAppLinks,
  staticData: { title: "App Linky", subtitle: "Správa odkazů na aplikace" },
  loader: async () => {
    const links = await getAppLinks();
    return { links };
  },
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  FileCode,
  BookOpen,
  Code,
  Layers,
  Zap,
  Star,
  Heart,
  Music,
  Camera,
  Coffee,
  Gamepad: Gamepad2,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const ACCENT_OPTIONS = [
  { label: "Cyan → Blue", value: "from-cyan-500 to-blue-500" },
  { label: "Indigo → Purple", value: "from-indigo-500 to-purple-500" },
  { label: "Emerald → Teal", value: "from-emerald-500 to-teal-500" },
  { label: "Amber → Orange", value: "from-amber-500 to-orange-500" },
  { label: "Pink → Rose", value: "from-pink-500 to-rose-500" },
  { label: "Violet → Fuchsia", value: "from-violet-500 to-fuchsia-500" },
  { label: "Sky → Cyan", value: "from-sky-500 to-cyan-500" },
  { label: "Red → Orange", value: "from-red-500 to-orange-500" },
  { label: "Lime → Green", value: "from-lime-500 to-green-500" },
  { label: "Slate → Zinc", value: "from-slate-500 to-zinc-600" },
];

function AccentPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = ACCENT_OPTIONS.find((a) => a.value === value) ?? ACCENT_OPTIONS[0];

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition hover:border-white/20 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
      >
        <span className={`h-5 w-8 shrink-0 rounded-md bg-gradient-to-r ${value}`} />
        <span className="flex-1 text-left">{current.label}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f0f1a] p-2 shadow-2xl shadow-black/60"
          >
            <div className="flex flex-col gap-1">
              {ACCENT_OPTIONS.map((a) => {
                const isSelected = a.value === value;
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => { onChange(a.value); setOpen(false); }}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition ${
                      isSelected ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"
                    }`}
                  >
                    <span className={`h-5 w-10 shrink-0 rounded-md bg-gradient-to-r ${a.value}`} />
                    <span className={`text-sm ${isSelected ? "text-white" : "text-gray-400"}`}>
                      {a.label}
                    </span>
                    {isSelected && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const CurrentIcon = ICON_MAP[value] ?? Globe;

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white transition hover:border-white/20 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10">
          <CurrentIcon className="h-4 w-4 text-cyan-300" />
        </span>
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f0f1a] shadow-2xl shadow-black/60"
          >
            <div className="grid grid-cols-4 gap-1.5 p-2">
              {ICON_OPTIONS.map((name) => {
                const Icon = ICON_MAP[name];
                const isSelected = name === value;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-lg px-1.5 py-2 text-center transition ${
                      isSelected
                        ? "bg-cyan-500/20 ring-1 ring-cyan-500/40"
                        : "hover:bg-white/8"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg ${
                        isSelected ? "bg-cyan-500/30" : "bg-white/8"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isSelected ? "text-cyan-300" : "text-gray-400"}`}
                      />
                    </span>
                    <span className="text-[10px] leading-tight text-gray-400">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AppLinkFormData {
  title: string;
  url: string;
  iconName: string;
  iconUrl: string;
  accent: string;
  onDesktop: boolean;
  inDock: boolean;
  order: number;
  published: boolean;
}

function AppLinkForm({
  defaultValues,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<AppLinkFormData & { iconUrl?: string | null }>;
  onSubmit: (data: AppLinkFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [url, setUrl] = useState(defaultValues?.url ?? "");
  const [iconName, setIconName] = useState(defaultValues?.iconName ?? "Globe");
  const [iconUrl, setIconUrl] = useState(defaultValues?.iconUrl ?? "");
  const [accent, setAccent] = useState(
    defaultValues?.accent ?? "from-cyan-500 to-blue-500",
  );
  const [onDesktop, setOnDesktop] = useState(defaultValues?.onDesktop ?? true);
  const [inDock, setInDock] = useState(defaultValues?.inDock ?? false);
  const [order, setOrder] = useState(defaultValues?.order ?? 0);
  const [published, setPublished] = useState(defaultValues?.published ?? true);
  const [iconUploading, setIconUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleIconImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconUploading(true);
    try {
      const { presignedUrl, publicUrl } = await getPresignedUploadUrl({
        data: { filename: file.name, contentType: file.type, fileSize: file.size },
      });
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      setIconUrl(publicUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIconUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ title, url, iconName, iconUrl, accent, onDesktop, inDock, order, published });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Název
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Např. Moje aplikace"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://myapp.example.com"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Ikona
          </label>
          <IconPicker value={iconName} onChange={setIconName} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Pořadí
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Vlastní ikona (obrázek){" "}
          <span className="text-gray-600">– přepíše výběr ikony</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={handleIconImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageRef.current?.click()}
            disabled={iconUploading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:border-cyan-400/40 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {iconUploading ? "Nahrávám…" : "Nahrát obrázek"}
          </button>
          {iconUrl && (
            <div className="flex items-center gap-2">
              <img
                src={iconUrl}
                alt=""
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/20"
              />
              <button
                type="button"
                onClick={() => setIconUrl("")}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Odstranit
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-400">
          Barva
        </label>
        <AccentPicker value={accent} onChange={setAccent} />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={onDesktop}
            onChange={(e) => setOnDesktop(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500"
          />
          <span className="text-sm text-gray-300">Zobrazit na ploše</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={inDock}
            onChange={(e) => setInDock(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500"
          />
          <span className="text-sm text-gray-300">Zobrazit v docku</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-500"
          />
          <span className="text-sm text-gray-300">Publikováno</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:border-white/20 hover:text-white"
        >
          Zrušit
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting || iconUploading}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Ukládám…" : "Uložit"}
        </motion.button>
      </div>
    </form>
  );
}

function AdminAppLinks() {
  const { links } = Route.useLoaderData();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<AppLink | null>(null);

  const handleCreate = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleEdit = (link: AppLink) => {
    setSelected(link);
    setIsModalOpen(true);
  };

  const handleDelete = (link: AppLink) => {
    setSelected(link);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: AppLinkFormData) => {
    const payload = { ...data, iconUrl: data.iconUrl || null };
    if (selected) {
      await updateAppLink({ data: { id: selected.id, ...payload } });
    } else {
      await createAppLink({ data: payload });
    }
    setIsModalOpen(false);
    setSelected(null);
    router.invalidate();
  };

  const handleConfirmDelete = async () => {
    if (selected) {
      await deleteAppLink({ data: selected.id });
      setSelected(null);
      setIsDeleteModalOpen(false);
      router.invalidate();
    }
  };

  const columns = [
    {
      key: "title" as const,
      label: "Název",
      sortable: true,
      render: (item: AppLink) => (
        <div className="flex items-center gap-3">
          {item.iconUrl ? (
            <img
              src={item.iconUrl}
              alt=""
              className="h-10 w-10 rounded-xl object-cover shadow-md ring-1 ring-white/10"
            />
          ) : (
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${item.accent} shadow-md`}
            >
              {(() => {
                const Icon = ICON_MAP[item.iconName] ?? Globe;
                return <Icon className="h-5 w-5 text-white" />;
              })()}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{item.title}</p>
            <p className="max-w-[200px] truncate text-xs text-gray-500">
              {item.url}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "onDesktop" as const,
      label: "Plocha",
      className: "w-24",
      render: (item: AppLink) =>
        item.onDesktop ? (
          <span className="text-xs text-cyan-400">Ano</span>
        ) : (
          <span className="text-xs text-gray-600">Ne</span>
        ),
    },
    {
      key: "published" as const,
      label: "Stav",
      className: "w-28",
      render: (item: AppLink) =>
        item.published ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Eye className="h-3.5 w-3.5" /> Publikováno
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <EyeOff className="h-3.5 w-3.5" /> Skryto
          </span>
        ),
    },
    {
      key: "order" as const,
      label: "Pořadí",
      className: "w-20",
      render: (item: AppLink) => (
        <span className="text-sm text-gray-400">{item.order}</span>
      ),
    },
  ];

  const actions = (item: AppLink) => (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          window.open(item.url, "_blank");
        }}
        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-emerald-400"
      >
        <ExternalLink className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(item);
        }}
        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-cyan-400"
      >
        <Edit2 className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(item);
        }}
        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </motion.button>
    </div>
  );

  return (
    <>
      <FadeUp>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">Celkem {links.length} odkazů</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Přidat odkaz
          </motion.button>
        </div>

        <DataTable
          data={links}
          columns={columns}
          keyField="id"
          searchFields={["title", "url"]}
          searchPlaceholder="Hledat odkazy..."
          actions={actions}
          onRowClick={handleEdit}
          emptyMessage="Zatím nemáte žádné app linky"
        />
      </FadeUp>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
        title={selected ? "Upravit odkaz" : "Nový odkaz"}
        size="lg"
      >
        <AppLinkForm
          key={selected?.id ?? "new"}
          defaultValues={
            selected
              ? {
                  title: selected.title,
                  url: selected.url,
                  iconName: selected.iconName,
                  iconUrl: selected.iconUrl,
                  accent: selected.accent,
                  onDesktop: selected.onDesktop ?? true,
                  inDock: selected.inDock ?? false,
                  order: selected.order ?? 0,
                  published: selected.published ?? true,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelected(null);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelected(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Smazat odkaz"
        message={`Opravdu chcete smazat "${selected?.title}"? Tuto akci nelze vrátit.`}
        confirmText="Smazat"
        variant="danger"
      />
    </>
  );
}
