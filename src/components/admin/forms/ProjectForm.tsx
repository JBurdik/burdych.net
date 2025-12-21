import { useAppForm } from "../../../lib/form-context";
import { projectSchema, type ProjectFormData } from "../../../data/schemas";
import { technologies } from "../../../data/portfolio";
import { Save } from "lucide-react";

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
}

const defaultProjectValues: ProjectFormData = {
  title: "",
  description: "",
  image: "",
  technologies: [],
  liveUrl: "",
  githubUrl: "",
  featured: false,
};

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
              <field.TextField label="Název projektu" placeholder="ERP Systém" />
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
