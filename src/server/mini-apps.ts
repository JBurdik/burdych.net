import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { miniApps } from "../db/schema";
import { getS3Client, MINIO_BUCKET } from "../lib/minio";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getMiniApps = createServerFn({ method: "GET" }).handler(
  async () => {
    return db
      .select()
      .from(miniApps)
      .orderBy(asc(miniApps.order), asc(miniApps.createdAt));
  },
);

export const getMiniApp = createServerFn({ method: "GET" })
  .inputValidator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id }) => {
    const [app] = await db.select().from(miniApps).where(eq(miniApps.id, id));
    return app ?? null;
  });

export const createMiniApp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        title: z.string().min(1),
        iconName: z.string().default("FileCode"),
        accent: z.string().default("from-indigo-500 to-purple-500"),
        iconUrl: z.string().nullable().optional(),
        s3Key: z.string().min(1),
        onDesktop: z.boolean().default(true),
        inDock: z.boolean().default(false),
        order: z.number().default(0),
        published: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const [created] = await db.insert(miniApps).values(data).returning();
    return created;
  });

export const updateMiniApp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        iconName: z.string().optional(),
        accent: z.string().optional(),
        iconUrl: z.string().nullable().optional(),
        s3Key: z.string().optional(),
        onDesktop: z.boolean().optional(),
        inDock: z.boolean().optional(),
        order: z.number().optional(),
        published: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data: { id, ...rest } }) => {
    const [updated] = await db
      .update(miniApps)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(miniApps.id, id))
      .returning();
    return updated;
  });

export const deleteMiniApp = createServerFn({ method: "POST" })
  .inputValidator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id }) => {
    await db.delete(miniApps).where(eq(miniApps.id, id));
    return { success: true };
  });

export const getMiniAppHtml = createServerFn({ method: "GET" })
  .inputValidator((s3Key: string) => z.string().min(1).parse(s3Key))
  .handler(async ({ data: s3Key }) => {
    const s3 = getS3Client();
    const cmd = new GetObjectCommand({ Bucket: MINIO_BUCKET, Key: s3Key });
    const res = await s3.send(cmd);
    const html = await res.Body!.transformToString("utf-8");
    return { html };
  });
