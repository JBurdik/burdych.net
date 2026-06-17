import { useEffect, useState } from "react";
import { Wifi, BatteryFull, Search, Volume2 } from "lucide-react";
import { useWM } from "./WindowManager";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);
  return now;
}

const DAYS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];

export function MenuBar() {
  const { apps, activeApp } = useWM();
  const now = useClock();
  const app = apps.find((a) => a.id === activeApp);

  const time = now
    ? `${DAYS[now.getDay()]} ${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "";

  return (
    <div className="fixed inset-x-0 top-0 z-[1000] flex h-9 items-center justify-between border-b border-white/10 bg-black/30 px-4 text-[13px] text-white/90 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-emerald-500 text-[10px] font-black text-black">
          JB
        </span>
        <span className="font-semibold">{app ? app.title : "burdych.net"}</span>
        <span className="hidden text-white/50 sm:inline">Soubor</span>
        <span className="hidden text-white/50 sm:inline">Zobrazení</span>
        <span className="hidden text-white/50 md:inline">Nápověda</span>
      </div>
      <div className="flex items-center gap-3.5 text-white/80">
        <Volume2 className="hidden h-4 w-4 sm:block" />
        <Wifi className="h-4 w-4" />
        <BatteryFull className="h-4 w-4" />
        <Search className="hidden h-4 w-4 sm:block" />
        <span className="tabular-nums">{time}</span>
      </div>
    </div>
  );
}
