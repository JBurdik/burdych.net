import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { db } from "../db";
import { appLinks } from "../db/schema";

export const getAppLinks = createServerFn({ method: "GET" }).handler(
  async () =>
    db.select().from(appLinks).orderBy(asc(appLinks.order), asc(appLinks.createdAt)),
);

export const createAppLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        title: z.string().min(1),
        url: z.string().url(),
        iconName: z.string().default("Globe"),
        iconUrl: z.string().nullable().optional(),
        accent: z.string().default("from-cyan-500 to-blue-500"),
        onDesktop: z.boolean().default(true),
        inDock: z.boolean().default(false),
        order: z.number().default(0),
        published: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const [created] = await db.insert(appLinks).values(data).returning();
    return created;
  });

export const updateAppLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        url: z.string().url().optional(),
        iconName: z.string().optional(),
        iconUrl: z.string().nullable().optional(),
        accent: z.string().optional(),
        onDesktop: z.boolean().optional(),
        inDock: z.boolean().optional(),
        order: z.number().optional(),
        published: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data: { id, ...rest } }) => {
    const [updated] = await db
      .update(appLinks)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(appLinks.id, id))
      .returning();
    return updated;
  });

export const deleteAppLink = createServerFn({ method: "POST" })
  .inputValidator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id }) => {
    await db.delete(appLinks).where(eq(appLinks.id, id));
    return { success: true };
  });
