import { NextResponse } from "next/server";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM blog_posts ORDER BY id DESC"
  );
  return NextResponse.json({ posts: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const slug = body.slug ? slugify(body.slug) : slugify(title);
  const status = body.status === "published" ? "published" : "draft";

  const [result] = await getPool().query<ResultSetHeader>(
    `INSERT INTO blog_posts
      (title, slug, excerpt, content, cover_image, category, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      body.excerpt || null,
      body.content || null,
      body.cover_image || null,
      body.category || null,
      status,
      status === "published" ? new Date() : null,
    ]
  );
  return NextResponse.json({ id: result.insertId, slug });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const status = body.status === "published" ? "published" : "draft";
  await getPool().query(
    `UPDATE blog_posts SET
      title=?, slug=?, excerpt=?, content=?, cover_image=?, category=?, status=?,
      published_at = CASE
        WHEN ? = 'published' AND published_at IS NULL THEN NOW()
        WHEN ? = 'draft' THEN NULL
        ELSE published_at
      END
     WHERE id=?`,
    [
      body.title,
      slugify(body.slug || body.title),
      body.excerpt || null,
      body.content || null,
      body.cover_image || null,
      body.category || null,
      status,
      status,
      status,
      body.id,
    ]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await getPool().query("DELETE FROM blog_posts WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
