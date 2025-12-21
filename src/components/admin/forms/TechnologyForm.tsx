import { useAppForm } from "../../../lib/form-context";
import { technologySchema, type TechnologyFormData } from "../../../data/schemas";
import { Save } from "lucide-react";

interface TechnologyFormProps {
  defaultValues?: Partial<TechnologyFormData>;
  onSubmit: (data: TechnologyFormData) => Promise<void>;
  onCancel?: () => void;
}

const defaultTechnologyValues: TechnologyFormData = {
  name: "",
  icon: "",
  category: "frontend",
  proficiency: 50,
};

const categoryOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "tools", label: "Nástroje" },
  { value: "other", label: "Ostatní" },
];

export function TechnologyForm({
  defaultValues,
  onSubmit,
  onCancel,
}: TechnologyFormProps) {
  const form = useAppForm({
    defaultValues: { ...defaultTechnologyValues, ...defaultValues },
    validators: {
      onChange: technologySchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value as TechnologyFormData);
    },
  });

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
            <form.AppField name="name">
              {(field) => (
                <field.TextField label="Název" placeholder="React" />
              )}
            </form.AppField>

            <form.AppField name="icon">
              {(field) => (
                <field.TextField label="Ikona" placeholder="react" />
              )}
            </form.AppField>
          </div>

          <form.AppField name="category">
            {(field) => (
              <field.SelectField
                label="Kategorie"
                options={categoryOptions}
                placeholder="Vyberte kategorii"
              />
            )}
          </form.AppField>

          <form.AppField name="proficiency">
            {(field) => (
              <field.SliderField
                label="Úroveň dovednosti"
                min={1}
                max={100}
                suffix="%"
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
            Uložit technologii
          </form.SubmitButton>
        </div>
      </form.AppForm>
    </form>
  );
}
