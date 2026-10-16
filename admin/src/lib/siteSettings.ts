/**
 * Site-wide settings shared by the Admin editor and the API routes.
 *
 * This module is free of server-only imports so the settings editor (a client
 * component) and the route handlers can both import it. The values are stored
 * as one JSON object in the `site_settings` table and served to the marketing
 * site through `/api/public/settings`, where they drive the navbar logo, the
 * navigation links and the header action buttons.
 */

export type NavItem = {
  label: string;
  href: string;
  is_visible: boolean;
};

export type SiteSettings = {
  /** Uploaded logo shown in the navbar; blank falls back to the brand wordmark. */
  logo_url: string;
  logo_alt: string;
  /** Wordmark split in two so the accent word keeps its gold treatment. */
  brand_name: string;
  brand_accent: string;
  tagline: string;
  /** Navigation links, in the order they appear. */
  nav_items: NavItem[];
  /** Secondary header action, e.g. Login. */
  secondary_label: string;
  secondary_href: string;
  /** Primary header action, e.g. Get Started. */
  cta_label: string;
  cta_href: string;
};

export const defaultSiteSettings: SiteSettings = {
  logo_url: "",
  logo_alt: "",
  brand_name: "Salon",
  brand_accent: "AI",
  tagline: "Manage. Grow. Shine.",
  nav_items: [
    { label: "Home", href: "/", is_visible: true },
    { label: "Features", href: "/features", is_visible: true },
    { label: "For Business", href: "/about", is_visible: true },
    { label: "Pricing", href: "/pricing", is_visible: true },
    { label: "Blog", href: "/blog", is_visible: true },
    { label: "FAQ", href: "/faq", is_visible: true },
    { label: "Contact", href: "/contact", is_visible: true },
  ],
  secondary_label: "Login",
  secondary_href: "/login",
  cta_label: "Get Started",
  cta_href: "/request-demo",
};

function str(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

/** Keeps only well formed nav entries, so a bad payload cannot break the navbar. */
export function readNavItems(value: unknown): NavItem[] {
  if (!Array.isArray(value)) return [];
  const items: NavItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const raw = entry as Record<string, unknown>;
    const label = str(raw.label).trim();
    const href = str(raw.href).trim();
    if (!label && !href) continue;
    items.push({ label, href, is_visible: raw.is_visible !== false });
  }
  return items;
}

/**
 * Overlays a stored payload over the defaults, filling anything missing so the
 * editor and the marketing site always receive a complete settings object.
 */
export function normalizeSiteSettings(value: unknown): SiteSettings {
  const raw =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const navItems = readNavItems(raw.nav_items);

  return {
    logo_url: str(raw.logo_url, defaultSiteSettings.logo_url),
    logo_alt: str(raw.logo_alt, defaultSiteSettings.logo_alt),
    brand_name: str(raw.brand_name, defaultSiteSettings.brand_name),
    brand_accent: str(raw.brand_accent, defaultSiteSettings.brand_accent),
    tagline: str(raw.tagline, defaultSiteSettings.tagline),
    // An empty stored list is a real answer (the admin removed every link), so
    // only a missing list falls back to the defaults.
    nav_items: Array.isArray(raw.nav_items) ? navItems : defaultSiteSettings.nav_items,
    secondary_label: str(raw.secondary_label, defaultSiteSettings.secondary_label),
    secondary_href: str(raw.secondary_href, defaultSiteSettings.secondary_href),
    cta_label: str(raw.cta_label, defaultSiteSettings.cta_label),
    cta_href: str(raw.cta_href, defaultSiteSettings.cta_href),
  };
}

/** Parses a `data_json` column that may arrive as a string or an object. */
export function parseSettingsJson(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}
