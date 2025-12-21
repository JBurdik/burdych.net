import "dotenv/config";
import { auth } from "../lib/auth";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@burdych.net";
  const password = process.env.ADMIN_PASSWORD || "change-me-in-production";
  const name = "Admin";

  console.log("Creating admin user...");

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });
    console.log(`✅ Admin user created: ${email}`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("already exists")) {
      console.log(`ℹ️ Admin user already exists: ${email}`);
    } else {
      console.error("❌ Failed to create admin:", error);
      process.exit(1);
    }
  }

  process.exit(0);
}

seedAdmin();
