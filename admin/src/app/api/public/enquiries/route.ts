import { NextResponse } from "next/server";
import { getPool, ResultSetHeader } from "@/lib/db";

/**
 * Public endpoint used by the marketing site's contact and demo forms.
 *
 * Lives under `/api/public` so the auth middleware lets it through without a
 * session. It is deliberately write-only and tightly capped.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const LIMITS = { name: 160, email: 191, phone: 60, subject: 160, message: 5000 };
const ALLOWED_SOURCES = ["contact", "request-demo", "newsletter"];

/** Simple per-process throttle. Resets on restart, good enough to blunt casual spam. */
const recent = new Map<string, number>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function throttled(key: string) {
  const now = Date.now();
  const last = recent.get(key);
  if (last !== undefined && now - last < WINDOW_MS) {
    recent.set(key, now);
    return true;
  }
  recent.set(key, now);
  // Keep the map from growing without bound on a long lived process.
  if (recent.size > 5000) {
    for (const [k, v] of recent) if (now - v > WINDOW_MS) recent.delete(k);
  }
  return false;
}

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Honeypot: real users never see this field, so anything in it is a bot.
    if (clean(body.website, 200)) {
      return NextResponse.json({ ok: true }, { status: 201, headers: CORS_HEADERS });
    }

    const name = clean(body.name, LIMITS.name);
    const email = clean(body.email, LIMITS.email).toLowerCase();
    const phone = clean(body.phone, LIMITS.phone);
    const subject = clean(body.subject, LIMITS.subject);
    const message = String(body.message ?? "")
      .replace(/\r\n/g, "\n")
      .trim()
      .slice(0, LIMITS.message);
    const source = ALLOWED_SOURCES.includes(String(body.source))
      ? String(body.source)
      : "contact";

    const errors: string[] = [];
    // A newsletter signup only collects an email address, so it is held to a
    // looser bar than a contact or demo enquiry.
    if (source === "newsletter") {
      if (!isEmail(email)) errors.push("email");
    } else {
      if (!name) errors.push("name");
      if (!isEmail(email)) errors.push("email");
      if (!message) errors.push("message");
    }
    if (errors.length) {
      return NextResponse.json(
        { error: "Please check the highlighted fields", fields: errors },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    if (ip && throttled(ip)) {
      return NextResponse.json(
        {
          error:
            source === "newsletter"
              ? "Too many attempts. Please try again shortly."
              : "Too many messages. Please try again shortly.",
        },
        { status: 429, headers: CORS_HEADERS }
      );
    }

    const [result] = await getPool().query<ResultSetHeader>(
      `INSERT INTO enquiries (name, email, phone, subject, message, source, status, ip)
       VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
      [
        // A subscriber has no name, so the address stands in as the label.
        name || email,
        email,
        phone || null,
        subject || (source === "newsletter" ? "Newsletter signup" : null),
        message || "Subscribed to the blog newsletter.",
        source,
        ip,
      ]
    );

    return NextResponse.json({ ok: true, id: result.insertId }, { status: 201, headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}