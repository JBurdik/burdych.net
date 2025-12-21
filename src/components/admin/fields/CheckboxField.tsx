import { useFieldContext } from "../../../lib/form-context";
import { Field } from "@base-ui/react/field";
import { Checkbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";

interface CheckboxFieldProps {
  label: string;
  description?: string;
}

export function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <Field.Root name={field.name} className="space-y-2">
      <Field.Label className="flex items-start gap-3 cursor-pointer group">
        <Checkbox.Root
          checked={field.state.value || false}
          onCheckedChange={(checked) => field.handleChange(checked as boolean)}
          onBlur={field.handleBlur}
          className="relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 border-white/20 group-hover:border-cyan-500/50 data-[checked]:bg-gradient-to-r data-[checked]:from-cyan-500 data-[checked]:to-teal-500 data-[checked]:border-cyan-500"
        >
          <Checkbox.Indicator className="text-white">
            <Check className="w-4 h-4" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <div className="flex-1">
          <span className="text-white font-medium">{label}</span>
          {description && (
            <Field.Description className="text-gray-500 text-sm mt-0.5">
              {description}
            </Field.Description>
          )}
        </div>
      </Field.Label>
      <Field.Error className="text-red-400 text-sm">
        {field.state.meta.errors.join(", ")}
      </Field.Error>
    </Field.Root>
  );
}
