import { useEffect, useRef } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { X } from "lucide-react";
import { useWM } from "./WindowManager";
import type { AppDef, WindowState } from "./types";
import { AppIcon } from "./AppIcon";

export function Window({
  win,
  app,
  desktop,
}: {
  win: WindowState;
  app: AppDef;
  desktop: { w: number; h: number };
}) {
  const { close, focus, toggleMinimize, toggleMaximize, move, resize, isMobile } =
    useWM();
  const controls = useDragControls();

  // Position lives in motion values; left/top stay at 0 so framer's drag
  // transform is the single source of truth (avoids double-offset snapping).
  const x = useMotionValue(win.x);
  const y = useMotionValue(win.y);
  const dragging = useRef(false);

  // Sync external position changes (open/maximize/restore) into motion values,
  // but never while the user is actively dragging.
  useEffect(() => {
    if (!dragging.current) {
      x.set(win.x);
      y.set(win.y);
    }
  }, [win.x, win.y, x, y]);

  const resizing = useRef<{
    startX: number;
    startY: number;
    w: number;
    h: number;
  } | null>(null);

  const onResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    resizing.current = { startX: e.clientX, startY: e.clientY, w: win.w, h: win.h };
  };
  const onResizePointerMove = (e: React.PointerEvent) => {
    if (!resizing.current) return;
    const dx = e.clientX - resizing.current.startX;
    const dy = e.clientY - resizing.current.startY;
    resize(win.id, resizing.current.w + dx, resizing.current.h + dy);
  };
  const onResizePointerUp = (e: React.PointerEvent) => {
    resizing.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  if (isMobile) {
    // Full-screen sheet: no drag, no resize, slides up from the bottom.
    return (
      <motion.div
        onPointerDownCapture={() => focus(win.id)}
        initial={{ opacity: 0, y: "100%" }}
        animate={{
          opacity: win.minimized ? 0 : 1,
          y: win.minimized ? "100%" : 0,
          pointerEvents: win.minimized ? "none" : "auto",
        }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 36,
          bottom: 0,
          zIndex: win.z,
          pointerEvents: "auto",
        }}
        className="flex flex-col overflow-hidden border-t border-white/15 bg-[#0e0e16]/95 backdrop-blur-2xl"
      >
        <div className="relative flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 select-none">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <AppIcon app={app} className="h-4 w-4" />
            {app.title}
          </div>
          <button
            onClick={() => close(win.id)}
            aria-label="Zavřít"
            className="rounded-full bg-white/10 p-1.5 text-white/70 active:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative flex-1 overflow-auto os-scroll pb-20">
          {app.render?.()}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0}
      onPointerDownCapture={() => focus(win.id)}
      onDragStart={() => {
        dragging.current = true;
      }}
      onDragEnd={() => {
        dragging.current = false;
        const nx = Math.max(-win.w + 120, x.get());
        const ny = Math.max(36, y.get());
        x.set(nx);
        y.set(ny);
        move(win.id, nx, ny);
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.4 : 1,
        pointerEvents: win.minimized ? "none" : "auto",
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        opacity: { duration: 0.18 },
        scale: { type: "spring", stiffness: 380, damping: 32 },
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x,
        y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        pointerEvents: "auto",
      }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e16]/80 shadow-2xl shadow-black/60 backdrop-blur-2xl"
    >
      {/* Title bar */}
      <div
        onPointerDown={(e) => {
          focus(win.id);
          controls.start(e);
        }}
        onDoubleClick={() => toggleMaximize(win.id, desktop)}
        className="relative flex h-10 shrink-0 cursor-grab items-center gap-2 border-b border-white/10 bg-white/5 px-4 active:cursor-grabbing select-none"
      >
        {/* Traffic lights */}
        <div className="group flex items-center gap-2">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => close(win.id)}
            aria-label="Zavřít"
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#ff5f57] text-[8px] text-black/60 transition hover:brightness-110"
          >
            <span className="opacity-0 group-hover:opacity-100">✕</span>
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMinimize(win.id)}
            aria-label="Minimalizovat"
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#febc2e] text-[8px] text-black/60 transition hover:brightness-110"
          >
            <span className="opacity-0 group-hover:opacity-100">–</span>
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximize(win.id, desktop)}
            aria-label="Maximalizovat"
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#28c840] text-[8px] text-black/60 transition hover:brightness-110"
          >
            <span className="opacity-0 group-hover:opacity-100">+</span>
          </button>
        </div>

        <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs font-medium text-white/70">
          <AppIcon app={app} className="h-3.5 w-3.5" />
          {app.title}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-auto os-scroll">
        {app.render?.()}
      </div>

      {/* Resize handle */}
      <div
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
      />
    </motion.div>
  );
}
