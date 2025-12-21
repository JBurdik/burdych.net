import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Schema for project input
const projectInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  technologies: z.array(z.string()),
  liveUrl: z.string().nullable().optional().or(z.literal("")),
  githubUrl: z.string().nullable().optional().or(z.literal("")),
  featured: z.boolean(),
});

// Get all projects
export const getProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await db.query.projects.findMany({
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });
    return result;
  },
);

// Get single project
export const getProject = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const result = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
    return result;
  });

// Create project
export const createProject = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof projectInput>) =>
    projectInput.parse(data),
  )
  .handler(async ({ data }) => {
    const [result] = await db
      .insert(projects)
      .values({
        title: data.title,
        description: data.description,
        image: data.image || "/projects/placeholder.jpg",
        technologies: data.technologies,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        featured: data.featured,
      })
      .returning();
    return result;
  });

// Update project
export const updateProject = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & z.infer<typeof projectInput>) => data)
  .handler(async ({ data }) => {
    const [result] = await db
      .update(projects)
      .set({
        title: data.title,
        description: data.description,
        image: data.image || "/projects/placeholder.jpg",
        technologies: data.technologies,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        featured: data.featured,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, data.id))
      .returning();
    return result;
  });

// Delete project
export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true };
  });
