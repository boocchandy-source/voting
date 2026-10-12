import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, electionWinners } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

/** Declared winners: [{ positionId, candidateId }]. Omit a position to clear it. */
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const rows = await db.select().from(electionWinners);
  return NextResponse.json({
    ok: true,
    winners: rows.map((r) => ({
      positionId: r.positionId,
      candidateId: r.candidateId,
    })),
  });
}

export async function PUT(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: { winners?: { positionId: number; candidateId: number }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const winners = body.winners;
  if (!Array.isArray(winners)) {
    return NextResponse.json({ error: "Provide a winners array." }, { status: 400 });
  }

  // Validate every candidate belongs to its position.
  const candidateRows = await db.select().from(candidates);
  const byPosition = new Map(candidateRows.map((c) => [c.id, c.positionId]));
  for (const w of winners) {
    if (byPosition.get(w.candidateId) !== w.positionId) {
      return NextResponse.json(
        { error: "A winner does not belong to the given position." },
        { status: 400 }
      );
    }
  }

  await db.transaction(async (tx) => {
    await tx.delete(electionWinners);
    for (const w of winners) {
      await tx
        .insert(electionWinners)
        .values({ positionId: w.positionId, candidateId: w.candidateId });
    }
  });
  return NextResponse.json({ ok: true });
}
