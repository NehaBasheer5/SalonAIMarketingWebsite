import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, question, answer, category, sort_order FROM faqs WHERE is_published = 1 ORDER BY sort_order ASC, id ASC"
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
  } catch (e) {
    return NextResponse.json(
      { faqs: [] },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
