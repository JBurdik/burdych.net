import { useFieldContext } from "../../../lib/form-context";
import { Field } from "@base-ui/react/field";
import { Slider } from "@base-ui/react/slider";

interface SliderFieldProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  suffix?: string;
}

export function SliderField({
  label,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  suffix = "%",
}: SliderFieldProps) {
  const field = useFieldContext<number>();
  const value = field.state.value || min;

  return (
    <Field.Root name={field.name} className="space-y-3">
      <div className="flex items-center justify-between">
        <Field.Label className="block text-sm font-medium text-gray-300">
          {label}
        </Field.Label>
        {showValue && (
          <span className="text-cyan-400 font-mono text-sm">
            {value}
            {suffix}
          </span>
        )}
      </div>

      <Slider.Root
        value={[value]}
        onValueChange={(values: number[]) => field.handleChange(values[0])}
        onValueCommitted={(values: number[]) => field.handleChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="relative flex items-center w-full h-5 touch-none"
      >
        <Slider.Control className="flex items-center w-full">
          <Slider.Track className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <Slider.Indicator className="absolute h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
            <Slider.Thumb className="block w-5 h-5 rounded-full bg-white shadow-lg shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-shadow hover:shadow-cyan-500/50 cursor-grab active:cursor-grabbing" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      {/* Min/Max labels */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>

      <Field.Error className="text-red-400 text-sm">
        {field.state.meta.errors.join(", ")}
      </Field.Error>
    </Field.Root>
  );
}
