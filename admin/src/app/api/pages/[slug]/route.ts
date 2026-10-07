import { NextResponse } from "next/server";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const pool = getPool();
  const [pages] = await pool.query<RowDataPacket[]>(
    "SELECT id, slug, title, status, updated_at FROM pages WHERE slug = ? LIMIT 1",
    [slug]
  );
  const page = pages[0];
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const [sections] = await pool.query<RowDataPacket[]>(
    `SELECT id, section_key, heading, subheading, body, cta_label, cta_href, image_url, extra_json, is_visible, sort_order
     FROM page_sections WHERE page_id = ? ORDER BY sort_order ASC, id ASC`,
    [page.id]
  );

  return NextResponse.json({
    page,
    sections: sections.map((row) => ({ ...row, extra: parseExtra(row.extra_json) })),
  });
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

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const body = await request.json();
  const pool = getPool();

  const [pages] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM pages WHERE slug = ? LIMIT 1",
    [slug]
  );
  const page = pages[0];
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  if (body.title || body.status) {
    await pool.query("UPDATE pages SET title = COALESCE(?, title), status = COALESCE(?, status) WHERE id = ?", [
      body.title ?? null,
      body.status ?? null,
      page.id,
    ]);
  }

  if (Array.isArray(body.sections)) {
    for (const section of body.sections) {
      if (!section.id) continue;

      // extra_json holds the structured content (feature lists, pricing plans,
      // testimonials, ...) so it has to round-trip on every save.
      const extra =
        section.extra && typeof section.extra === "object" ? JSON.stringify(section.extra) : null;

      await pool.query<ResultSetHeader>(
        `UPDATE page_sections SET
          heading = ?,
          subheading = ?,
          body = ?,
          cta_label = ?,
          cta_href = ?,
          image_url = ?,
          extra_json = ?,
          is_visible = ?,
          sort_order = ?
         WHERE id = ? AND page_id = ?`,
        [
          section.heading || null,
          section.subheading || null,
          section.body || null,
          section.cta_label || null,
          section.cta_href || null,
          section.image_url || null,
          extra,
          section.is_visible === false || section.is_visible === 0 ? 0 : 1,
          Number(section.sort_order || 0),
          section.id,
          page.id,
        ]
      );
    }
  }

  return NextResponse.json({ ok: true });
}
