import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { toPublicPlan, type PricingPlanRow } from "@/lib/pricingPlans";

/**
 * Public, unauthenticated read API consumed by the Client (marketing) app.
 *
 * Only published packages are returned, in display order. The pricing page
 * renders this alongside the page copy from `/api/public/content/pricing`, and
 * the home teaser reuses the same list.
 */
export async function GET() {
  try {
    const [rows] = await getPool().query<PricingPlanRow[]>(
      "SELECT * FROM pricing_plans WHERE is_published = 1 ORDER BY sort_order ASC, id ASC"
    );

    return NextResponse.json(
      { plans: rows.map(toPublicPlan), updatedAt: new Date().toISOString() },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          // Admin edits should show up on the marketing site right away.
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch {
    // The client falls back to its built-in packages, so a database outage
    // should degrade to a working site rather than a 500.
    return NextResponse.json(
      { error: "Pricing service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
