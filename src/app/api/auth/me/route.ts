import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const rows = await db
    .select({
      firstname: students.firstname,
      lastname: students.lastname,
      studentId: students.studentId,
      hasVoted: students.hasVoted,
      isAdmin: students.isAdmin,
    })
    .from(students)
    .where(eq(students.id, session.sub));
  const row = rows[0];
  if (!row) {
    return NextResponse.json({ error: "Account no longer exists." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, student: row });
}
