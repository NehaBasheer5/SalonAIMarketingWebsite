import { NextResponse } from "next/server";
import { defaultSiteSettings } from "@/lib/siteSettings";
import { loadSiteSettings } from "@/lib/siteSettingsStore";

/**
 * Public, unauthenticated read API consumed by the Client (marketing) app to
 * render the navbar logo, navigation links and header action buttons.
 *
 * The client merges the payload over its own defaults, so a database outage
 * degrades to the built-in navigation rather than an error.
 */
export async function GET() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    // Admin edits should show up on the marketing site right away.
    "Cache-Control": "no-store, max-age=0",
  };

  try {
    return NextResponse.json({ settings: await loadSiteSettings() }, { headers });
  } catch {
    return NextResponse.json({ settings: defaultSiteSettings }, { headers });
  }
}
