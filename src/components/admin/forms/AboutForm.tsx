import { useAppForm } from "../../../lib/form-context";
import { aboutSchema } from "../../../data/schemas";
import type { About } from "../../../data/portfolio";

type AboutFormData = Omit<About, "socials">;

interface AboutFormProps {
  defaultValues?: Partial<AboutFormData>;
  onSubmit: (data: AboutFormData) => Promise<void>;
  onCancel: () => void;
}

export function AboutForm({
  defaultValues,
  onSubmit,
  onCancel,
}: AboutFormProps) {
  const form = useAppForm({
    defaultValues: {
      name: defaultValues?.name ?? "",
      title: defaultValues?.title ?? "",
      bio: defaultValues?.bio ?? "",
      avatar: defaultValues?.avatar ?? "",
      location: defaultValues?.location ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      cvUrl: defaultValues?.cvUrl ?? "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = aboutSchema.safeParse(value);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            const path = err.path.join(".");
            errors[path] = err.message;
          });
          return errors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Personal Info Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
            Osobní údaje
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="name">
              {(field) => (
                <field.TextField label="Jméno" placeholder="Jan Novák" />
              )}
            </form.AppField>

            <form.AppField name="title">
              {(field) => (
                <field.TextField
                  label="Titul / Pozice"
                  placeholder="Frontend Developer"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="bio">
            {(field) => (
              <field.TextareaField
                label="Bio"
                placeholder="Napište něco o sobě..."
                rows={8}
              />
            )}
          </form.AppField>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
            Kontaktní údaje
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                />
              )}
            </form.AppField>

            <form.AppField name="phone">
              {(field) => (
                <field.TextField
                  label="Telefon"
                  type="tel"
                  placeholder="+420 123 456 789"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="location">
            {(field) => (
              <field.TextField
                label="Lokace"
                placeholder="Praha, Česká republika"
              />
            )}
          </form.AppField>
        </div>

        {/* Media Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
            Média
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField name="avatar">
              {(field) => (
                <field.TextField
                  label="Avatar URL"
                  placeholder="/avatar.png nebo https://..."
                />
              )}
            </form.AppField>

            <form.AppField name="cvUrl">
              {(field) => (
                <field.TextField
                  label="CV URL"
                  placeholder="/CV.pdf nebo https://..."
                />
              )}
            </form.AppField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Zrušit
          </button>
          <form.SubmitButton>Uložit změny</form.SubmitButton>
        </div>
      </form>
    </form.AppForm>
  );
}
