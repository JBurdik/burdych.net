import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppDef, WindowState } from "./types";
import { saveIconPosition } from "../../server/desktop-icons";

type IconPos = { col: number; row: number };

interface WMContext {
  apps: AppDef[];
  windows: WindowState[];
  isMobile: boolean;
  isAdmin: boolean;
  /** Persisted grid positions by appId. */
  iconPos: Record<string, IconPos>;
  /** Move an icon to a grid cell (admin only; persists to DB). */
  moveIcon: (appId: string, col: number, row: number) => void;
  open: (appId: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string, desktop: { w: number; h: number }) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  topZ: number;
  activeApp: string | null;
}

const Ctx = createContext<WMContext | null>(null);

export function useWM() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWM must be used inside <WindowManager>");
  return v;
}

let seq = 0;

export function WindowManager({
  apps,
  children,
  isAdmin = false,
  initialIconLayout = {},
}: {
  apps: AppDef[];
  children: ReactNode;
  isAdmin?: boolean;
  initialIconLayout?: Record<string, IconPos>;
}) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zRef = useRef(10);
  const [topZ, setTopZ] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [iconPos, setIconPos] = useState<Record<string, IconPos>>(
    initialIconLayout,
  );

  const moveIcon = useCallback(
    (appId: string, col: number, row: number) => {
      setIconPos((prev) => ({ ...prev, [appId]: { col, row } }));
      // Persist; server rejects non-admins via requireAuth.
      void saveIconPosition({ data: { appId, col, row } }).catch(() => {});
    },
    [],
  );

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.innerWidth < 768 ||
          window.matchMedia("(pointer: coarse)").matches,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const bumpZ = useCallback(() => {
    zRef.current += 1;
    setTopZ(zRef.current);
    return zRef.current;
  }, []);

  const open = useCallback(
    (appId: string) => {
      const app = apps.find((a) => a.id === appId);
      if (!app) return;
      if (app.action) {
        app.action();
        return;
      }
      setWindows((prev) => {
        const existing = prev.find((w) => w.appId === appId);
        const z = bumpZ();
        if (existing) {
          return prev.map((w) =>
            w.id === existing.id ? { ...w, minimized: false, z } : w,
          );
        }
        const size = app.defaultSize ?? { w: 720, h: 520 };
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const offset = (prev.length % 6) * 28;
        const x = Math.max(
          16,
          Math.round((vw - size.w) / 2) + offset - 80,
        );
        const y = Math.max(
          44,
          Math.round((vh - size.h) / 2) + offset - 40,
        );
        seq += 1;
        return [
          ...prev,
          {
            id: `win-${seq}`,
            appId,
            x,
            y,
            w: size.w,
            h: size.h,
            z,
            minimized: false,
            maximized: false,
          },
        ];
      });
    },
    [apps, bumpZ],
  );

  const close = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focus = useCallback(
    (id: string) => {
      const z = bumpZ();
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)),
      );
    },
    [bumpZ],
  );

  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    );
  }, []);

  const toggleMaximize = useCallback(
    (id: string, desktop: { w: number; h: number }) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          if (w.maximized && w.prev) {
            return { ...w, maximized: false, ...w.prev, prev: undefined };
          }
          return {
            ...w,
            maximized: true,
            prev: { x: w.x, y: w.y, w: w.w, h: w.h },
            x: 8,
            y: 40,
            w: desktop.w - 16,
            h: desktop.h - 48 - 96,
          };
        }),
      );
    },
    [],
  );

  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w)),
    );
  }, []);

  const resize = useCallback((id: string, w: number, h: number) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id
          ? { ...win, w: Math.max(320, w), h: Math.max(240, h) }
          : win,
      ),
    );
  }, []);

  const activeApp = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (!visible.length) return null;
    const top = visible.reduce((a, b) => (a.z > b.z ? a : b));
    return top.appId;
  }, [windows]);

  const value = useMemo<WMContext>(
    () => ({
      apps,
      windows,
      isMobile,
      isAdmin,
      iconPos,
      moveIcon,
      open,
      close,
      focus,
      toggleMinimize,
      toggleMaximize,
      move,
      resize,
      topZ,
      activeApp,
    }),
    [
      apps,
      windows,
      isMobile,
      isAdmin,
      iconPos,
      moveIcon,
      open,
      close,
      focus,
      toggleMinimize,
      toggleMaximize,
      move,
      resize,
      topZ,
      activeApp,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
