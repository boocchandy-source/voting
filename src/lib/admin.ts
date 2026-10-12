import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { getSession } from "@/lib/auth";

/** Loads the signed-in student row, or returns an error response when the
 *  caller is not an approved admin. Re-checks the DB (never trusts the JWT
 *  role claim alone). */
export async function requireAdmin(): Promise<
  { ok: true; adminId: number } | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not signed in." }, { status: 401 }),
    };
  }
  const rows = await db
    .select({ id: students.id, isAdmin: students.isAdmin, status: students.status })
    .from(students)
    .where(eq(students.id, session.sub));
  const row = rows[0];
  if (!row || !row.isAdmin || row.status !== "approved") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
    };
  }
  return { ok: true, adminId: row.id };
}
