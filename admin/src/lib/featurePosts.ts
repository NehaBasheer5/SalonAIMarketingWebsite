import type { RowDataPacket } from "@/lib/db";

function slugify(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * A feature post row, shaped for the marketing site.
 *
 * `slug` is the detail page URL (`/features/<slug>`), and `content` is the
 * markdown body rendered there. Optional fields stay absent rather than
 * becoming empty strings so the Client falls back to its defaults.
 */
export type PublicFeaturePost = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  category?: string;
  icon?: string;
  image_url?: string;
  image_alt?: string;
  href?: string;
  sort_order: number;
  featured: boolean;
};

/** Row shape returned by `SELECT * FROM feature_posts`. */
export type FeaturePostRow = RowDataPacket & {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  image_alt: string | null;
  href: string | null;
  sort_order: number;
  is_featured: number;
  is_published: number;
};

/** Optional fields stay absent rather than becoming empty strings. */
function optional(value: string | null | undefined): string | undefined {
  const text = (value ?? "").trim();
  return text ? text : undefined;
}

export function toPublicFeaturePost(row: FeaturePostRow): PublicFeaturePost {
  return {
    id: Number(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    description: optional(row.description),
    content: optional(row.content),
    category: optional(row.category),
    icon: optional(row.icon),
    image_url: optional(row.image_url),
    image_alt: optional(row.image_alt),
    href: optional(row.href),
    sort_order: Number(row.sort_order ?? 0),
    featured: Number(row.is_featured ?? 0) === 1,
  };
}

/**
 * Coerces the editor payload into column values. The slug falls back to the
 * title so a card always has a detail page, and `sort_order` is assigned by the
 * caller from the current row order.
 */
export function readFeaturePostBody(body: Record<string, unknown>) {
  const title = String(body.title || "").trim();

  return {
    title,
    slug: slugify(String(body.slug || title)),
    description: optional(String(body.description ?? "")),
    content: optional(String(body.content ?? "")),
    category: optional(String(body.category ?? "")),
    icon: optional(String(body.icon ?? "")),
    image_url: optional(String(body.image_url ?? "")),
    image_alt: optional(String(body.image_alt ?? "")),
    href: optional(String(body.href ?? "")),
    is_featured: body.is_featured ? 1 : 0,
    is_published: body.is_published === false ? 0 : 1,
  };
}

export type FeaturePostColumns = ReturnType<typeof readFeaturePostBody>;
