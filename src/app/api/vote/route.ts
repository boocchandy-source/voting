import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, electionSettings, positions, students, votes } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

/** Returns the signed-in student's own picks (for the voted confirmation view). */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const rows = await db
    .select({
      positionId: votes.positionId,
      positionName: positions.name,
      candidateName: candidates.name,
    })
    .from(votes)
    .innerJoin(positions, eq(votes.positionId, positions.id))
    .innerJoin(candidates, eq(votes.candidateId, candidates.id))
    .where(eq(votes.studentId, session.sub));
  return NextResponse.json({ ok: true, picks: rows });
}

type Ballot = { picks: { positionId: number; candidateId: number }[] };

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!rateLimit(`vote:${session.sub}`, 10)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: Ballot;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!Array.isArray(body.picks) || body.picks.length === 0) {
    return NextResponse.json({ error: "No votes submitted." }, { status: 400 });
  }

  const [student] = await db
    .select({ id: students.id, hasVoted: students.hasVoted })
    .from(students)
    .where(eq(students.id, session.sub));
  if (!student) {
    return NextResponse.json({ error: "Account no longer exists." }, { status: 401 });
  }
  if (student.hasVoted) {
    return NextResponse.json(
      { error: "You have already voted. Each student may vote only once." },
      { status: 409 }
    );
  }

  // Enforce the admin-controlled voting window.
  const settings = await db.select().from(electionSettings);
  const now = Date.now();
  if (settings[0]) {
    if (now < settings[0].votingStart.getTime()) {
      return NextResponse.json({ error: "Voting has not started yet." }, { status: 403 });
    }
    if (now > settings[0].votingEnd.getTime()) {
      return NextResponse.json({ error: "Voting has ended." }, { status: 403 });
    }
  }

  // Validate: every position covered exactly once, candidate belongs to position.
  const positionRows = await db.select().from(positions);
  const candidateRows = await db.select().from(candidates);
  const byPosition = new Map(candidateRows.map((c) => [c.id, c.positionId]));
  const seen = new Set<number>();
  for (const pick of body.picks) {
    if (seen.has(pick.positionId)) {
      return NextResponse.json(
        { error: "Duplicate vote for one position." },
        { status: 400 }
      );
    }
    seen.add(pick.positionId);
    if (byPosition.get(pick.candidateId) !== pick.positionId) {
      return NextResponse.json(
        { error: "Invalid candidate for the given position." },
        { status: 400 }
      );
    }
  }
  if (seen.size !== positionRows.length) {
    return NextResponse.json(
      { error: "You must vote for every position." },
      { status: 400 }
    );
  }

  try {
    await db.transaction(async (tx) => {
      for (const pick of body.picks) {
        await tx.insert(votes).values({
          studentId: student.id,
          positionId: pick.positionId,
          candidateId: pick.candidateId,
        });
      }
      await tx
        .update(students)
        .set({ hasVoted: true })
        .where(eq(students.id, student.id));
    });
  } catch {
    return NextResponse.json(
      { error: "Vote could not be recorded. You may have already voted." },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
