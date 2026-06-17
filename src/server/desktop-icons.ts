import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db";
import { desktopIcons } from "../db/schema";
import { requireAuth } from "../lib/auth-middleware";

/** Returns the saved grid layout as { [appId]: { col, row } }. */
export const getIconLayout = createServerFn({ method: "GET" }).handler(
  async () => {
    const rows = await db.select().from(desktopIcons);
    const layout: Record<string, { col: number; row: number }> = {};
    for (const r of rows) layout[r.appId] = { col: r.col, row: r.row };
    return layout;
  },
);

const positionSchema = z.object({
  appId: z.string().min(1),
  col: z.number().int().min(0),
  row: z.number().int().min(0),
});

/** Upserts one icon position. Admin only. */
export const saveIconPosition = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => positionSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAuth();
    await db
      .insert(desktopIcons)
      .values({ ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: desktopIcons.appId,
        set: { col: data.col, row: data.row, updatedAt: new Date() },
      });
    return { success: true };
  });
