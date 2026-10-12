import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

/**
 * Safe diagnostics endpoint (no secrets leaked).
 * Reports env presence + DB reachability so production 500s can be pinpointed.
 */
export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const hasSessionSecret = Boolean(process.env.SESSION_SECRET);
  let dbPing: string = "skipped";
  if (hasDatabaseUrl) {
    try {
      await db.execute(sql`select 1`);
      dbPing = "ok";
    } catch (e) {
      dbPing = e instanceof Error ? `fail: ${e.message.slice(0, 160)}` : "fail";
    }
  }
  const status = hasDatabaseUrl && hasSessionSecret && dbPing === "ok" ? 200 : 500;
  return NextResponse.json(
    { ok: status === 200, hasDatabaseUrl, hasSessionSecret, dbPing },
    { status }
  );
}
