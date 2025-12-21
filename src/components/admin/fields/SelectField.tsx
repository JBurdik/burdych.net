import { useFieldContext } from "../../../lib/form-context";
import { Field } from "@base-ui/react/field";
import { Select } from "@base-ui/react/select";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: Option[];
  placeholder?: string;
}

export function SelectField({ label, options, placeholder }: SelectFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;
  const selectedOption = options.find((o) => o.value === field.state.value);

  return (
    <Field.Root name={field.name} invalid={hasErrors} className="space-y-2">
      <Field.Label className="block text-sm font-medium text-gray-300">
        {label}
      </Field.Label>
      <Select.Root
        value={field.state.value || ""}
        onValueChange={(value) => value && field.handleChange(value)}
      >
        <Select.Trigger
          className="flex w-full items-center justify-between px-4 py-3 rounded-xl bg-[#12121a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all cursor-pointer data-[invalid]:border-red-500/50 data-[popup-open]:ring-2 data-[popup-open]:ring-cyan-500/50"
          onBlur={field.handleBlur}
        >
          <Select.Value
            className={selectedOption ? "text-white" : "text-gray-500"}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Select.Value>
          <Select.Icon className="text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={4} className="z-50">
            <Select.Popup className="rounded-xl bg-[#12121a] border border-white/10 shadow-xl shadow-black/50 py-1 min-w-[var(--anchor-width)]">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-white cursor-pointer transition-colors data-[highlighted]:bg-cyan-500/10 data-[highlighted]:text-cyan-400"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="text-cyan-400">
                    <Check className="w-4 h-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <Field.Error className="text-red-400 text-sm">
        {field.state.meta.errors.join(", ")}
      </Field.Error>
    </Field.Root>
  );
}
