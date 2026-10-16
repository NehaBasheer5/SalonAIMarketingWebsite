import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { normalizeSiteSettings } from "@/lib/siteSettings";
import { loadSiteSettings, saveSiteSettings } from "@/lib/siteSettingsStore";

/**
 * Site-wide settings for Admin -> Settings: navbar logo, brand text,
 * navigation links and the header action buttons.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ settings: await loadSiteSettings() });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }

  const settings = normalizeSiteSettings(body);
  await saveSiteSettings(settings);
  return NextResponse.json({ settings });
}
