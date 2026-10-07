import { NextResponse } from "next/server";
import { getPool, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * Unread enquiry count for the sidebar badge.
 *
 * Kept separate from `GET /api/enquiries` so the shell can poll it cheaply
 * without loading every enquiry row.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [[row]] = await getPool().query<RowDataPacket[]>(
    "SELECT COUNT(*) AS total FROM enquiries WHERE status = 'new'"
  );

  return NextResponse.json({ new: Number(row?.total ?? 0) });
}
