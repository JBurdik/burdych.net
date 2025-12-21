import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { about, socials } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Schema for about input
const aboutInput = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  avatar: z.string().nullable().optional(),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  cvUrl: z.string().nullable().optional(),
});

// Schema for social input
const socialInput = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  icon: z.string().min(1),
});

// Get about with socials
export const getAbout = createServerFn({ method: "GET" }).handler(async () => {
  const aboutRecord = await db.query.about.findFirst();
  if (!aboutRecord) return null;

  const socialRecords = await db.query.socials.findMany({
    where: eq(socials.aboutId, aboutRecord.id),
  });

  return {
    ...aboutRecord,
    socials: socialRecords,
  };
});

// Update about
export const updateAbout = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & z.infer<typeof aboutInput>) => data)
  .handler(async ({ data }) => {
    const [result] = await db
      .update(about)
      .set({
        name: data.name,
        title: data.title,
        bio: data.bio,
        avatar: data.avatar,
        location: data.location,
        email: data.email,
        phone: data.phone,
        cvUrl: data.cvUrl,
        updatedAt: new Date(),
      })
      .where(eq(about.id, data.id))
      .returning();
    return result;
  });

// Add social link
export const addSocial = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { aboutId: string } & z.infer<typeof socialInput>) => data,
  )
  .handler(async ({ data }) => {
    const [result] = await db
      .insert(socials)
      .values({
        aboutId: data.aboutId,
        name: data.name,
        url: data.url,
        icon: data.icon,
      })
      .returning();
    return result;
  });

// Delete social link
export const deleteSocial = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(socials).where(eq(socials.id, id));
    return { success: true };
  });
