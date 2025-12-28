import { useAppForm } from "../../../lib/form-context";
import { projectSchema, type ProjectFormData } from "../../../data/schemas";
import { technologies } from "../../../data/portfolio";
import { Save, ImageIcon, X, Plus, Upload, Link } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUploadField } from "../fields/FileUploadField";

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
}

const defaultProjectValues: ProjectFormData = {
  title: "",
  description: "",
  image: "",
  images: [],
  technologies: [],
  liveUrl: "",
  githubUrl: "",
  featured: false,
};

// Separate component for images field to avoid hooks violation
function ImagesFieldContent({
  images,
  onAddImage,
  onRemoveImage,
}: {
  images: string[];
  onAddImage: (url: string) => void;
  onRemoveImage: (url: string) => void;
}) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

  const addImage = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) return;

    try {
      new URL(trimmedUrl);
      onAddImage(trimmedUrl);
      setNewImageUrl("");
      setUrlError("");
    } catch {
      setUrlError("Neplatná URL adresa");
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        <span className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Obrázky projektu
        </span>
      </label>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-[#12121a] rounded-xl border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setImageMode("upload")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            imageMode === "upload"
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Upload className="w-4 h-4" />
          Nahrát
        </button>
        <button
          type="button"
          onClick={() => setImageMode("url")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            imageMode === "url"
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Link className="w-4 h-4" />
          URL
        </button>
      </div>

      {/* Upload mode */}
      {imageMode === "upload" && (
        <FileUploadField
          onUploadComplete={onAddImage}
          onUploadRemove={onRemoveImage}
          existingUrls={images}
          maxFiles={10}
        />
      )}

      {/* URL mode */}
      {imageMode === "url" && (
        <>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => {
                setNewImageUrl(e.target.value);
                setUrlError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-3 rounded-xl bg-[#12121a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
            <motion.button
              type="button"
              onClick={addImage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {urlError && <p className="text-red-400 text-sm">{urlError}</p>}

          {/* Image previews */}
          <AnimatePresence mode="popLayout">
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3"
              >
                {images.map((url: string, index: number) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="relative group aspect-video rounded-lg overflow-hidden border border-white/10"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%231a1a24' width='100' height='100'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='12' x='50' y='50' text-anchor='middle' dominant-baseline='middle'%3EError%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button
                        type="button"
                        onClick={() => onRemoveImage(url)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded bg-black/60 text-xs text-gray-300">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <p className="text-gray-500 text-xs">
        {imageMode === "upload"
          ? "Přetáhněte soubory nebo klikněte pro výběr. První obrázek bude použit jako hlavní."
          : "Přidejte URL adresy obrázků projektu. První obrázek bude použit jako hlavní."}
      </p>
    </div>
  );
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const form = useAppForm({
    defaultValues: { ...defaultProjectValues, ...defaultValues },
    validators: {
      onChange: projectSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value as ProjectFormData);
    },
  });

  // Get unique tech names for suggestions
  const techSuggestions = [...new Set(technologies.map((t) => t.name))];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppForm>
        <div className="space-y-6">
          <form.AppField name="title">
            {(field) => (
              <field.TextField
                label="Název projektu"
                placeholder="ERP Systém"
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Popis"
                placeholder="Popište váš projekt..."
                rows={4}
                showCharCount
              />
            )}
          </form.AppField>

          <form.AppField name="technologies">
            {(field) => (
              <field.TagInputField
                label="Technologie"
                placeholder="Přidejte technologii..."
                suggestions={techSuggestions}
              />
            )}
          </form.AppField>

          {/* Images field */}
          <form.AppField name="images">
            {(field) => {
              const images = field.state.value || [];

              const handleAddImage = (url: string) => {
                if (!images.includes(url)) {
                  field.handleChange([...images, url]);
                }
              };

              const handleRemoveImage = (urlToRemove: string) => {
                field.handleChange(
                  images.filter((url: string) => url !== urlToRemove),
                );
              };

              return (
                <ImagesFieldContent
                  images={images}
                  onAddImage={handleAddImage}
                  onRemoveImage={handleRemoveImage}
                />
              );
            }}
          </form.AppField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="liveUrl">
              {(field) => (
                <field.TextField
                  label="Live URL"
                  placeholder="https://example.com"
                  type="url"
                />
              )}
            </form.AppField>

            <form.AppField name="githubUrl">
              {(field) => (
                <field.TextField
                  label="GitHub URL"
                  placeholder="https://github.com/..."
                  type="url"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="featured">
            {(field) => (
              <field.CheckboxField
                label="Hlavní projekt"
                description="Zobrazí se jako hlavní projekt na homepage"
              />
            )}
          </form.AppField>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-6 border-t border-white/10 mt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Zrušit
            </button>
          )}
          <form.SubmitButton>
            <Save className="w-4 h-4" />
            Uložit projekt
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}
