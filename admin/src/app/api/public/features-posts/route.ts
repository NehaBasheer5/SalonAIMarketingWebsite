import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { toPublicFeaturePost, type FeaturePostRow } from "@/lib/featurePosts";

/**
 * Public, unauthenticated read API consumed by the Client (marketing) app.
 *
 * Only published feature cards are returned, in display order. The features page
 * renders this grid alongside the page copy from `/api/public/content/features`.
 */
export async function GET() {
  try {
    const [rows] = await getPool().query<FeaturePostRow[]>(
      "SELECT * FROM feature_posts WHERE is_published = 1 ORDER BY sort_order ASC, id ASC"
    );

    return NextResponse.json(
      { posts: rows.map(toPublicFeaturePost), updatedAt: new Date().toISOString() },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          // Admin edits should show up on the marketing site right away.
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    // The client falls back to its built-in cards, so a database outage should
    // degrade to a working site rather than a 500.
    return NextResponse.json(
      { error: "Features service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
