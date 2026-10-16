import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";
import { ensureFaqsSchema } from "@/lib/faqsStore";

export async function GET() {
  try {
    const pool = getPool();
    await ensureFaqsSchema();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, question, answer, category, sort_order, show_on_home, created_at FROM faqs WHERE is_published = 1 ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(
      { faqs: rows },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { faqs: [] },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
