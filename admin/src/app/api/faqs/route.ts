import { NextResponse } from "next/server";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ensureFaqsSchema } from "@/lib/faqsStore";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureFaqsSchema();
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM faqs ORDER BY sort_order ASC, id ASC"
  );
  return NextResponse.json({ faqs: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureFaqsSchema();
  const body = await request.json();
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO faqs (question, answer, category, sort_order, is_published, show_on_home)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      body.question,
      body.answer,
      body.category || null,
      Number(body.sort_order || 0),
      body.is_published === false ? 0 : 1,
      body.show_on_home ? 1 : 0,
    ]
  );
  return NextResponse.json({ id: result.insertId });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureFaqsSchema();
  const body = await request.json();
  await getPool().query(
    `UPDATE faqs SET question=?, answer=?, category=?, sort_order=?, is_published=?, show_on_home=? WHERE id=?`,
    [
      body.question,
      body.answer,
      body.category || null,
      Number(body.sort_order || 0),
      body.is_published === false ? 0 : 1,
      body.show_on_home ? 1 : 0,
      body.id,
    ]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureFaqsSchema();
  const id = Number(new URL(request.url).searchParams.get("id"));
  await getPool().query("DELETE FROM faqs WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
