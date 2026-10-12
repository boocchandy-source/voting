import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function GET() {
  const rows = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.publishedAt));
  const anyLatest = rows.some((a) => a.isLatest);
  return NextResponse.json({
    ok: true,
    announcements: rows.map((a, i) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      date: formatDate(a.publishedAt),
      latest: a.isLatest || (!anyLatest && i === 0),
    })),
  });
}
