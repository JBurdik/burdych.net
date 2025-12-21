import { useFieldContext } from "../../../lib/form-context";

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

      {/* Custom slider using native range input with custom styling */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => field.handleChange(Number(e.target.value))}
          onBlur={field.handleBlur}
          className="slider-input w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10"
          style={{
            background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(20, 184, 166) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%)`,
          }}
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

      {field.state.meta.errors.length > 0 && (
        <p className="text-red-400 text-sm">
          {field.state.meta.errors.join(", ")}
        </p>
      )}

      <style>{`
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: grab;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
          transition: box-shadow 0.2s;
        }

        .slider-input::-webkit-slider-thumb:hover {
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
        }

        .slider-input::-webkit-slider-thumb:active {
          cursor: grabbing;
        }

        .slider-input::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: grab;
          border: none;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .slider-input::-moz-range-thumb:hover {
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
        }

        .slider-input:focus {
          outline: none;
        }

        .slider-input:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.3), 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
