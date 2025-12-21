import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { experiences } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Schema for experience input
const experienceInput = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  logo: z.string().nullable().optional(),
});

// Get all experiences
export const getExperiences = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await db.query.experiences.findMany({
      orderBy: (experiences, { desc }) => [desc(experiences.createdAt)],
    });
    return result;
  },
);

// Get single experience
export const getExperience = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const result = await db.query.experiences.findFirst({
      where: eq(experiences.id, id),
    });
    return result;
  });

// Create experience
export const createExperience = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof experienceInput>) =>
    experienceInput.parse(data),
  )
  .handler(async ({ data }) => {
    const [result] = await db
      .insert(experiences)
      .values({
        company: data.company,
        role: data.role,
        period: data.period,
        description: data.description,
        technologies: data.technologies,
        logo: data.logo,
      })
      .returning();
    return result;
  });

// Update experience
export const updateExperience = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id: string } & z.infer<typeof experienceInput>) => data,
  )
  .handler(async ({ data }) => {
    const [result] = await db
      .update(experiences)
      .set({
        company: data.company,
        role: data.role,
        period: data.period,
        description: data.description,
        technologies: data.technologies,
        logo: data.logo,
        updatedAt: new Date(),
      })
      .where(eq(experiences.id, data.id))
      .returning();
    return result;
  });

// Delete experience
export const deleteExperience = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(experiences).where(eq(experiences.id, id));
    return { success: true };
  });
