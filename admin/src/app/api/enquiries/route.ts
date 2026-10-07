import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";

const STATUSES = ["new", "read", "replied", "archived"] as const;
type Status = (typeof STATUSES)[number];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = new URL(request.url).searchParams;
  const status = params.get("status");
  const limit = Math.min(Number(params.get("limit") || 200), 500);

  const where = STATUSES.includes(status as Status) ? "WHERE status = ?" : "";
  const args: unknown[] = STATUSES.includes(status as Status) ? [status] : [];

  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id, name, email, phone, subject, message, source, status, notes, ip, created_at, updated_at
     FROM enquiries ${where}
     ORDER BY FIELD(status, 'new','read','replied','archived') ASC, created_at DESC
     LIMIT ${limit}`,
    args
  );

  const [counts] = await getPool().query<RowDataPacket[]>(
    "SELECT status, COUNT(*) AS total FROM enquiries GROUP BY status"
  );

  const byStatus: Record<string, number> = { new: 0, read: 0, replied: 0, archived: 0 };
  for (const row of counts) byStatus[String(row.status)] = Number(row.total);

  const [[total]] = await getPool().query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM enquiries"
  );

  return NextResponse.json({ enquiries: rows, counts: byStatus, total: Number(total.total) });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const updates: string[] = [];
  const args: unknown[] = [];

  if (STATUSES.includes(body.status)) {
    updates.push("status = ?");
    args.push(body.status);
  }
  if (body.notes !== undefined) {
    updates.push("notes = ?");
    args.push(String(body.notes).slice(0, 5000) || null);
  }

  if (!updates.length) return NextResponse.json({ ok: true });

  args.push(id);
  await getPool().query(`UPDATE enquiries SET ${updates.join(", ")} WHERE id = ?`, args);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await getPool().query("DELETE FROM enquiries WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}