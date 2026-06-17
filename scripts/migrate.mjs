import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import postgres from "postgres";

const MIGRATIONS_FOLDER = "./drizzle";
// A table that exists once the app schema is provisioned. Used to detect a DB
// that was created via `drizzle-kit push` before migrations were introduced.
const PROVISIONED_TABLE = "public.about";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[migrate] DATABASE_URL not set");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1, onnotice: () => {} });
const db = drizzle(client);

// Replicate drizzle's readMigrationFiles: hash = sha256(file), millis = journal "when".
function readJournalEntries() {
  const journal = JSON.parse(
    readFileSync(join(MIGRATIONS_FOLDER, "meta", "_journal.json"), "utf8"),
  );
  return journal.entries.map((e) => {
    const query = readFileSync(join(MIGRATIONS_FOLDER, `${e.tag}.sql`), "utf8");
    return { hash: createHash("sha256").update(query).digest("hex"), when: e.when };
  });
}

// One-time baseline: an existing DB provisioned by `drizzle-kit push` has the
// schema but no migration history, so migrate() would try to recreate objects
// and fail. Mark existing migrations as applied without running them.
async function baselineIfNeeded() {
  const [{ provisioned }] = await client`
    select to_regclass(${PROVISIONED_TABLE}) is not null as provisioned`;
  if (!provisioned) return; // fresh DB — let migrate() create everything

  const [{ has_history }] = await client`
    select to_regclass('drizzle.__drizzle_migrations') is not null as has_history`;
  let applied = 0;
  if (has_history) {
    const [{ count }] = await client`
      select count(*)::int as count from drizzle.__drizzle_migrations`;
    applied = count;
  }
  if (applied > 0) return; // history already tracked — normal migrate

  console.log("[migrate] existing schema without history — baselining...");
  await client`create schema if not exists drizzle`;
  await client`create table if not exists drizzle.__drizzle_migrations (
    id serial primary key, hash text not null, created_at bigint)`;
  for (const { hash, when } of readJournalEntries()) {
    await client`insert into drizzle.__drizzle_migrations ("hash", "created_at")
      values (${hash}, ${when})`;
  }
  console.log("[migrate] baseline recorded");
}

try {
  await baselineIfNeeded();
  console.log("[migrate] applying migrations...");
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  console.log("[migrate] done");
} catch (err) {
  console.error("[migrate] failed:", err);
  process.exitCode = 1;
} finally {
  await client.end();
}
