import { useAppForm } from "../../../lib/form-context";
import { experienceSchema, type ExperienceFormData } from "../../../data/schemas";
import { technologies } from "../../../data/portfolio";
import { Save } from "lucide-react";

interface ExperienceFormProps {
  defaultValues?: Partial<ExperienceFormData>;
  onSubmit: (data: ExperienceFormData) => Promise<void>;
  onCancel?: () => void;
}

const defaultExperienceValues: ExperienceFormData = {
  company: "",
  role: "",
  period: "",
  description: "",
  technologies: [],
};

export function ExperienceForm({
  defaultValues,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const form = useAppForm({
    defaultValues: { ...defaultExperienceValues, ...defaultValues },
    validators: {
      onChange: experienceSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value as ExperienceFormData);
    },
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="role">
              {(field) => (
                <field.TextField
                  label="Role"
                  placeholder="Frontend Developer"
                />
              )}
            </form.AppField>

            <form.AppField name="company">
              {(field) => (
                <field.TextField label="Firma" placeholder="Název firmy" />
              )}
            </form.AppField>
          </div>

          <form.AppField name="period">
            {(field) => (
              <field.TextField
                label="Období"
                placeholder="2023 - současnost"
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Popis"
                placeholder="Popište vaši roli a odpovědnosti..."
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
            Uložit zkušenost
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}
