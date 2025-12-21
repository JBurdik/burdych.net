import { useFieldContext } from "@/lib/form-context";
import { Field } from "@base-ui/react/field";

interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  rows?: number;
  showCharCount?: boolean;
  maxLength?: number;
}

export function TextareaField({
  label,
  placeholder,
  rows = 4,
  showCharCount = false,
  maxLength,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;
  const charCount = (field.state.value || "").length;

  return (
    <Field.Root name={field.name} invalid={hasErrors} className="space-y-2">
      <div className="flex items-center justify-between">
        <Field.Label className="block text-sm font-medium text-gray-300">
          {label}
        </Field.Label>
        {showCharCount && (
          <span
            className={`text-xs ${maxLength && charCount > maxLength ? "text-red-400" : "text-gray-500"}`}
          >
            {charCount}
            {maxLength && `/${maxLength}`}
          </span>
        )}
      </div>
      <textarea
        value={field.state.value || ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          field.handleChange(e.target.value)
        }
        onBlur={field.handleBlur}
        placeholder={placeholder}
        rows={rows}
        data-invalid={hasErrors || undefined}
        className="w-full px-4 py-3 rounded-xl bg-[#12121a] border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 resize-none border-white/10 data-[invalid]:border-red-500/50 data-[invalid]:focus:ring-red-500/50"
      />
      <Field.Error className="text-red-400 text-sm">
        {field.state.meta.errors.join(", ")}
      </Field.Error>
    </Field.Root>
  );
}
