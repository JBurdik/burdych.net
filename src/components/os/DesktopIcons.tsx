import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useWM } from "./WindowManager";
import { AppIcon } from "./AppIcon";
import type { AppDef } from "./types";

// Grid geometry (desktop only). Positions are stored as col/row indices so
// they stay resolution-independent and survive viewport resizes.
const CELL_W = 88;
const CELL_H = 104;
const PAD_X = 16;
const PAD_TOP = 48; // clear the menu bar
const DOCK_RESERVE = 120; // keep bottom rows clear of the dock

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return vp;
}

function IconButton({ app }: { app: AppDef }) {
  return (
    <>
      <span
        className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${app.accent} shadow-lg shadow-black/40 ring-1 ring-white/20 transition group-hover:scale-105`}
      >
        <AppIcon app={app} className="h-6 w-6 text-white" />
      </span>
      <span className="rounded px-1 text-[11px] leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {app.title}
      </span>
    </>
  );
}

function GridIcon({
  app,
  left,
  top,
  index,
  draggable,
  open,
  onSnap,
}: {
  app: AppDef;
  left: number;
  top: number;
  index: number;
  draggable: boolean;
  open: (id: string) => void;
  onSnap: (appId: string, px: number, py: number) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);

  return (
    <motion.button
      drag={draggable}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={(_, info) => {
        onSnap(app.id, left + info.offset.x, top + info.offset.y);
        x.set(0);
        y.set(0);
        // Swallow the click that fires right after a drag.
        setTimeout(() => {
          dragged.current = false;
        }, 0);
      }}
      style={{
        position: "absolute",
        left,
        top,
        x,
        y,
        width: CELL_W,
        touchAction: draggable ? "none" : undefined,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      onDoubleClick={() => open(app.id)}
      onClick={(e) => {
        if (dragged.current) return;
        e.currentTarget.focus();
      }}
      className={`group pointer-events-auto flex flex-col items-center gap-1 rounded-lg p-2 text-center focus:bg-white/10 ${
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
    >
      <IconButton app={app} />
    </motion.button>
  );
}

export function DesktopIcons() {
  const { apps, open, isMobile, isAdmin, iconPos, moveIcon } = useWM();
  const vp = useViewport();
  const items = apps.filter((a) => a.onDesktop);

  // Mobile: keep the simple auto-flowing grid, no dragging.
  if (isMobile) {
    return (
      <div className="absolute inset-x-3 top-12 z-[5] grid grid-cols-4 gap-2 sm:grid-cols-5">
        {items.map((app, i) => (
          <motion.button
            key={app.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            onClick={(e) => {
              open(app.id);
              e.currentTarget.focus();
            }}
            className="group flex w-full flex-col items-center gap-1 rounded-lg p-2 text-center focus:bg-white/10"
          >
            <IconButton app={app} />
          </motion.button>
        ))}
      </div>
    );
  }

  const maxCols = Math.max(1, Math.floor((vp.w - PAD_X * 2) / CELL_W));
  const maxRows = Math.max(
    1,
    Math.floor((vp.h - PAD_TOP - DOCK_RESERVE) / CELL_H),
  );

  const handleSnap = (appId: string, px: number, py: number) => {
    const col = clamp(Math.round((px - PAD_X) / CELL_W), 0, maxCols - 1);
    const row = clamp(Math.round((py - PAD_TOP) / CELL_H), 0, maxRows - 1);
    moveIcon(appId, col, row);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {items.map((app, i) => {
        const stored = iconPos[app.id];
        // Default layout: fill the right-most column top-down, then spill left.
        const defCol = clamp(maxCols - 1 - Math.floor(i / maxRows), 0, maxCols - 1);
        const defRow = i % maxRows;
        const col = stored ? clamp(stored.col, 0, maxCols - 1) : defCol;
        const row = stored ? clamp(stored.row, 0, maxRows - 1) : defRow;
        return (
          <GridIcon
            key={app.id}
            app={app}
            index={i}
            left={PAD_X + col * CELL_W}
            top={PAD_TOP + row * CELL_H}
            draggable={isAdmin}
            open={open}
            onSnap={handleSnap}
          />
        );
      })}
    </div>
  );
}
