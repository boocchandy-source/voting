import bcrypt from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

/** List accounts. ?status=pending|approved|rejected|all (default pending). */
export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "pending";
  const rows = await db
    .select({
      id: students.id,
      studentId: students.studentId,
      lastname: students.lastname,
      firstname: students.firstname,
      hasVoted: students.hasVoted,
      isAdmin: students.isAdmin,
      status: students.status,
      createdAt: students.createdAt,
    })
    .from(students)
    .orderBy(asc(students.createdAt));
  const list =
    status === "all" ? rows : rows.filter((r) => r.status === status);
  return NextResponse.json({ ok: true, students: list });
}

/** Create an account directly (used for new admin accounts). */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: {
    lastname?: string;
    firstname?: string;
    studentId?: string;
    password?: string;
    isAdmin?: boolean;
  };
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
      { error: "This Student ID is already registered." },
      { status: 409 }
    );
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(students).values({
    studentId,
    lastname,
    firstname,
    passwordHash,
    isAdmin: Boolean(body.isAdmin),
    status: "approved",
  });
  return NextResponse.json({ ok: true });
}

/** Approve or reject an account. { id, action: "approve" | "reject" } */
export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: { id?: number; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.id !== "number" || (body.action !== "approve" && body.action !== "reject")) {
    return NextResponse.json({ error: "Provide an id and action approve|reject." }, { status: 400 });
  }
  if (body.id === gate.adminId) {
    return NextResponse.json({ error: "You cannot change your own account here." }, { status: 400 });
  }
  await db
    .update(students)
    .set({ status: body.action === "approve" ? "approved" : "rejected" })
    .where(eq(students.id, body.id));
  return NextResponse.json({ ok: true });
}
