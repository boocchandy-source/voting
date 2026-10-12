import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, positions, votes } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

/** Add a candidate. { name, positionId, course, tagline } */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: { name?: string; positionId?: number; course?: string; tagline?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const course = body.course?.trim() ?? "";
  const tagline = body.tagline?.trim() ?? "";
  if (!name || typeof body.positionId !== "number" || !course) {
    return NextResponse.json(
      { error: "Name, position, and course are required." },
      { status: 400 }
    );
  }
  const pos = await db
    .select({ id: positions.id })
    .from(positions)
    .where(eq(positions.id, body.positionId));
  if (pos.length === 0) {
    return NextResponse.json({ error: "Position not found." }, { status: 400 });
  }
  await db.insert(candidates).values({
    positionId: body.positionId,
    name,
    course,
    tagline,
  });
  return NextResponse.json({ ok: true });
}

/** Remove a candidate. ?id= — blocked when the candidate already has votes. */
export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Provide a candidate id." }, { status: 400 });
  }
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(votes)
    .where(eq(votes.candidateId, id));
  if (count > 0) {
    return NextResponse.json(
      { error: "This candidate already has votes and cannot be removed." },
      { status: 409 }
    );
  }
  await db.delete(candidates).where(eq(candidates.id, id));
  return NextResponse.json({ ok: true });
}
