import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[migrate] DATABASE_URL not set");
  process.exit(1);
}

// max: 1 — migrations must run on a single connection
const client = postgres(connectionString, { max: 1, onnotice: () => {} });
const db = drizzle(client);

try {
  console.log("[migrate] applying migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] done");
} catch (err) {
  console.error("[migrate] failed:", err);
  process.exitCode = 1;
} finally {
  await client.end();
}
