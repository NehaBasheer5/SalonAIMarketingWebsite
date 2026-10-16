import { NextResponse } from "next/server";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { readFeaturePostBody, type FeaturePostRow } from "@/lib/featurePosts";

const COLUMNS = `title, slug, description, content, category, icon, image_url, image_alt, href, is_featured, is_published`;

/** MySQL's unique index would otherwise surface as an opaque 500. */
function isDuplicateSlug(err: unknown): boolean {
  const code = (err as { code?: string })?.code;
  return code === "ER_DUP_ENTRY" || code === "ER_DUP_KEY";
}

/**
 * Feature post CRUD for Admin -> Features Posts.
 *
 * Each card has a `slug` that serves as its detail page URL on the Client at
 * `/features/<slug>`, plus a markdown `content` body rendered there. The
 * category filter tabs around the cards stay in `page_sections` under
 * Pages -> Features.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Raw rows so the editor also receives `is_published` and `sort_order`.
  const [rows] = await getPool().query<FeaturePostRow[]>(
    "SELECT * FROM feature_posts ORDER BY sort_order ASC, id ASC"
  );
  return NextResponse.json({ posts: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const post = readFeaturePostBody(body);
  if (!post.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (!post.slug) {
    return NextResponse.json(
      { error: "Slug could not be generated. Use letters and numbers." },
      { status: 400 }
    );
  }

  const pool = getPool();

  // The editor can reorder by sending the whole visible order; otherwise the new
  // card goes to the end.
  const order = Number(body.sort_order);
  let sortOrder = Number.isFinite(order) && order > 0 ? order : null;
  if (sortOrder === null) {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), 0) AS max FROM feature_posts"
    );
    sortOrder = Number(rows[0]?.max ?? 0) + 1;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO feature_posts (${COLUMNS}, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post.title,
        post.slug,
        post.description ?? null,
        post.content ?? null,
        post.category ?? null,
        post.icon ?? null,
        post.image_url ?? null,
        post.image_alt ?? null,
        post.href ?? null,
        post.is_featured,
        post.is_published,
        sortOrder,
      ]
    );

    return NextResponse.json({ id: result.insertId, slug: post.slug });
  } catch (err) {
    if (isDuplicateSlug(err)) {
      return NextResponse.json(
        { error: `The slug "${post.slug}" is already used by another feature post.` },
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
  if (!id) return NextResponse.json({ error: "Feature post id required" }, { status: 400 });

  const post = readFeaturePostBody(body);
  if (!post.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (!post.slug) {
    return NextResponse.json(
      { error: "Slug could not be generated. Use letters and numbers." },
      { status: 400 }
    );
  }

  const order = Number(body.sort_order);
  const sortOrder = Number.isFinite(order) && order > 0 ? order : null;

  try {
    const pool = getPool();
    await pool.query(
      `UPDATE feature_posts SET
         title=?, slug=?, description=?, content=?, category=?, icon=?,
         image_url=?, image_alt=?, href=?, is_featured=?, is_published=?
         ${sortOrder === null ? "" : ", sort_order=?"}
       WHERE id=?`,
      sortOrder === null
        ? [
            post.title,
            post.slug,
            post.description ?? null,
            post.content ?? null,
            post.category ?? null,
            post.icon ?? null,
            post.image_url ?? null,
            post.image_alt ?? null,
            post.href ?? null,
            post.is_featured,
            post.is_published,
            id,
          ]
        : [
            post.title,
            post.slug,
            post.description ?? null,
            post.content ?? null,
            post.category ?? null,
            post.icon ?? null,
            post.image_url ?? null,
            post.image_alt ?? null,
            post.href ?? null,
            post.is_featured,
            post.is_published,
            sortOrder,
            id,
          ]
    );

    return NextResponse.json({ ok: true, slug: post.slug });
  } catch (err) {
    if (isDuplicateSlug(err)) {
      return NextResponse.json(
        { error: `The slug "${post.slug}" is already used by another feature post.` },
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
  if (!id) return NextResponse.json({ error: "Feature post id required" }, { status: 400 });

  const pool = getPool();
  await pool.query("DELETE FROM feature_posts WHERE id = ?", [id]);

  // Close the gap so the remaining cards stay in a tidy order.
  const [rows] = await pool.query<FeaturePostRow[]>(
    "SELECT id FROM feature_posts ORDER BY sort_order ASC, id ASC"
  );
  for (const [index, row] of rows.entries()) {
    await pool.query("UPDATE feature_posts SET sort_order = ? WHERE id = ?", [index + 1, row.id]);
  }

  return NextResponse.json({ ok: true });
}
