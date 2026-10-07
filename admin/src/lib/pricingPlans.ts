import type { RowDataPacket } from "@/lib/db";

/**
 * A pricing package row, shaped for the marketing site.
 *
 * `monthly`/`annual` are display strings ("$49", "Custom") rather than numbers,
 * and the short description is stored as `short_desc` because `desc` is a
 * reserved word. Both renames are undone here so the Client keeps reading the
 * same `PricingPlan` shape it always has.
 */
export type PublicPricingPlan = {
  id: number;
  name: string;
  icon?: string;
  monthly: string;
  annual: string;
  billed?: string;
  billedMonthly?: string;
  desc?: string;
  description?: string;
  features: string[];
  image_url?: string;
  image_alt?: string;
  featured: boolean;
  badge?: string;
  cta: string;
  cta_href: string;
};

/** Row shape returned by `SELECT * FROM pricing_plans`. */
export type PricingPlanRow = RowDataPacket & {
  id: number;
  name: string;
  icon: string | null;
  monthly: string;
  annual: string;
  billed: string | null;
  billed_monthly: string | null;
  short_desc: string | null;
  description: string | null;
  features_json: unknown;
  image_url: string | null;
  image_alt: string | null;
  is_featured: number;
  badge: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
  is_published: number;
};

export function parseFeatures(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (value === null || value === undefined) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

/** Optional fields stay absent rather than becoming empty strings. */
function optional(value: string | null | undefined): string | undefined {
  const text = (value ?? "").trim();
  return text ? text : undefined;
}

export function toPublicPlan(row: PricingPlanRow): PublicPricingPlan {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    icon: optional(row.icon),
    monthly: String(row.monthly ?? ""),
    annual: String(row.annual ?? ""),
    billed: optional(row.billed),
    billedMonthly: optional(row.billed_monthly),
    desc: optional(row.short_desc),
    description: optional(row.description),
    features: parseFeatures(row.features_json),
    image_url: optional(row.image_url),
    image_alt: optional(row.image_alt),
    featured: Boolean(row.is_featured),
    badge: optional(row.badge),
    cta: optional(row.cta_label) ?? "Get Started",
    cta_href: optional(row.cta_href) ?? "/request-demo",
  };
}

/**
 * Coerces the editor payload into column values. `sort_order` is assigned by the
 * caller from the current row order, and prices stay text on purpose.
 */
export function readPlanBody(body: Record<string, unknown>) {
  return {
    name: String(body.name || "").trim(),
    icon: optional(String(body.icon ?? "")),
    monthly: String(body.monthly ?? "").trim(),
    annual: String(body.annual ?? "").trim(),
    billed: optional(String(body.billed ?? "")),
    billed_monthly: optional(String(body.billedMonthly ?? "")),
    short_desc: optional(String(body.desc ?? "")),
    description: optional(String(body.description ?? "")),
    features_json: JSON.stringify(
      Array.isArray(body.features) ? body.features.map((f) => String(f)).filter(Boolean) : []
    ),
    image_url: optional(String(body.image_url ?? "")),
    image_alt: optional(String(body.image_alt ?? "")),
    is_featured: body.featured ? 1 : 0,
    badge: optional(String(body.badge ?? "")),
    cta_label: optional(String(body.cta ?? "")) ?? "Get Started",
    cta_href: optional(String(body.cta_href ?? "")) ?? "/request-demo",
    is_published: body.is_published === false ? 0 : 1,
  };
}

export type PlanColumns = ReturnType<typeof readPlanBody>;
