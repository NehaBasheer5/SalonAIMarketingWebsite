import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { toPublicFeaturePost, type FeaturePostRow } from "@/lib/featurePosts";

type Params = { params: Promise<{ slug: string }> };

/**
 * Public, unauthenticated single feature endpoint consumed by the Client.
 *
 * Drafts are invisible here, so an unpublished card never leaks. Includes the
 * markdown `content` that powers the detail page plus a few sibling cards for
 * the "explore more" block at the foot of that page.
 */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;

  try {
    const pool = getPool();

    const [rows] = await pool.query<FeaturePostRow[]>(
      "SELECT * FROM feature_posts WHERE slug = ? AND is_published = 1 LIMIT 1",
      [slug]
    );

    const post = rows[0];
    if (!post) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    const [related] = await pool.query<FeaturePostRow[]>(
      `SELECT * FROM feature_posts
        WHERE is_published = 1 AND id <> ?
        ORDER BY (category = ?) DESC, sort_order ASC, id ASC
        LIMIT 3`,
      [post.id, post.category ?? ""]
    );

    return NextResponse.json(
      { post: toPublicFeaturePost(post), related: related.map(toPublicFeaturePost) },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          // Admin edits should show up on the marketing site right away.
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    // The client falls back to a working site rather than a 500.
    return NextResponse.json(
      { error: "Features service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
