import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { technologies } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Schema for technology input
const technologyInput = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  category: z.enum(["frontend", "backend", "tools", "other"]),
  proficiency: z.number().min(1).max(100),
});

// Get all technologies
export const getTechnologies = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await db.query.technologies.findMany({
      orderBy: (technologies, { desc }) => [desc(technologies.proficiency)],
    });
    return result;
  },
);

// Get single technology
export const getTechnology = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const result = await db.query.technologies.findFirst({
      where: eq(technologies.id, id),
    });
    return result;
  });

// Create technology
export const createTechnology = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof technologyInput>) =>
    technologyInput.parse(data),
  )
  .handler(async ({ data }) => {
    const [result] = await db
      .insert(technologies)
      .values({
        name: data.name,
        icon: data.icon,
        category: data.category,
        proficiency: data.proficiency,
      })
      .returning();
    return result;
  });

// Update technology
export const updateTechnology = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id: string } & z.infer<typeof technologyInput>) => data,
  )
  .handler(async ({ data }) => {
    const [result] = await db
      .update(technologies)
      .set({
        name: data.name,
        icon: data.icon,
        category: data.category,
        proficiency: data.proficiency,
        updatedAt: new Date(),
      })
      .where(eq(technologies.id, data.id))
      .returning();
    return result;
  });

// Delete technology
export const deleteTechnology = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(technologies).where(eq(technologies.id, id));
    return { success: true };
  });
