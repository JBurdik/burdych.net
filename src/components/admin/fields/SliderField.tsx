import { useFieldContext } from "../../../lib/form-context";

// TODO: Switch to Base UI Slider component once the issue with onValueChange
// resetting the value is resolved. Currently using native range input as a workaround.
// See: @base-ui/react/slider

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
  const value = field.state.value ?? min;
  const percentage = ((value - min) / (max - min)) * 100;

  // Get error messages as strings
  const errors = field.state.meta.errors;
  const errorMessages = errors
    .map((err) => (typeof err === "string" ? err : err?.message || ""))
    .filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        {showValue && (
          <span className="text-cyan-400 font-mono text-sm">
            {value}
            {suffix}
          </span>
        )}
      </div>

      <div className="relative h-5 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => field.handleChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 appearance-none bg-transparent cursor-pointer z-10
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:shadow-cyan-500/30
                     [&::-webkit-slider-thumb]:cursor-grab
                     [&::-webkit-slider-thumb]:active:cursor-grabbing
                     [&::-webkit-slider-thumb]:hover:shadow-cyan-500/50
                     [&::-webkit-slider-thumb]:transition-shadow
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:shadow-lg
                     [&::-moz-range-thumb]:shadow-cyan-500/30
                     [&::-moz-range-thumb]:cursor-grab
                     [&::-moz-range-thumb]:active:cursor-grabbing
                     [&::-webkit-slider-runnable-track]:h-2
                     [&::-webkit-slider-runnable-track]:rounded-full
                     [&::-webkit-slider-runnable-track]:bg-transparent
                     [&::-moz-range-track]:h-2
                     [&::-moz-range-track]:rounded-full
                     [&::-moz-range-track]:bg-transparent"
        />
        {/* Track background */}
        <div className="absolute h-2 w-full rounded-full bg-white/10" />
        {/* Track fill */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>

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

      {errorMessages.length > 0 && (
        <p className="text-red-400 text-sm">{errorMessages.join(", ")}</p>
      )}
    </div>
  );
}
