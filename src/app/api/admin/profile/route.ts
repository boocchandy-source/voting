import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { students } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const session = await getSession();
  const rows = await db
    .select({
      firstname: students.firstname,
      lastname: students.lastname,
      studentId: students.studentId,
    })
    .from(students)
    .where(eq(students.id, session!.sub));
  return NextResponse.json({ ok: true, profile: rows[0] ?? null });
}

/** Update own profile.
 *  { firstname?, lastname?, studentId?, currentPassword?, newPassword? }
 *  Changing the password requires the current password. */
export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const session = await getSession();
  const [me] = await db.select().from(students).where(eq(students.id, session!.sub));
  if (!me) {
    return NextResponse.json({ error: "Account no longer exists." }, { status: 401 });
  }

  let body: {
    firstname?: string;
    lastname?: string;
    studentId?: string;
    currentPassword?: string;
    newPassword?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const patch: {
    firstname?: string;
    lastname?: string;
    studentId?: string;
    passwordHash?: string;
  } = {};
  if (body.firstname?.trim()) patch.firstname = body.firstname.trim();
  if (body.lastname?.trim()) patch.lastname = body.lastname.trim();
  if (body.studentId?.trim() && body.studentId.trim() !== me.studentId) {
    const taken = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.studentId, body.studentId.trim()));
    if (taken.some((r) => r.id !== me.id)) {
      return NextResponse.json(
        { error: "This Student ID is already taken." },
        { status: 409 }
      );
    }
    patch.studentId = body.studentId.trim();
  }
  if (body.newPassword) {
    if (!body.currentPassword) {
      return NextResponse.json(
        { error: "Enter your current password to set a new one." },
        { status: 400 }
      );
    }
    if (!(await bcrypt.compare(body.currentPassword, me.passwordHash))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }
    patch.passwordHash = await bcrypt.hash(body.newPassword, 10);
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  await db.update(students).set(patch).where(eq(students.id, me.id));
  return NextResponse.json({ ok: true });
}
