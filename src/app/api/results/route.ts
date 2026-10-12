import { asc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, electionSettings, electionWinners, positions, votes } from "@/db/schema";

async function electionEnd(): Promise<number> {
  const rows = await db.select().from(electionSettings);
  return rows[0] ? rows[0].votingEnd.getTime() : new Date("2026-10-07T17:00:00").getTime();
}

export async function GET() {
  if (Date.now() < (await electionEnd())) {
    return NextResponse.json({ ok: true, locked: true });
  }

  const positionRows = await db
    .select()
    .from(positions)
    .orderBy(asc(positions.sortOrder));
  const candidateRows = await db.select().from(candidates);
  const countRows = await db
    .select({
      candidateId: votes.candidateId,
      count: sql<number>`count(*)::int`,
    })
    .from(votes)
    .groupBy(votes.candidateId);
  const counts = new Map(countRows.map((r) => [r.candidateId, r.count]));
  const winnerRows = await db.select().from(electionWinners);
  const manualWinner = new Map(winnerRows.map((w) => [w.positionId, w.candidateId]));

  return NextResponse.json({
    ok: true,
    locked: false,
    positions: positionRows.map((p) => {
      const declaredId = manualWinner.get(p.id) ?? null;
      const list = candidateRows
        .filter((c) => c.positionId === p.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          course: c.course,
          votes: counts.get(c.id) ?? 0,
          winner: declaredId !== null && declaredId === c.id,
        }))
        .sort((a, b) => {
          if (a.winner !== b.winner) return a.winner ? -1 : 1;
          return b.votes - a.votes;
        });
      return {
        id: p.id,
        name: p.name,
        total: list.reduce((s, c) => s + c.votes, 0),
        candidates: list,
      };
    }),
  });
}
