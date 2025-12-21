import { useFieldContext } from "../../../lib/form-context";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useState, KeyboardEvent } from "react";

interface TagInputFieldProps {
  label: string;
  placeholder?: string;
  suggestions?: string[];
}

export function TagInputField({
  label,
  placeholder = "Přidejte tag...",
  suggestions = [],
}: TagInputFieldProps) {
  const field = useFieldContext<string[]>();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const hasErrors = field.state.meta.errors.length > 0;

  const tags = field.state.value || [];

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      field.handleChange([...tags, trimmedTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    field.handleChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s),
  );

  return (
    <Field.Root name={field.name} invalid={hasErrors} className="space-y-2">
      <Field.Label className="block text-sm font-medium text-gray-300">
        {label}
      </Field.Label>

      <div
        className={`min-h-[48px] px-3 py-2 rounded-xl bg-[#12121a] border transition-all duration-200 ${
          hasErrors
            ? "border-red-500/50"
            : "border-white/10 focus-within:ring-2 focus-within:ring-cyan-500/50"
        }`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tags */}
          <AnimatePresence mode="popLayout">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm"
              >
                {tag}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeTag(tag)}
                  className="p-0.5 rounded hover:bg-cyan-500/30 transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </motion.span>
            ))}
          </AnimatePresence>

          {/* Input */}
          <div className="relative flex-1 min-w-[120px]">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={tags.length === 0 ? placeholder : ""}
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none py-1 border-none"
            />

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a24] border border-white/10 shadow-xl z-10 max-h-40 overflow-y-auto"
                >
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addTag(suggestion)}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3 text-cyan-400" />
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Field.Error className="text-red-400 text-sm">
        {field.state.meta.errors.join(", ")}
      </Field.Error>
    </Field.Root>
  );
}
