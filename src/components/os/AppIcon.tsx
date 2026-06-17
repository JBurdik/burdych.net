import type { AppDef } from "./types";

export function AppIcon({
  app,
  className,
}: {
  app: AppDef;
  className?: string;
}) {
  if (app.iconUrl) {
    const sizeClass = className?.match(/h-\S+/)?.[0] ?? "h-6";
    const wClass = className?.match(/w-\S+/)?.[0] ?? "w-6";
    return (
      <img
        src={app.iconUrl}
        alt=""
        className={`${sizeClass} ${wClass} rounded-lg object-cover`}
      />
    );
  }
  const Icon = app.icon;
  return <Icon className={className} />;
}
