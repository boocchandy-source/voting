import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { electionSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const rows = await db.select().from(electionSettings);
  const row = rows[0];
  return NextResponse.json({
    ok: true,
    votingStart: row ? row.votingStart.getTime() : null,
    votingEnd: row ? row.votingEnd.getTime() : null,
  });
}

/** Set the voting window. { votingStart: ms, votingEnd: ms } */
export async function PUT(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: { votingStart?: number; votingEnd?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const start = new Date(body.votingStart ?? NaN);
  const end = new Date(body.votingEnd ?? NaN);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: "Provide valid start and end times." }, { status: 400 });
  }
  if (end <= start) {
    return NextResponse.json({ error: "Voting end must be after voting start." }, { status: 400 });
  }
  const rows = await db.select().from(electionSettings);
  if (rows.length === 0) {
    await db.insert(electionSettings).values({ votingStart: start, votingEnd: end });
  } else {
    await db
      .update(electionSettings)
      .set({ votingStart: start, votingEnd: end })
      .where(eq(electionSettings.id, rows[0].id));
  }
  return NextResponse.json({ ok: true });
}

/** Clear the custom window (the app falls back to the default schedule). */
export async function DELETE() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  await db.delete(electionSettings);
  return NextResponse.json({ ok: true });
}
