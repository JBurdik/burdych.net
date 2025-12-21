import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const categoryEnum = pgEnum("category", [
  "frontend",
  "backend",
  "tools",
  "other",
]);

// Tables
export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies").array().default([]),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().default([]),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const technologies = pgTable("technologies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  category: categoryEnum("category").notNull(),
  proficiency: integer("proficiency").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const about = pgTable("about", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar"),
  location: text("location").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  cvUrl: text("cv_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socials = pgTable("socials", {
  id: uuid("id").defaultRandom().primaryKey(),
  aboutId: uuid("about_id").references(() => about.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Types for inference
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Technology = typeof technologies.$inferSelect;
export type NewTechnology = typeof technologies.$inferInsert;

export type About = typeof about.$inferSelect;
export type NewAbout = typeof about.$inferInsert;

export type Social = typeof socials.$inferSelect;
export type NewSocial = typeof socials.$inferInsert;
