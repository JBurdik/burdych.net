import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  User,
  FolderGit2,
  Briefcase,
  Cpu,
  Mail,
  TerminalSquare,
  FileText,
  Settings,
  FileCode,
  Globe,
  BookOpen,
  Code,
  Layers,
  Zap,
  Star,
  Heart,
  Music,
  Camera,
  Coffee,
  Gamepad2,
} from "lucide-react";
import { WindowManager, useWM } from "./WindowManager";
import { Wallpaper } from "./Wallpaper";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { DesktopIcons } from "./DesktopIcons";
import { BootScreen } from "./BootScreen";
import { Window } from "./Window";
import {
  AboutApp,
  ContactApp,
  ExperienceApp,
  ProjectsApp,
  TechnologiesApp,
  TerminalApp,
  MiniAppWindow,
  type AboutWithSocials,
  type ProjectWithImages,
} from "./Apps";
import type { Experience, Technology, MiniApp, AppLink } from "../../db/schema";
import type { AppDef } from "./types";

const MINI_APP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileCode,
  Globe,
  BookOpen,
  Code,
  Layers,
  Zap,
  Star,
  Heart,
  Music,
  Camera,
  Coffee,
  Gamepad: Gamepad2,
};

interface DesktopData {
  projects: ProjectWithImages[];
  experiences: Experience[];
  technologies: Technology[];
  about: AboutWithSocials | null;
  miniApps: MiniApp[];
  appLinks: AppLink[];
  iconLayout: Record<string, { col: number; row: number }>;
  isAdmin: boolean;
}

function useDesktopSize() {
  const [size, setSize] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function Surface() {
  const { windows, apps } = useWM();
  const desktop = useDesktopSize();

  return (
    <>
      <DesktopIcons />
      <div className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence>
          {windows.map((win) => {
            const app = apps.find((a) => a.id === win.appId);
            if (!app) return null;
            return (
              <Window key={win.id} win={win} app={app} desktop={desktop} />
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}

export function Desktop(data: DesktopData) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1900);
    return () => clearTimeout(t);
  }, []);

  const apps = useMemo<AppDef[]>(() => {
    const about = data.about;
    const list: AppDef[] = [
      {
        id: "about",
        title: "O mně",
        icon: User,
        accent: "from-cyan-500 to-blue-500",
        defaultSize: { w: 640, h: 560 },
        onDesktop: true,
        render: about ? () => <AboutApp about={about} /> : () => null,
      },
      {
        id: "projects",
        title: "Projekty",
        icon: FolderGit2,
        accent: "from-violet-500 to-fuchsia-500",
        defaultSize: { w: 760, h: 600 },
        onDesktop: true,
        render: () => <ProjectsApp projects={data.projects} />,
      },
      {
        id: "experience",
        title: "Zkušenosti",
        icon: Briefcase,
        accent: "from-amber-500 to-orange-500",
        defaultSize: { w: 680, h: 580 },
        onDesktop: true,
        render: () => <ExperienceApp experiences={data.experiences} />,
      },
      {
        id: "tech",
        title: "Technologie",
        icon: Cpu,
        accent: "from-emerald-500 to-teal-500",
        defaultSize: { w: 680, h: 560 },
        onDesktop: true,
        render: () => <TechnologiesApp technologies={data.technologies} />,
      },
      {
        id: "contact",
        title: "Kontakt",
        icon: Mail,
        accent: "from-pink-500 to-rose-500",
        defaultSize: { w: 480, h: 520 },
        onDesktop: true,
        render: about ? () => <ContactApp about={about} /> : () => null,
      },
      {
        id: "terminal",
        title: "Terminál",
        icon: TerminalSquare,
        accent: "from-slate-600 to-slate-800",
        defaultSize: { w: 600, h: 420 },
        render: about ? () => <TerminalApp about={about} /> : () => null,
      },
    ];
    for (const ma of data.miniApps) {
      if (!ma.published) continue;
      const Icon = MINI_APP_ICONS[ma.iconName] ?? FileCode;
      list.push({
        id: `mini-app-${ma.id}`,
        title: ma.title,
        icon: Icon,
        iconUrl: ma.iconUrl ?? undefined,
        accent: ma.accent,
        defaultSize: { w: 900, h: 680 },
        onDesktop: ma.onDesktop ?? true,
        inDock: ma.inDock ?? false,
        render: () => <MiniAppWindow s3Key={ma.s3Key} />,
      });
    }
    for (const link of data.appLinks) {
      if (!link.published) continue;
      const Icon = MINI_APP_ICONS[link.iconName] ?? Globe;
      list.push({
        id: `app-link-${link.id}`,
        title: link.title,
        icon: Icon,
        iconUrl: link.iconUrl ?? undefined,
        accent: link.accent,
        onDesktop: link.onDesktop ?? true,
        inDock: link.inDock ?? false,
        action: () => window.open(link.url, "_blank"),
      });
    }
    if (data.isAdmin) {
      list.push({
        id: "admin",
        title: "Admin",
        icon: Settings,
        accent: "from-slate-500 to-zinc-600",
        action: () => {
          window.location.href = "/admin";
        },
      });
    }
    if (about?.cvUrl) {
      list.push({
        id: "cv",
        title: "CV.pdf",
        icon: FileText,
        accent: "from-red-500 to-rose-600",
        inDock: false,
        onDesktop: true,
        action: () => window.open(about.cvUrl!, "_blank"),
      });
    }
    return list;
  }, [data]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05060a] text-white">
      <Wallpaper />

      <AnimatePresence>{!booted && <BootScreen />}</AnimatePresence>

      <WindowManager
        apps={apps}
        isAdmin={data.isAdmin}
        initialIconLayout={data.iconLayout}
      >
        <MenuBar />
        <Surface />
        <Dock />
      </WindowManager>
    </div>
  );
}
