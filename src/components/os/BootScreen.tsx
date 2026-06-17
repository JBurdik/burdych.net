import { motion } from "framer-motion";

export function BootScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-[#05060a]"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid h-24 w-24 place-items-center rounded-[1.6rem] bg-gradient-to-br from-cyan-400 to-emerald-500 text-3xl font-black text-black shadow-2xl shadow-cyan-500/30"
      >
        JB
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-sm tracking-[0.3em] text-white/50"
      >
        burdychOS
      </motion.p>
      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-500"
        />
      </div>
    </motion.div>
  );
}
