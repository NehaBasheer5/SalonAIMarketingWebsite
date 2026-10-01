import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getPool, ResultSetHeader, RowDataPacket } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ALLOWED_KINDS, isVideoMime, maxBytesFor, resolveMediaType } from "@/lib/media";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, filename, original_name, url, alt_text, mime_type, size_bytes, created_at FROM media ORDER BY id DESC"
  );
  return NextResponse.json({ media: rows });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const altText = String(form.get("alt_text") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const resolvedType = resolveMediaType(file.type, file.name);
  if (!resolvedType) {
    return NextResponse.json(
      { error: `Unsupported file type. Upload ${ALLOWED_KINDS}.` },
      { status: 400 }
    );
  }

  const { mime, ext } = resolvedType;
  const maxBytes = maxBytesFor(mime);
  const kind = isVideoMime(mime) ? "Video" : "Image";
  const maxMb = Math.round(maxBytes / (1024 * 1024));

  if (file.size > maxBytes) {
    return NextResponse.json({ error: `${kind} is larger than ${maxMb} MB` }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > maxBytes) {
    return NextResponse.json({ error: `${kind} is larger than ${maxMb} MB` }, { status: 400 });
  }

  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, storedName), bytes);

  const url = `/uploads/${storedName}`;
  const pool = getPool();
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO media (filename, original_name, url, alt_text, mime_type, size_bytes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [storedName, file.name, url, altText || null, mime, bytes.length]
  );

  return NextResponse.json({
    media: {
      id: result.insertId,
      filename: storedName,
      original_name: file.name,
      url,
      alt_text: altText,
      mime_type: mime,
      size_bytes: bytes.length,
    },
  });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const pool = getPool();
  const [rows] = await pool.query<RowDataPacket[]>("SELECT filename FROM media WHERE id = ? LIMIT 1", [id]);
  const item = rows[0];
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await pool.query("DELETE FROM media WHERE id = ?", [id]);
  try {
    await fs.unlink(path.join(process.cwd(), "public", "uploads", item.filename));
  } catch {
    // ignore missing file
  }

  return NextResponse.json({ ok: true });
}
