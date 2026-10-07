import { NextResponse } from "next/server";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

/**
 * Public, unauthenticated single article endpoint consumed by the Client.
 *
 * Drafts are invisible here, so an unpublished post never leaks. Includes the
 * markdown `content` plus a few sibling articles for the "more from the blog"
 * block at the foot of the article page.
 */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;

  try {
    const pool = getPool();

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, slug, excerpt, content, cover_image, cover_video, category,
              author, author_image, tags, read_time, view_count, published_at
         FROM blog_posts
        WHERE slug = ? AND status = 'published'
        LIMIT 1`,
      [slug]
    );

    const post = rows[0];
    if (!post) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Fire and forget: a failed counter must not break the article.
    pool.query<ResultSetHeader>("UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?", [
      post.id,
    ]).catch(() => undefined);

    const [related] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, slug, excerpt, cover_image, cover_video, category, author, author_image,
              tags, read_time, published_at
         FROM blog_posts
        WHERE status = 'published' AND id <> ?
        ORDER BY (category = ?) DESC, published_at DESC
        LIMIT 3`,
      [post.id, post.category ?? ""]
    );

    return NextResponse.json(
      { post, related, updatedAt: new Date().toISOString() },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Blog service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}