import { NextResponse } from "next/server";
import { db } from "@/db";
import { electionSettings } from "@/db/schema";

const FALLBACK_START = new Date("2026-10-01T08:00:00").getTime();
const FALLBACK_END = new Date("2026-10-07T17:00:00").getTime();

export async function GET() {
  const rows = await db.select().from(electionSettings);
  const row = rows[0];
  return NextResponse.json({
    ok: true,
    votingStart: row ? row.votingStart.getTime() : FALLBACK_START,
    votingEnd: row ? row.votingEnd.getTime() : FALLBACK_END,
  });
}
