import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Název je povinný"),
  description: z.string().min(10, "Popis musí mít alespoň 10 znaků"),
  image: z.string().optional(),
  images: z.array(z.string()).default([]),
  technologies: z.array(z.string()).min(1, "Vyberte alespoň jednu technologii"),
  liveUrl: z.string().url("Neplatná URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Neplatná URL").optional().or(z.literal("")),
  featured: z.boolean(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Firma je povinná"),
  role: z.string().min(1, "Role je povinná"),
  period: z.string().min(1, "Období je povinné"),
  description: z.string().min(10, "Popis musí mít alespoň 10 znaků"),
  technologies: z.array(z.string()),
  logo: z.string().optional(),
});

export const technologySchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  icon: z.string().min(1, "Ikona je povinná"),
  category: z.enum(["frontend", "backend", "tools", "other"]),
  proficiency: z.number().min(1, "Minimum je 1").max(100, "Maximum je 100"),
});

export const aboutSchema = z.object({
  name: z.string().min(1, "Jméno je povinné"),
  title: z.string().min(1, "Titul je povinný"),
  bio: z.string().min(50, "Bio musí mít alespoň 50 znaků"),
  avatar: z.string().optional(),
  location: z.string().min(1, "Lokace je povinná"),
  email: z.string().email("Neplatný email"),
  phone: z.string().optional(),
  cvUrl: z.string().optional(),
});

export const socialSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  url: z.string().url("Neplatná URL"),
  icon: z.string().min(1, "Ikona je povinná"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type TechnologyFormData = z.infer<typeof technologySchema>;
export type AboutFormData = z.infer<typeof aboutSchema>;
export type SocialFormData = z.infer<typeof socialSchema>;
