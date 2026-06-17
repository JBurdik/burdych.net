import { motion } from "framer-motion";

export function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wallpaper image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/wallpaper.png)" }}
      />
      {/* Darkening overlay for window contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Aurora glow — subtle, layered over the image */}
      <motion.div
        className="absolute -left-40 top-0 h-[42rem] w-[42rem] rounded-full bg-cyan-500/10 blur-[120px]"
        animate={{ x: [0, 120, 0], y: [0, 60, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-12rem] top-1/4 h-[38rem] w-[38rem] rounded-full bg-emerald-500/10 blur-[120px]"
        animate={{ x: [0, -100, 0], y: [0, 80, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
