import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 10)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }
  let body: { studentId?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const studentId = body.studentId?.trim() ?? "";
  const password = body.password ?? "";
  if (!studentId || !password) {
    return NextResponse.json(
      { error: "Student ID and password are required." },
      { status: 400 }
    );
  }

  let rows;
  try {
    rows = await db.select().from(students).where(eq(students.studentId, studentId));
  } catch (e) {
    console.error("[login] database query failed:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }
  const row = rows[0];
  if (!row || !(await bcrypt.compare(password, row.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid Student ID or password." },
      { status: 401 }
    );
  }
  if (row.status === "pending") {
    return NextResponse.json(
      { error: "Your account is waiting for admin approval. Please try again later." },
      { status: 403 }
    );
  }
  if (row.status === "rejected") {
    return NextResponse.json(
      { error: "Your account was not approved. Please contact the election committee." },
      { status: 403 }
    );
  }

  try {
    await createSession({
      sub: row.id,
      studentId: row.studentId,
      firstname: row.firstname,
      lastname: row.lastname,
      isAdmin: row.isAdmin,
    });
  } catch (e) {
    console.error("[login] createSession failed:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "Server is misconfigured (session secret). Please contact the administrator." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, isAdmin: row.isAdmin });
}
