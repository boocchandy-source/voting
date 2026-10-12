import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, positions } from "@/db/schema";

export async function GET() {
  const positionRows = await db
    .select()
    .from(positions)
    .orderBy(asc(positions.sortOrder));
  const candidateRows = await db.select().from(candidates);

  return NextResponse.json({
    ok: true,
    positions: positionRows.map((p) => ({
      id: p.id,
      name: p.name,
      candidates: candidateRows
        .filter((c) => c.positionId === p.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          course: c.course,
          tagline: c.tagline,
        })),
    })),
  });
}
