import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? "";

if (!connectionString) {
  console.error("[db] DATABASE_URL is not set");
}

// SSL everywhere except local dev: Render external URLs require it, and
// Render internal hostnames (e.g. dpg-xxxx-a) accept it too.
const isLocalhost = /localhost|127\.0\.0\.1/.test(connectionString);

const pool = new Pool({
  connectionString,
  ...(connectionString && !isLocalhost
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

pool.on("error", (err) => {
  console.error("[db] idle pool error:", err.message);
});

export const db = drizzle(pool, { schema });
