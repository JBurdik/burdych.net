import type { ReactNode } from "react";

export interface AppDef {
  id: string;
  title: string;
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind gradient classes for the dock/icon tile, e.g. "from-cyan-500 to-teal-500" */
  accent: string;
  /** Optional custom image URL — overrides the icon component when set */
  iconUrl?: string;
  /** Default window size */
  defaultSize?: { w: number; h: number };
  /** Whether to show on the desktop as an icon */
  onDesktop?: boolean;
  /** Whether to show in the dock */
  inDock?: boolean;
  /** Render the window content. Returns null for apps that act as links/actions. */
  render?: () => ReactNode;
  /** If set, clicking the icon runs this instead of opening a window */
  action?: () => void;
}

export interface WindowState {
  id: string;
  appId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Saved rect to restore from maximize */
  prev?: { x: number; y: number; w: number; h: number };
}
