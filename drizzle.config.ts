import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // url: process.env.PROD_DB_URL!,
    url: process.env.DATABASE_URL!,
  },
});
