import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const pool = getPool();

  const [pages] = await pool.query<RowDataPacket[]>(
    "SELECT id, slug, title, status FROM pages WHERE slug = ? AND status = 'published' LIMIT 1",
    [slug]
  );
  const page = pages[0];
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [sections] = await pool.query<RowDataPacket[]>(
    `SELECT section_key, heading, subheading, body, cta_label, cta_href, image_url, extra_json, sort_order
     FROM page_sections WHERE page_id = ? ORDER BY sort_order ASC`,
    [page.id]
  );

  return NextResponse.json(
    { page, sections },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
