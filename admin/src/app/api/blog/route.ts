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

/** `VARCHAR(500)` holds the whole comma separated tag list comfortably. */
function normalizeTags(value: unknown): string | null {
  if (Array.isArray(value)) {
    const list = value.map((tag) => String(tag).trim()).filter(Boolean);
    return list.length ? list.join(", ") : null;
  }
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const list = raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return list.length ? list.join(", ") : null;
}

function normalizeStatus(value: unknown): "draft" | "published" {
  return value === "published" ? "published" : "draft";
}

/** Coerces every field the editor sends into the column's storage type. */
function readBody(body: Record<string, unknown>) {
  const title = String(body.title || "").trim();
  const slug = slugify(String(body.slug || title));
  const status = normalizeStatus(body.status);

  return {
    title,
    slug,
    status,
    excerpt: String(body.excerpt || "").trim() || null,
    content: String(body.content || "").trim() || null,
    cover_image: String(body.cover_image || "").trim() || null,
    cover_video: String(body.cover_video || "").trim() || null,
    category: String(body.category || "").trim() || null,
    author: String(body.author || "").trim() || null,
    author_image: String(body.author_image || "").trim() || null,
    tags: normalizeTags(body.tags),
    read_time: String(body.read_time || "").trim() || null,
    is_featured: body.is_featured ? 1 : 0,
  };
}

/** MySQL's unique index would otherwise surface as an opaque 500. */
function isDuplicateSlug(err: unknown): boolean {
  const code = (err as { code?: string })?.code;
  return code === "ER_DUP_ENTRY" || code === "ER_DUP_KEY";
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT * FROM blog_posts ORDER BY is_featured DESC, published_at DESC, id DESC"
  );
  return NextResponse.json({ posts: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const post = readBody(body);
  if (!post.title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  if (!post.slug) {
    return NextResponse.json(
      { error: "Slug could not be generated. Use letters and numbers." },
      { status: 400 }
    );
  }

  try {
    // Only one article can be the blog hero pick, so clear the flag before
    // setting it on the incoming post.
    if (post.is_featured) {
      await getPool().query("UPDATE blog_posts SET is_featured = 0 WHERE is_featured = 1");
    }

    const [result] = await getPool().query<ResultSetHeader>(
      `INSERT INTO blog_posts
        (title, slug, excerpt, content, cover_image, cover_video, category, author, author_image, tags, read_time, is_featured, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.cover_image,
        post.cover_video,
        post.category,
        post.author,
        post.author_image,
        post.tags,
        post.read_time,
        post.is_featured,
        post.status,
        post.status === "published" ? new Date() : null,
      ]
    );
    return NextResponse.json({ id: result.insertId, slug: post.slug });
  } catch (err) {
    if (isDuplicateSlug(err)) {
      return NextResponse.json(
        { error: `The slug "${post.slug}" is already used by another article.` },
        { status: 409 }
      );
    }
    throw err;
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "Post id required" }, { status: 400 });

  const post = readBody(body);
  if (!post.title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  try {
    const pool = getPool();
    if (post.is_featured) {
      await pool.query("UPDATE blog_posts SET is_featured = 0 WHERE is_featured = 1 AND id <> ?", [
        id,
      ]);
    }

    await pool.query(
      `UPDATE blog_posts SET
        title=?, slug=?, excerpt=?, content=?, cover_image=?, cover_video=?, category=?,
        author=?, author_image=?, tags=?, read_time=?, is_featured=?, status=?,
        published_at = CASE
          WHEN ? = 'published' AND published_at IS NULL THEN NOW()
          WHEN ? = 'draft' THEN NULL
          ELSE published_at
        END
       WHERE id=?`,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.cover_image,
        post.cover_video,
        post.category,
        post.author,
        post.author_image,
        post.tags,
        post.read_time,
        post.is_featured,
        post.status,
        post.status,
        post.status,
        id,
      ]
    );
    return NextResponse.json({ ok: true, slug: post.slug });
  } catch (err) {
    if (isDuplicateSlug(err)) {
      return NextResponse.json(
        { error: `The slug "${post.slug}" is already used by another article.` },
        { status: 409 }
      );
    }
    throw err;
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Post id required" }, { status: 400 });
  await getPool().query("DELETE FROM blog_posts WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}