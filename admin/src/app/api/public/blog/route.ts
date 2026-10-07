import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";

/**
 * Public, unauthenticated blog feed consumed by the Client (marketing) app.
 *
 * Only published posts are returned. The list omits `content` so the blog index
 * stays small; the single post endpoint below serves the article body.
 *
 * `limit` and `category` are optional query params.
 */
const DEFAULT_LIMIT = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "").trim();

  // `Number(null)` is 0, not NaN, so an absent `limit` has to be detected before
  // the clamp or it silently becomes `LIMIT 1`.
  const rawLimit = searchParams.get("limit");
  const requestedLimit = rawLimit === null ? Number.NaN : Number(rawLimit);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 100)
    : DEFAULT_LIMIT;

  try {
    const where = ["status = 'published'"];
    const params: unknown[] = [];

    if (category) {
      where.push("category = ?");
      params.push(category);
    }

    params.push(limit);

    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT id, title, slug, excerpt, cover_image, cover_video, category, author, author_image, tags,
              read_time, is_featured, view_count, published_at
         FROM blog_posts
        WHERE ${where.join(" AND ")}
        ORDER BY is_featured DESC, published_at DESC, id DESC
        LIMIT ?`,
      params
    );

    // Category chips are generated from what actually exists, so the Client
    // never offers a filter that returns nothing.
    const [categoryRows] = await getPool().query<RowDataPacket[]>(
      `SELECT category, COUNT(*) AS total
         FROM blog_posts
        WHERE status = 'published' AND category IS NOT NULL AND category <> ''
        GROUP BY category
        ORDER BY total DESC, category ASC`
    );

    return NextResponse.json(
      {
        posts: rows,
        categories: categoryRows.map((row) => ({
          name: row.category,
          count: Number(row.total ?? 0),
        })),
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          // Admin edits should show up on the marketing site right away.
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    // The Client falls back to built-in articles, so a database outage should
    // degrade to a working site rather than a 500.
    return NextResponse.json(
      { error: "Blog service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}