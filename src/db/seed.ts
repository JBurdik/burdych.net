import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  experiences,
  projects,
  technologies,
  about,
  socials,
} from "./schema";
import {
  experiences as seedExperiences,
  projects as seedProjects,
  technologies as seedTechnologies,
  about as seedAbout,
} from "../data/portfolio";

const connectionString = process.env.DATABASE_URL!;

async function seed() {
  console.log("🌱 Seeding database...");

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    // Clear existing data (in correct order due to FK constraints)
    console.log("  Clearing existing data...");
    await db.delete(socials);
    await db.delete(about);
    await db.delete(technologies);
    await db.delete(projects);
    await db.delete(experiences);

    // Seed experiences
    console.log("  Seeding experiences...");
    for (const exp of seedExperiences) {
      await db.insert(experiences).values({
        company: exp.company,
        role: exp.role,
        period: exp.period,
        description: exp.description,
        technologies: exp.technologies,
        logo: exp.logo,
      });
    }
    console.log(`    ✓ ${seedExperiences.length} experiences`);

    // Seed projects
    console.log("  Seeding projects...");
    for (const proj of seedProjects) {
      await db.insert(projects).values({
        title: proj.title,
        description: proj.description,
        image: proj.image,
        technologies: proj.technologies,
        liveUrl: proj.liveUrl,
        githubUrl: proj.githubUrl,
        featured: proj.featured,
      });
    }
    console.log(`    ✓ ${seedProjects.length} projects`);

    // Seed technologies
    console.log("  Seeding technologies...");
    for (const tech of seedTechnologies) {
      await db.insert(technologies).values({
        name: tech.name,
        icon: tech.icon,
        category: tech.category,
        proficiency: tech.proficiency,
      });
    }
    console.log(`    ✓ ${seedTechnologies.length} technologies`);

    // Seed about (singleton)
    console.log("  Seeding about...");
    const [aboutRecord] = await db
      .insert(about)
      .values({
        name: seedAbout.name,
        title: seedAbout.title,
        bio: seedAbout.bio,
        avatar: seedAbout.avatar,
        location: seedAbout.location,
        email: seedAbout.email,
        phone: seedAbout.phone,
        cvUrl: seedAbout.cvUrl,
      })
      .returning();
    console.log("    ✓ 1 about record");

    // Seed socials
    console.log("  Seeding socials...");
    for (const social of seedAbout.socials) {
      await db.insert(socials).values({
        aboutId: aboutRecord.id,
        name: social.name,
        url: social.url,
        icon: social.icon,
      });
    }
    console.log(`    ✓ ${seedAbout.socials.length} social links`);

    console.log("\n✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
