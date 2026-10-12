import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

/** Add an announcement. { title, body, isLatest? } */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: { title?: string; body?: string; isLatest?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const title = body.title?.trim() ?? "";
  const text = body.body?.trim() ?? "";
  if (!title || !text) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 }
    );
  }
  if (body.isLatest) {
    await db.update(announcements).set({ isLatest: false });
  }
  await db.insert(announcements).values({
    title,
    body: text,
    isLatest: Boolean(body.isLatest),
  });
  return NextResponse.json({ ok: true });
}

/** Edit an announcement. { id, title, body, isLatest? } */
export async function PUT(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: { id?: number; title?: string; body?: string; isLatest?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.id !== "number") {
    return NextResponse.json({ error: "Provide an announcement id." }, { status: 400 });
  }
  const title = body.title?.trim() ?? "";
  const text = body.body?.trim() ?? "";
  if (!title || !text) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 }
    );
  }
  if (body.isLatest) {
    await db.update(announcements).set({ isLatest: false });
  }
  await db
    .update(announcements)
    .set({ title, body: text, isLatest: Boolean(body.isLatest) })
    .where(eq(announcements.id, body.id));
  return NextResponse.json({ ok: true });
}

/** Delete an announcement. ?id= */
export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Provide an announcement id." }, { status: 400 });
  }
  await db.delete(announcements).where(eq(announcements.id, id));
  return NextResponse.json({ ok: true });
}
