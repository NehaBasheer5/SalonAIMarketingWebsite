import { NextResponse } from "next/server";
import { getPool, ResultSetHeader } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { readPlanBody, toPublicPlan, type PricingPlanRow } from "@/lib/pricingPlans";

/** Editable package columns; `sort_order` is appended per request. */
const COLUMNS = `name, icon, monthly, annual, billed, billed_monthly, short_desc, description,
   features_json, image_url, image_alt, is_featured, badge, cta_label, cta_href, is_published`;

/**
 * Pricing package CRUD for Admin -> Pricing.
 *
 * Page copy around the packages (hero, comparison, banner, FAQ) is a separate
 * concern and stays in `page_sections` under Pages -> Pricing.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await getPool().query<PricingPlanRow[]>(
    "SELECT * FROM pricing_plans ORDER BY sort_order ASC, id ASC"
  );
  return NextResponse.json({ plans: rows.map(toPublicPlan) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const plan = readPlanBody(body);
  if (!plan.name) return NextResponse.json({ error: "Plan name required" }, { status: 400 });

  const pool = getPool();

  // The editor can reorder by sending the whole visible order; otherwise the new
  // package goes to the end.
  const order = Number(body.sort_order);
  let sortOrder = Number.isFinite(order) && order > 0 ? order : null;
  if (sortOrder === null) {
    const [[{ max }]] = await pool.query<any[]>("SELECT COALESCE(MAX(sort_order), 0) AS max FROM pricing_plans");
    sortOrder = Number(max) + 1;
  }

  // Only one package is highlighted at a time.
  if (plan.is_featured) {
    await pool.query("UPDATE pricing_plans SET is_featured = 0 WHERE is_featured = 1");
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO pricing_plans (${COLUMNS}, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      plan.name,
      plan.icon ?? null,
      plan.monthly,
      plan.annual,
      plan.billed ?? null,
      plan.billed_monthly ?? null,
      plan.short_desc ?? null,
      plan.description ?? null,
      plan.features_json,
      plan.image_url ?? null,
      plan.image_alt ?? null,
      plan.is_featured,
      plan.badge ?? null,
      plan.cta_label,
      plan.cta_href,
      plan.is_published,
      sortOrder,
    ]
  );

  return NextResponse.json({ id: result.insertId });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "Plan id required" }, { status: 400 });

  const plan = readPlanBody(body);
  if (!plan.name) return NextResponse.json({ error: "Plan name required" }, { status: 400 });

  const pool = getPool();
  const order = Number(body.sort_order);
  if (plan.is_featured) {
    await pool.query("UPDATE pricing_plans SET is_featured = 0 WHERE is_featured = 1 AND id <> ?", [id]);
  }

  const sortOrder = Number.isFinite(order) && order > 0 ? order : null;

  await pool.query(
    `UPDATE pricing_plans SET
       name=?, icon=?, monthly=?, annual=?, billed=?, billed_monthly=?, short_desc=?,
       description=?, features_json=?, image_url=?, image_alt=?, is_featured=?, badge=?,
       cta_label=?, cta_href=?, is_published=?
       ${sortOrder === null ? "" : ", sort_order=?"}
     WHERE id=?`,
    sortOrder === null
      ? [
          plan.name,
          plan.icon ?? null,
          plan.monthly,
          plan.annual,
          plan.billed ?? null,
          plan.billed_monthly ?? null,
          plan.short_desc ?? null,
          plan.description ?? null,
          plan.features_json,
          plan.image_url ?? null,
          plan.image_alt ?? null,
          plan.is_featured,
          plan.badge ?? null,
          plan.cta_label,
          plan.cta_href,
          plan.is_published,
          id,
        ]
      : [
          plan.name,
          plan.icon ?? null,
          plan.monthly,
          plan.annual,
          plan.billed ?? null,
          plan.billed_monthly ?? null,
          plan.short_desc ?? null,
          plan.description ?? null,
          plan.features_json,
          plan.image_url ?? null,
          plan.image_alt ?? null,
          plan.is_featured,
          plan.badge ?? null,
          plan.cta_label,
          plan.cta_href,
          plan.is_published,
          sortOrder,
          id,
        ]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Plan id required" }, { status: 400 });

  const pool = getPool();
  await pool.query("DELETE FROM pricing_plans WHERE id = ?", [id]);

  // Close the gap so the remaining packages stay in a tidy order.
  const [rows] = await pool.query<PricingPlanRow[]>(
    "SELECT id FROM pricing_plans ORDER BY sort_order ASC, id ASC"
  );
  for (const [index, row] of rows.entries()) {
    await pool.query("UPDATE pricing_plans SET sort_order = ? WHERE id = ?", [index + 1, row.id]);
  }

  return NextResponse.json({ ok: true });
}
