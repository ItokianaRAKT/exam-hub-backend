import fs from "fs";
import path from "path";
import { Pool } from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://user:password@localhost:5432/dbname";

const migrationsDir = path.resolve(__dirname, "../../database/migrations");
const seedsDir = path.resolve(__dirname, "../../database/seeds");

const DUPLICATE_CODES = new Set(["42P07", "42710", "42P06", "42723"]);

async function applyFiles(pool: Pool, dir: string, kind: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    console.warn(`[migrate] dossier introuvable, ignoré: ${dir}`);
    return;
  }

  const client = await pool.connect();
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const applied = new Set(
      (await client.query("SELECT filename FROM schema_migrations")).rows.map(
        (r) => r.filename
      )
    );

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] skip ${kind}: ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.log(`[migrate] appliqué ${kind}: ${file}`);
      } catch (err: any) {
        await client.query("ROLLBACK");
        if (err?.code && DUPLICATE_CODES.has(err.code)) {
          await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
          console.log(`[migrate] déjà présent, marqué appliqué ${kind}: ${file}`);
        } else {
          throw err;
        }
      }
    }
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        filename   VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`
    );

    await applyFiles(pool, migrationsDir, "migration");
    await applyFiles(pool, seedsDir, "seed");
  } finally {
    await pool.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[migrate] échec:", err);
    process.exit(1);
  });