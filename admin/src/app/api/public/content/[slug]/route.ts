import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

/**
 * Public, unauthenticated read API consumed by the Client (marketing) app.
 *
 * Each section is returned as a flat `content` object: the dedicated
 * page_sections columns are merged with everything inside `extra_json`, so the
 * client can spread it straight over its built-in defaults.
 */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;

  try {
    const pool = getPool();

    const [pages] = await pool.query<RowDataPacket[]>(
      "SELECT id, slug, title, status FROM pages WHERE slug = ? AND status = 'published' LIMIT 1",
      [slug]
    );
    const page = pages[0];
    if (!page) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [sections] = await pool.query<RowDataPacket[]>(
      `SELECT section_key, heading, subheading, body, cta_label, cta_href, image_url, extra_json, is_visible, sort_order
       FROM page_sections WHERE page_id = ? ORDER BY sort_order ASC, id ASC`,
      [page.id]
    );

    return NextResponse.json(
      {
        page,
        updatedAt: new Date().toISOString(),
        sections: sections.map((row) => ({
          key: row.section_key,
          sortOrder: Number(row.sort_order ?? 0),
          isVisible: Boolean(row.is_visible),
          content: {
            heading: row.heading ?? "",
            subheading: row.subheading ?? "",
            body: row.body ?? "",
            cta_label: row.cta_label ?? "",
            cta_href: row.cta_href ?? "",
            image_url: row.image_url ?? "",
            ...parseExtra(row.extra_json),
          },
        })),
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
    // The client falls back to its built-in content, so a database outage
    // should degrade to a working site rather than a 500.
    return NextResponse.json(
      { error: "Content service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

function parseExtra(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) return {};
  if (typeof value === "object") return value as Record<string, unknown>;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
