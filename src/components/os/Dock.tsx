import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useWM } from "./WindowManager";
import type { AppDef } from "./types";
import { AppIcon } from "./AppIcon";

function DockItem({
  app,
  mouseX,
  running,
  onClick,
}: {
  app: AppDef;
  mouseX: MotionValue<number>;
  running: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-140, 0, 140], [44, 72, 44]);
  const size = useSpring(sizeSync, { stiffness: 350, damping: 22, mass: 0.4 });

  return (
    <div className="group flex flex-col items-center">
      <motion.button
        ref={ref}
        onClick={onClick}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.85 }}
        className={`grid place-items-center rounded-2xl bg-gradient-to-br ${app.accent} shadow-lg shadow-black/40 ring-1 ring-white/20`}
        aria-label={app.title}
      >
        <AppIcon app={app} className="h-1/2 w-1/2 text-white drop-shadow" />
      </motion.button>
      <span className="mt-1 max-w-[4.5rem] truncate text-[10px] leading-tight text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {app.title}
      </span>
      <span
        className={`mt-0.5 h-1 w-1 rounded-full bg-white transition-opacity ${
          running ? "opacity-80" : "opacity-0"
        }`}
      />
    </div>
  );
}

export function Dock() {
  const { apps, windows, open } = useWM();
  const mouseX = useMotionValue(Infinity);
  const dockApps = apps.filter((a) => a.inDock !== false);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[900] flex justify-center px-2 sm:bottom-3 sm:px-3">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex max-w-full items-end gap-2 overflow-x-auto rounded-2xl border border-white/15 bg-white/10 px-3 pb-2 pt-2.5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:gap-3 sm:rounded-3xl sm:px-4 sm:pt-3"
      >
        {dockApps.map((app) => (
          <DockItem
            key={app.id}
            app={app}
            mouseX={mouseX}
            running={windows.some((w) => w.appId === app.id)}
            onClick={() => open(app.id)}
          />
        ))}
      </motion.div>
    </div>
  );
}
