import { NextResponse } from "next/server";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM pricing_plans ORDER BY sort_order ASC, id ASC"
  );
  return NextResponse.json({ plans: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const features = Array.isArray(body.features) ? body.features : [];
  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO pricing_plans
      (name, price_monthly, price_yearly, description, features_json, is_featured, cta_label, cta_href, sort_order, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.name,
      Number(body.price_monthly || 0),
      Number(body.price_yearly || 0),
      body.description || null,
      JSON.stringify(features),
      body.is_featured ? 1 : 0,
      body.cta_label || "Get Started",
      body.cta_href || "/request-demo",
      Number(body.sort_order || 0),
      body.is_published === false ? 0 : 1,
    ]
  );
  return NextResponse.json({ id: result.insertId });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const features = Array.isArray(body.features) ? body.features : [];
  await getPool().query(
    `UPDATE pricing_plans SET
      name=?, price_monthly=?, price_yearly=?, description=?, features_json=?,
      is_featured=?, cta_label=?, cta_href=?, sort_order=?, is_published=?
     WHERE id=?`,
    [
      body.name,
      Number(body.price_monthly || 0),
      Number(body.price_yearly || 0),
      body.description || null,
      JSON.stringify(features),
      body.is_featured ? 1 : 0,
      body.cta_label || "Get Started",
      body.cta_href || "/request-demo",
      Number(body.sort_order || 0),
      body.is_published === false ? 0 : 1,
      body.id,
    ]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await getPool().query("DELETE FROM pricing_plans WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
