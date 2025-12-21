import { useFieldContext } from "../../../lib/form-context";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "url" | "password" | "tel";
}

export function TextField({
  label,
  placeholder,
  type = "text",
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Field.Root name={field.name} invalid={hasErrors} className="space-y-2">
      <Field.Label className="block text-sm font-medium text-gray-300">
        {label}
      </Field.Label>
      <Input
        type={type}
        value={field.state.value || ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-[#12121a] border text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200 border-white/10 data-[invalid]:border-red-500/50 data-[invalid]:focus:ring-red-500/50"
      />
      <Field.Error className="text-red-400 text-sm">
        {field.state.meta.errors.join(", ")}
      </Field.Error>
    </Field.Root>
  );
}
