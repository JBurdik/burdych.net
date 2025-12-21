import { useFormContext } from "@/lib/form-context";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface SubmitButtonProps {
  children: ReactNode;
  className?: string;
}

export function SubmitButton({ children, className = "" }: SubmitButtonProps) {
  const form = useFormContext();
  const isSubmitting = form.state.isSubmitting;
  const canSubmit = form.state.canSubmit;

  return (
    <motion.button
      type="submit"
      disabled={isSubmitting || !canSubmit}
      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 overflow-hidden ${
        isSubmitting || !canSubmit
          ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:shadow-lg hover:shadow-cyan-500/25"
      } ${className}`}
    >
      {/* Shimmer effect */}
      {!isSubmitting && canSubmit && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Ukládám...
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
