import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`register:${clientIp(req)}`, 10)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }
  let body: { lastname?: string; firstname?: string; studentId?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lastname = body.lastname?.trim() ?? "";
  const firstname = body.firstname?.trim() ?? "";
  const studentId = body.studentId?.trim() ?? "";
  const password = body.password ?? "";

  if (!lastname || !firstname || !studentId || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!/^[0-9]{4,16}$/.test(studentId)) {
    return NextResponse.json(
      { error: "Student ID must be 4–16 digits (e.g. 00005050)." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const existing = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.studentId, studentId));
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "This Student ID is already registered. Please log in." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(students).values({
    studentId,
    lastname,
    firstname,
    passwordHash,
    status: "pending",
  });

  // New accounts wait for admin approval — no session is created here.
  return NextResponse.json({
    ok: true,
    pending: true,
    message:
      "Account created! Please wait for the admin to approve your account before logging in.",
  });
}
