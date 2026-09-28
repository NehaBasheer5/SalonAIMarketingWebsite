import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.slug, p.title, p.status, p.updated_at,
            COUNT(s.id) AS section_count
     FROM pages p
     LEFT JOIN page_sections s ON s.page_id = p.id
     GROUP BY p.id
     ORDER BY p.title ASC`
  );
  return NextResponse.json({ pages: rows });
}
