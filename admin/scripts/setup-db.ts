import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

type SeedSection = {
  /** Page this section belongs to. Used for logging, the caller resolves the id. */
  slug: string;
  key: string;
  heading?: string;
  subheading?: string;
  body?: string;
  cta_label?: string;
  cta_href?: string;
  image_url?: string;
  extra?: Record<string, unknown>;
  sort: number;
};

/**
 * Inserts the seed for a section only when it is safe to do so.
 *
 * Keys an admin has already set are never overwritten, so re-running this
 * script adds newly seeded fields (e.g. the comparison rows) without reverting
 * anything that was edited in the admin panel.
 */
async function upsertSection(conn: Connection, pageId: number, seed: SeedSection) {
  const extraJson = seed.extra ? JSON.stringify(seed.extra) : null;
  const [existing] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT id, extra_json FROM page_sections WHERE page_id = ? AND section_key = ? LIMIT 1",
    [pageId, seed.key]
  );

  if (existing.length === 0) {
    await conn.query(
      `INSERT INTO page_sections
        (page_id, section_key, heading, subheading, body, cta_label, cta_href, image_url, extra_json, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pageId,
        seed.key,
        seed.heading || null,
        seed.subheading || null,
        seed.body || null,
        seed.cta_label || null,
        seed.cta_href || null,
        seed.image_url || null,
        extraJson,
        seed.sort,
      ]
    );
    return;
  }

  const row = existing[0];

  // Legacy row from an earlier seed: backfill the full structured content once.
  if (row.extra_json === null || row.extra_json === undefined) {
    await conn.query(
      `UPDATE page_sections
       SET heading = ?, subheading = ?, body = ?, cta_label = ?, cta_href = ?, image_url = ?,
           extra_json = ?, sort_order = ?
       WHERE id = ?`,
      [
        seed.heading || null,
        seed.subheading || null,
        seed.body || null,
        seed.cta_label || null,
        seed.cta_href || null,
        seed.image_url || null,
        extraJson,
        seed.sort,
        row.id,
      ]
    );
    return;
  }

  // Already has structured content, so only add keys the admin has never set.
  // This is what lets a new field appear without wiping existing edits.
  if (!seed.extra) return;
  const current = parseJsonObject(row.extra_json);
  const missing = Object.entries(seed.extra).filter(([key]) => !(key in current));
  if (!missing.length) return;

  const merged = { ...current, ...Object.fromEntries(missing) };
  console.log(`Backfilled ${missing.length} field(s) into ${seed.slug}/${seed.key}`);
  await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
    JSON.stringify(merged),
    row.id,
  ]);
}

/** Reads an `extra_json` column into a plain object, tolerating anything. */
function parseJsonObject(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) return {};
  if (typeof value === "object") return value as Record<string, unknown>;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Drops the `icon` key from every entry of a stored list (benefits, category
 * tabs), since the redesigned layout no longer renders them.
 */
function stripIcons(items: unknown): { items: Record<string, unknown>[]; changed: boolean } {
  if (!Array.isArray(items)) return { items: [], changed: false };
  let changed = false;
  const next = (items as Record<string, unknown>[]).map((item) => {
    if (!item || typeof item !== "object" || !("icon" in item)) return item;
    changed = true;
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      if (key === "icon") continue;
      copy[key] = value;
    }
    return copy;
  });
  return { items: next, changed };
}

/**
 * Keeps the `features` page in step with the redesigned Client page.
 *
 * `upsertSection` only ever adds fields, so this removes what the editor no
 * longer owns: the whole Stats Bar section, the hero image/highlights and the
 * platform showcase image/icons plus the category tab icons that the Client
 * stopped rendering.
 */
async function cleanupFeaturesSections(conn: Connection) {
  // The Stats Bar is no longer part of the features page.
  await conn.query(
    `DELETE ps FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'features' AND ps.section_key = 'stats_bar'`
  );

  // The hero and platform showcase no longer render a media image.
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.image_url = NULL
     WHERE p.slug = 'features' AND ps.section_key IN ('hero', 'platform_showcase')`
  );

  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow", "image_alt", "highlights"],
    feature_grid: ["eyebrow"],
    platform_showcase: ["eyebrow", "image_alt"],
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'features' AND ps.section_key IN ('hero', 'feature_grid', 'platform_showcase')`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    // Benefits are numbered by the layout now, and the category tabs are labels
    // only, so the stored icons go too.
    if (row.section_key === "platform_showcase" && Array.isArray(current.benefits)) {
      const stripped = stripIcons(current.benefits);
      current.benefits = stripped.items;
      changed = stripped.changed || changed;
    }
    if (row.section_key === "feature_grid" && Array.isArray(current.categories)) {
      const stripped = stripIcons(current.categories);
      current.categories = stripped.items;
      changed = stripped.changed || changed;
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the features page sections with the Client layout.");
}

/**
 * Keeps the `about` page in step with the redesigned Client page.
 *
 * The hero, mission and journey sections dropped their
 * eyebrow/highlights/stats/icon fields. `upsertSection` never removes keys, so
 * this prunes existing rows.
 */
async function cleanupAboutSections(conn: Connection) {
  // The Client now renders the team before the journey, so match that order in
  // the editor when the rows still carry the old seed order.
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.sort_order = CASE ps.section_key
       WHEN 'team' THEN 3
       WHEN 'journey' THEN 4
     END
     WHERE p.slug = 'about'
       AND ((ps.section_key = 'team' AND ps.sort_order = 4)
         OR (ps.section_key = 'journey' AND ps.sort_order = 3))`
  );

  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow", "highlights"],
    mission_stats: ["eyebrow", "stats"],
    journey: ["eyebrow"],
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'about' AND ps.section_key IN ('hero', 'mission_stats', 'journey')`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    // Milestones are numbered by the layout now, so the stored icons go too.
    if (row.section_key === "journey" && Array.isArray(current.milestones)) {
      const stripped = stripIcons(current.milestones);
      current.milestones = stripped.items;
      changed = stripped.changed || changed;
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the about page sections with the Client layout.");
}

/**
 * Keeps the `pricing` page in step with the redesigned Client page.
 *
 * The hero dropped its eyebrow and hero media, the FAQ section no longer
 * renders its "view all" link or the CTA eyebrow, and the included-items strip
 * is labels only. `upsertSection` never removes keys, so this prunes existing
 * rows.
 */
async function cleanupPricingSections(conn: Connection) {
  // The hero no longer renders a media image.
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.image_url = NULL
     WHERE p.slug = 'pricing' AND ps.section_key IN ('hero', 'closing_cta')`
  );

  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow", "image_alt"],
    banner: ["title", "subtitle", "cta_label", "cta_href", "secondary_cta_label", "secondary_cta_href", "image_alt"],
    faq_cta: ["link_label", "link_href", "cta_eyebrow"],
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'pricing' AND ps.section_key IN ('hero', 'closing_cta', 'banner', 'faq_cta')`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    // The included-items strip is labels only now, so the stored icons go too.
    if (row.section_key === "banner" && Array.isArray(current.items)) {
      const stripped = stripIcons(current.items);
      current.items = stripped.items;
      changed = stripped.changed || changed;
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the pricing page sections with the Client layout.");
}

/**
 * Keeps the `blog` page in step with the redesigned Client blog page.
 *
 * The index renders Hero, Popular, Categories and Latest only, and the article
 * pages dropped their closing CTA, so the Newsletter and CTA Banner sections
 * (and their orphaned components) are removed. `upsertSection` never removes
 * keys or clears columns, so this also prunes the fields the Client stopped
 * rendering: the hero eyebrow/featured badge, the categories heading, the
 * Latest "view all" link and the Popular subheading.
 */
async function cleanupBlogSections(conn: Connection) {
  // The blog index no longer shows a newsletter box, and the article pages no
  // longer render a closing CTA banner.
  await conn.query(
    `DELETE ps FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'blog' AND ps.section_key IN ('newsletter', 'cta_banner')`
  );

  // Columns the Client no longer renders.
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.heading = NULL
     WHERE p.slug = 'blog' AND ps.section_key = 'categories'`
  );
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.cta_label = NULL, ps.cta_href = NULL
     WHERE p.slug = 'blog' AND ps.section_key = 'latest'`
  );
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.subheading = NULL
     WHERE p.slug = 'blog' AND ps.section_key = 'popular'`
  );

  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow", "featured_label"],
    latest: ["eyebrow"],
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'blog' AND ps.section_key IN ('hero', 'latest')`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the blog page sections with the Client layout.");
}

/**
 * Keeps the `contact` page in step with the redesigned Client contact page.
 *
 * The page ends at the Location & Map section, so the closing CTA banner is
 * gone. The hero keeps its heading, intro line and optional image/video (which
 * falls back to the built-in video), but the eyebrow, badge and quick-contact
 * rows it no longer renders are dropped. `upsertSection` never removes rows,
 * columns or keys, so this prunes them.
 */
async function cleanupContactSections(conn: Connection) {
  await conn.query(
    `DELETE ps FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'contact' AND ps.section_key = 'cta_banner'`
  );

  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow", "heading_accent", "badge", "quick_contacts"],
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'contact' AND ps.section_key = 'hero'`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the contact page sections with the Client layout.");
}

/**
 * Keeps the `faq` page in step with the reworked Client FAQ page.
 *
 * The categories heading dropped its eyebrow and the hero dropped its eyebrow.
 * The hero keeps its media (image or video) field, so that is left untouched.
 * `upsertSection` never removes keys or clears columns, so this prunes the
 * fields the Client stopped rendering.
 */
async function cleanupFaqSections(conn: Connection) {
  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow"],
    categories: ["eyebrow"],
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'faq' AND ps.section_key IN ('hero', 'categories')`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the faq page sections with the Client layout.");
}

/**
 * Keeps the `home` page in step with the current Client home layout.
 *
 * The Client home page no longer renders the eyebrow on most sections (only
 * the CTA banner keeps it), the features "footer note", the testimonials
 * header link, the icons inside the hero / feature / checklist list items, or
 * the CTA banner's secondary button, uploaded image, avatars, trust line and
 * floating stat cards. `upsertSection` never removes rows, columns, keys or
 * list-item fields, so this prunes them.
 */
async function cleanupHomeSections(conn: Connection) {
  // Columns the Client no longer renders.
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.image_url = NULL
     WHERE p.slug = 'home' AND ps.section_key = 'cta_banner'`
  );
  await conn.query(
    `UPDATE page_sections ps
     JOIN pages p ON p.id = ps.page_id
     SET ps.cta_label = NULL, ps.cta_href = NULL
     WHERE p.slug = 'home' AND ps.section_key = 'testimonials'`
  );

  const dropKeys: Record<string, string[]> = {
    hero: ["eyebrow"],
    features_overview: ["eyebrow", "footer_note"],
    product_preview: ["eyebrow"],
    pricing: ["eyebrow"],
    testimonials: ["eyebrow"],
    mobile_app: ["eyebrow"],
    faq: ["eyebrow"],
    cta_banner: [
      "secondary_cta_label",
      "secondary_cta_href",
      "avatars",
      "trust_text",
      "stat_label",
      "stat_value",
      "stat_delta",
      "stat_note_title",
      "stat_note_body",
    ],
  };

  // Keys the Client stopped reading from within list items.
  const dropItemKeys: Record<string, Record<string, string[]>> = {
    hero: { highlights: ["icon"] },
    features_overview: { features: ["icon"] },
    product_preview: { points: ["icon"] },
    cta_banner: { features: ["icon", "desc"] },
  };

  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.section_key, ps.extra_json
     FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'home'
       AND ps.section_key IN ('hero', 'features_overview', 'product_preview', 'pricing', 'testimonials', 'mobile_app', 'faq', 'cta_banner')`
  );

  for (const row of rows) {
    const current = parseJsonObject(row.extra_json);
    let changed = false;

    for (const key of dropKeys[row.section_key] ?? []) {
      if (key in current) {
        delete current[key];
        changed = true;
      }
    }

    for (const [listKey, itemKeys] of Object.entries(dropItemKeys[row.section_key] ?? {})) {
      const list = current[listKey];
      if (!Array.isArray(list)) continue;
      for (const item of list) {
        if (!item || typeof item !== "object") continue;
        for (const itemKey of itemKeys) {
          if (itemKey in item) {
            delete (item as Record<string, unknown>)[itemKey];
            changed = true;
          }
        }
      }
    }

    if (!changed) continue;
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      JSON.stringify(current),
      row.id,
    ]);
  }

  console.log("Synced the home page sections with the Client layout.");
}

function slugify(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

loadEnvLocal();

type Connection = mysql.Connection;

async function ensureColumn(
  conn: Connection,
  table: string,
  column: string,
  definition: string
) {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
    [table, column]
  );
  if (rows.length === 0) {
    await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`Added column ${table}.${column}`);
  }
}

/**
 * Seed packages for a brand new database. Existing installs are left alone:
 * `migratePricingPlans` moves their in-page plans across once.
 */
const PRICING_PLAN_SEED: Array<{
  name: string;
  icon: string;
  monthly: string;
  annual: string;
  billed: string;
  billed_monthly: string;
  desc: string;
  features: string[];
  is_featured: number;
  cta_label: string;
  cta_href: string;
}> = [
  {
    name: "Starter",
    icon: "Send",
    monthly: "$25",
    annual: "$19",
    billed: "Billed annually $228",
    billed_monthly: "Billed monthly",
    desc: "Perfect for small salons just getting started.",
    features: ["Up to 2 Staff", "Booking Management", "Customer Management", "Email Support"],
    is_featured: 0,
    cta_label: "Get Started",
    cta_href: "/request-demo",
  },
  {
    name: "Growth",
    icon: "TrendingUp",
    monthly: "$49",
    annual: "$39",
    billed: "Billed annually $468",
    billed_monthly: "Billed monthly",
    desc: "Great for growing salons and beauty businesses.",
    features: [
      "Up to 10 Staff",
      "Everything in Starter",
      "Advanced Reports",
      "Loyalty Programs",
      "SMS & Email Notifications",
      "Priority Support",
    ],
    is_featured: 1,
    cta_label: "Get Started",
    cta_href: "/request-demo",
  },
  {
    name: "Pro",
    icon: "Crown",
    monthly: "$89",
    annual: "$69",
    billed: "Billed annually $828",
    billed_monthly: "Billed monthly",
    desc: "For large salons & multi-branch businesses.",
    features: [
      "Unlimited Staff",
      "Everything in Growth",
      "Multi-branch Management",
      "Custom Roles & Permissions",
      "24/7 Priority Support",
      "AI Insights & Analytics",
    ],
    is_featured: 0,
    cta_label: "Get Started",
    cta_href: "/request-demo",
  },
  {
    name: "Enterprise",
    icon: "Building2",
    monthly: "Custom",
    annual: "Custom",
    billed: "Let's build the best plan for your business.",
    billed_monthly: "Let's build the best plan for your business.",
    desc: "For large enterprises with custom requirements.",
    features: [
      "Everything in Pro",
      "Dedicated Account Manager",
      "White-label Options",
      "SLA & Custom Integrations",
      "Onboarding & Training",
    ],
    is_featured: 0,
    cta_label: "Contact Sales",
    cta_href: "/contact",
  },
];

async function seedPricingPlans(conn: Connection) {
  const [rows] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS c FROM pricing_plans");
  if (Number(rows[0].c) > 0) {
    console.log("Pricing plans already present, seed skipped.");
    return;
  }
  for (const [index, plan] of PRICING_PLAN_SEED.entries()) {
    await conn.query(
      `INSERT INTO pricing_plans
        (name, icon, monthly, annual, billed, billed_monthly, short_desc, features_json,
         is_featured, cta_label, cta_href, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        plan.name,
        plan.icon,
        plan.monthly,
        plan.annual,
        plan.billed,
        plan.billed_monthly,
        plan.desc,
        JSON.stringify(plan.features),
        plan.is_featured,
        plan.cta_label,
        plan.cta_href,
        index + 1,
      ]
    );
  }
  console.log(`Pricing plans seeded (${PRICING_PLAN_SEED.length}).`);
}

/**
 * Earlier builds stored the packages inside the `pricing_cards` page section's
 * `extra_json.plans` instead of a table. Move them into `pricing_plans` once so
 * the CMS can manage packages from `/pricing`, then drop the now-duplicated
 * JSON copy so the two screens cannot drift apart.
 */
async function migratePricingPlans(conn: Connection) {
  const [sections] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.extra_json
       FROM page_sections ps
       JOIN pages p ON p.id = ps.page_id
      WHERE p.slug = 'pricing' AND ps.section_key = 'pricing_cards'`
  );

  for (const section of sections) {
    const extra = parseJsonObject(section.extra_json) as { plans?: unknown };
    if (!Array.isArray(extra.plans) || extra.plans.length === 0) continue;

    const [existing] = await conn.query<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS c FROM pricing_plans"
    );
    if (Number(existing[0].c) === 0) {
      for (const [index, raw] of (extra.plans as Array<Record<string, unknown>>).entries()) {
        const features = Array.isArray(raw.features) ? raw.features.map(String) : [];
        await conn.query(
          `INSERT INTO pricing_plans
            (name, icon, monthly, annual, billed, billed_monthly, short_desc, description,
             features_json, image_url, image_alt, is_featured, badge, cta_label, cta_href,
             sort_order, is_published)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            String(raw.name || `Plan ${index + 1}`),
            raw.icon ? String(raw.icon) : null,
            String(raw.monthly ?? ""),
            String(raw.annual ?? ""),
            raw.billed ? String(raw.billed) : null,
            raw.billedMonthly ? String(raw.billedMonthly) : null,
            raw.desc ? String(raw.desc) : null,
            raw.description ? String(raw.description) : null,
            JSON.stringify(features),
            raw.image_url ? String(raw.image_url) : null,
            raw.image_alt ? String(raw.image_alt) : null,
            raw.featured ? 1 : 0,
            raw.badge ? String(raw.badge) : null,
            String(raw.cta || raw.cta_label || "Get Started"),
            String(raw.href || raw.cta_href || "/request-demo"),
            index + 1,
          ]
        );
      }
      console.log(`Migrated ${extra.plans.length} pricing plan(s) into pricing_plans.`);
    }

    delete extra.plans;
    const rest = Object.keys(extra);
    await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
      rest.length ? JSON.stringify(extra) : null,
      section.id,
    ]);
    console.log("Removed in-page pricing plans from the pricing_cards section.");
  }
}

/**
 * Feature cards shown on the Client features page for a brand new database.
 * Existing installs are migrated from the in-page list by `migrateFeaturePosts`.
 */
const FEATURE_POST_SEED: Array<{
  title: string;
  description: string;
  /** markdown body rendered on the feature's own detail page */
  content: string;
  category: string;
  icon: string;
  href: string;
}> = [
  {
    title: "Online Booking",
    description: "Let clients book appointments 24/7 with real-time availability and instant confirmation.",
    category: "bookings",
    icon: "Calendar",
    href: "/features/booking",
    content: `## A booking page that works while you sleep

Your clients can reserve an appointment at any hour, from any device. SalonAI shows only the slots that are genuinely available, confirms instantly, and drops the booking straight onto the right staff member's calendar.

### What you can do

- Share a branded booking page with your service menu, staff and live prices
- Offer real-time availability, so no two clients can take the same slot
- Collect a deposit or full payment up front to lock the appointment in
- Let clients reschedule or cancel within the rules you control
- Block time for breaks, holidays and private appointments

### Why it matters

Missed calls and phone tag cost you bookings every day. An always-on booking page captures demand whenever it arrives and turns your calendar into a self-service system.

> Fewer no-shows, less admin and a calendar that fills itself.

### Built for every screen

The booking flow is fully responsive and syncs to the same calendar your team sees at the front desk, so online and walk-in bookings never clash.`,
  },
  {
    title: "Customer Management",
    description: "Store customer profiles, history, preferences, notes and keep relationships stronger.",
    category: "customers",
    icon: "Users",
    href: "/features/customers",
    content: `## Every client, remembered for you

SalonAI keeps a complete profile for each client: contact details, visit history, preferences, allergies, notes and past spend. Your team can deliver a personal experience every single time.

### What you can do

- Store contact details, birthdays and communication preferences
- See a full visit history with services, staff and amounts paid
- Add private notes and tags your team can act on at the chair
- Track loyalty points, memberships and outstanding balances
- Filter clients into segments for targeted marketing

### Why it matters

Clients return to salons that remember them. Having history and preferences one tap away means better recommendations, fewer mistakes and a stronger relationship with every visit.

### Your data, organised

Search, filter and export your client list whenever you need it, and keep everything in sync across branches and devices.`,
  },
  {
    title: "Staff Management",
    description: "Manage staff roles, schedules, commissions and performance in one place.",
    category: "staff",
    icon: "UserCheck",
    href: "/features/staff",
    content: `## Manage your whole team in one place

From rotas and attendance to commissions and performance, SalonAI gives you one clear view of every member of staff.

### What you can do

- Build weekly schedules and shifts for each staff member
- Assign services, working hours and days off
- Track commissions on services and products with your own rules
- Monitor performance, retention and revenue per stylist
- Keep payroll-ready attendance data in one spot

### Why it matters

A well-organised team delivers a better client experience and a healthier bottom line. When everyone knows their schedule and incentives, the whole salon runs smoother.

### Fair, transparent commissions

Set commission structures that match how you reward your team, whether by service, product or revenue tiers, and let SalonAI calculate the rest.`,
  },
  {
    title: "Service Management",
    description: "Organize services, duration, pricing and resources effortlessly.",
    category: "business",
    icon: "Scissors",
    href: "/features/services",
    content: `## Your menu, perfectly organised

Group your services, set realistic durations and prices, and connect each one to the right staff and resources.

### What you can do

- Create service categories and individual treatments
- Set duration, price, tax and buffer time between appointments
- Assign which staff can perform each service
- Bundle services into packages and memberships
- Pause or archive services without losing history

### Why it matters

Accurate durations and pricing keep your calendar honest and your revenue predictable. Clients see exactly what they are booking, and your team never overruns a slot.

### Flexible for every salon

Whether you run quick trims or long colour sessions, services adapt to the way your business actually works.`,
  },
  {
    title: "Payments & Invoices",
    description: "Accept payments, generate invoices and manage refunds securely.",
    category: "business",
    icon: "CreditCard",
    href: "/features/payments",
    content: `## Get paid, simply and securely

Take payments in the salon or online, issue professional invoices, and handle refunds without the paperwork.

### What you can do

- Accept card, cash, mobile wallet and online payments
- Raise invoices and receipts automatically
- Take deposits and pre-payments against a booking
- Process partial payments and refunds
- Track outstanding balances per client

### Why it matters

Smoother payments mean less time at the till and fewer mistakes. Every transaction is recorded, so your daily takings and reports always add up.

### Built-in security

Card data is handled by certified payment providers, so sensitive details never touch your own systems.`,
  },
  {
    title: "Loyalty Programs",
    description: "Build customer loyalty with points, rewards, memberships and special offers.",
    category: "marketing",
    icon: "Gift",
    href: "/features/loyalty",
    content: `## Turn one-off visits into regulars

Reward your clients and keep them coming back with points, memberships and special offers.

### What you can do

- Award points on services and products with flexible rules
- Create tiers, memberships and prepaid packages
- Run promotions, gift cards and referral offers
- Redeem rewards right at the point of sale
- Track which rewards actually drive repeat visits

### Why it matters

Winning a new client costs far more than keeping one. A simple, well-run loyalty programme lifts repeat visits and average spend without extra effort from your team.

### Rewards that feel personal

Because loyalty is tied to each client's profile, your offers always land with the right people.`,
  },
  {
    title: "SMS & Email Notifications",
    description: "Send automated reminders, promotions and personalized messages.",
    category: "marketing",
    icon: "Bell",
    href: "/features/notifications",
    content: `## Stay in touch, automatically

Send the right message at the right time: confirmations, reminders, follow-ups and promotions, all without lifting a finger.

### What you can do

- Confirm bookings instantly by SMS and email
- Send automatic reminders to cut no-shows
- Follow up after visits for reviews and rebooking
- Run targeted campaigns to selected client segments
- Track delivery, opens and responses

### Why it matters

A gentle reminder is often the difference between a full chair and an empty one. Automated messages keep clients informed and engaged around the clock.

### Marketing that respects your clients

Every message is tied to a client's preferences and history, so you reach the people who actually want to hear from you.`,
  },
  {
    title: "Reports & Analytics",
    description: "Get real-time insights and detailed reports to grow your business.",
    category: "reports",
    icon: "BarChart3",
    href: "/features/analytics",
    content: `## Know exactly how your salon is doing

Real-time dashboards and detailed reports turn your day-to-day data into decisions you can act on.

### What you can do

- Track revenue, bookings and occupancy at a glance
- Compare performance by staff, service and branch
- Monitor retention, no-shows and client lifetime value
- See your busiest hours and days
- Export reports for accounting and reviews

### Why it matters

You cannot improve what you cannot measure. Clear insights help you price better, roster smarter and spot problems before they grow.

### Numbers that update live

Reports refresh as your team works, so you always have the current picture instead of yesterday's snapshot.`,
  },
  {
    title: "AI Insights",
    description: "AI-powered recommendations to optimize bookings, staff and services.",
    category: "reports",
    icon: "Sparkles",
    href: "/features/ai",
    content: `## Your salon, with a smart advisor

SalonAI studies your bookings, clients and performance, then turns them into plain-language recommendations.

### What you can do

- Get suggestions to fill quiet hours and reduce no-shows
- Spot clients who are about to drift away
- Find your most profitable services and staff
- Forecast demand for smarter rosters and stock
- Receive timely prompts to rebook and upsell

### Why it matters

Good salons run on intuition; great ones run on insight. AI surfaces the opportunities you would otherwise miss, without adding to your workload.

### Recommendations you can trust

Every insight is based on your own data and explained in simple terms, so you decide what to act on.`,
  },
  {
    title: "Multi-branch Management",
    description: "Manage multiple branches seamlessly from a single dashboard.",
    category: "business",
    icon: "Network",
    href: "/features/multi-branch",
    content: `## Run every location from one login

Whether you have two salons or twenty, manage them all from a single dashboard with shared clients, staff and reporting.

### What you can do

- Add and switch between branches in one place
- Keep client profiles and history shared across locations
- Move staff between branches with the right access
- Compare performance across locations
- Apply consistent pricing and services everywhere

### Why it matters

Growing should not mean juggling separate systems. Unified management keeps standards high and gives you one clear view of the whole business.

### Consistent, yet flexible

Set group-wide defaults, then let each branch fine-tune its own schedule, prices and team.`,
  },
  {
    title: "Roles & Permissions",
    description: "Set custom roles and permissions to keep your data secure and organized.",
    category: "staff",
    icon: "ShieldCheck",
    href: "/features/permissions",
    content: `## Give everyone exactly the access they need

Decide who can see and do what. SalonAI's roles and permissions keep your business secure and your team focused.

### What you can do

- Create custom roles such as owner, manager, stylist and reception
- Grant access per module: bookings, clients, payments, reports and more
- Restrict sensitive areas like pricing and staff data
- Control branch-level access for multi-location teams
- Review and update permissions at any time

### Why it matters

As your team grows, so does the risk of mistakes and data leaks. Clear permissions protect your business while letting each person work without stumbling blocks.

### Secure by design

Every action is tied to a role, so sensitive information stays with the people you trust.`,
  },
  {
    title: "Integrations",
    description: "Connect with your favorite tools like accounting, marketing and payment gateways.",
    category: "integrations",
    icon: "Puzzle",
    href: "/features/integrations",
    content: `## Connect the tools you already use

SalonAI plays nicely with the software that keeps your business running: payments, accounting, marketing and more.

### What you can do

- Sync with payment gateways and card terminals
- Push sales and invoices to your accounting package
- Connect your marketing and messaging platforms
- Link calendars, review sites and social channels
- Use open APIs to build your own connections

### Why it matters

Integration removes double entry and keeps your data consistent everywhere. Your tools work together, so you spend less time copying information and more time serving clients.

### Open and extensible

With a documented API and webhooks, SalonAI grows with your stack rather than holding it back.`,
  },
];

/**
 * Earlier builds stored the feature cards inside the `feature_grid` page
 * section's `extra_json.features` array instead of a table. Move them into
 * `feature_posts` once so the CMS can manage cards from `/features-posts`, then
 * drop the now-duplicated JSON copy so the two screens cannot drift apart.
 */
async function migrateFeaturePosts(conn: Connection) {
  const [sections] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT ps.id, ps.extra_json
       FROM page_sections ps
       JOIN pages p ON p.id = ps.page_id
      WHERE p.slug = 'features' AND ps.section_key = 'feature_grid'`
  );

  for (const section of sections) {
    const extra = parseJsonObject(section.extra_json) as { features?: unknown };
    if (Array.isArray(extra.features)) {
      const [existing] = await conn.query<mysql.RowDataPacket[]>(
        "SELECT COUNT(*) AS c FROM feature_posts"
      );
      if (Number(existing[0].c) === 0 && extra.features.length > 0) {
        const used = await loadUsedFeatureSlugs(conn);
        for (const [index, raw] of (extra.features as Array<Record<string, unknown>>).entries()) {
          const title = String(raw.title || `Feature ${index + 1}`);
          await conn.query(
            `INSERT INTO feature_posts
              (title, slug, description, category, icon, href, sort_order, is_published)
             VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
            [
              title,
              uniqueSlug(slugify(title) || `feature-${index + 1}`, used),
              raw.description ? String(raw.description) : null,
              raw.category ? String(raw.category) : null,
              raw.icon ? String(raw.icon) : null,
              raw.href ? String(raw.href) : null,
              index + 1,
            ]
          );
        }
        console.log(`Migrated ${extra.features.length} feature post(s) into feature_posts.`);
      }

      delete extra.features;
      const rest = Object.keys(extra);
      await conn.query("UPDATE page_sections SET extra_json = ? WHERE id = ?", [
        rest.length ? JSON.stringify(extra) : null,
        section.id,
      ]);
      console.log("Removed in-page feature cards from the feature_grid section.");
    }
  }
}

/** Seeds the built-in feature cards for a brand new database. */
async function seedFeaturePosts(conn: Connection) {
  const [rows] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS c FROM feature_posts");
  if (Number(rows[0].c) > 0) {
    console.log("Feature posts already present, seed skipped.");
    return;
  }
  const used = await loadUsedFeatureSlugs(conn);
  for (const [index, post] of FEATURE_POST_SEED.entries()) {
    await conn.query(
      `INSERT INTO feature_posts (title, slug, description, content, category, icon, href, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        post.title,
        uniqueSlug(slugify(post.title) || `feature-${index + 1}`, used),
        post.description,
        post.content,
        post.category,
        post.icon,
        post.href,
        index + 1,
      ]
    );
  }
  console.log(`Feature posts seeded (${FEATURE_POST_SEED.length}).`);
}

/**
 * Fills the detail page body for the built-in features on an existing install.
 *
 * The `content` column was added after the first release, so rows seeded by an
 * earlier run have no detail copy. This backfills anything still empty and never
 * touches a body an admin has already written.
 */
async function backfillFeaturePostContent(conn: Connection) {
  let updated = 0;
  for (const post of FEATURE_POST_SEED) {
    const slug = slugify(post.title);
    const [result] = await conn.query<mysql.ResultSetHeader>(
      `UPDATE feature_posts
          SET content = ?,
              description = COALESCE(NULLIF(description, ''), ?)
        WHERE (slug = ? OR title = ?)
          AND (content IS NULL OR content = '')`,
      [post.content, post.description, slug, post.title]
    );
    updated += result.affectedRows;
  }
  if (updated) console.log(`Backfilled detail content for ${updated} feature post(s).`);
}

/** Slugs already in use, so a new or migrated row cannot collide. */
async function loadUsedFeatureSlugs(conn: Connection): Promise<Set<string>> {
  const [rows] = await conn.query<mysql.RowDataPacket[]>("SELECT slug FROM feature_posts");
  const used = new Set<string>();
  for (const row of rows) {
    const slug = String(row.slug ?? "").trim();
    if (slug) used.add(slug);
  }
  return used;
}

/** First free slug for `base`, appending -2, -3... until it is unused. */
function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

/**
 * `slug` (the detail page URL) and `content` (the detail body) were added after
 * the first release of this table, so backfill them on an existing database.
 */
async function syncFeaturePostColumns(conn: Connection) {
  await ensureColumn(conn, "feature_posts", "slug", "VARCHAR(191) NULL AFTER title");
  await ensureColumn(conn, "feature_posts", "content", "MEDIUMTEXT NULL AFTER description");
  await ensureColumn(conn, "feature_posts", "is_featured", "TINYINT(1) NOT NULL DEFAULT 0 AFTER sort_order");
}

/**
 * Fills any empty slug from the title and then guarantees the column is unique
 * so `/features/<slug>` always resolves to exactly one row.
 */
async function backfillFeaturePostSlugs(conn: Connection) {
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT id, title, slug FROM feature_posts"
  );
  const used = new Set<string>();
  for (const row of rows) {
    const slug = String(row.slug ?? "").trim();
    if (slug) used.add(slug);
  }

  let updated = 0;
  for (const row of rows) {
    if (String(row.slug ?? "").trim()) continue;
    const slug = uniqueSlug(slugify(row.title) || `feature-${row.id}`, used);
    await conn.query("UPDATE feature_posts SET slug = ? WHERE id = ?", [slug, row.id]);
    updated += 1;
  }
  if (updated) console.log(`Backfilled ${updated} feature post slug(s).`);

  // schema.sql already declares `slug UNIQUE` on a fresh database; this only
  // adds the index for tables created before that line existed.
  const [idx] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS c
       FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'feature_posts'
        AND COLUMN_NAME = 'slug'
        AND NON_UNIQUE = 0`
  );
  if (Number(idx[0].c) === 0) {
    await conn.query("ALTER TABLE feature_posts ADD UNIQUE KEY uq_feature_posts_slug (slug)");
    console.log("Added unique index on feature_posts.slug.");
  }
}

async function main() {
  const host = process.env.DB_HOST || "127.0.0.1";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "salon_admin";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "salon_marketing";

  const conn = await mysql.createConnection({ host, port, user, password, database, multipleStatements: true });

  const schemaPath = path.join(process.cwd(), "sql", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await conn.query(schema);
  console.log("Schema applied.");

  // schema.sql uses CREATE TABLE IF NOT EXISTS, so columns added after a
  // database was first created still need to be backfilled.
  await ensureColumn(
    conn,
    "page_sections",
    "is_visible",
    "TINYINT(1) NOT NULL DEFAULT 1"
  );

  // blog_posts columns added after the first release, backfilled the same way.
  const blogColumns: Array<[string, string]> = [
    ["cover_video", "VARCHAR(500) NULL"],
    ["author", "VARCHAR(191) NULL"],
    ["tags", "VARCHAR(500) NULL"],
    ["read_time", "VARCHAR(40) NULL"],
    ["is_featured", "TINYINT(1) NOT NULL DEFAULT 0"],
    ["is_popular", "TINYINT(1) NOT NULL DEFAULT 0"],
    ["view_count", "INT UNSIGNED NOT NULL DEFAULT 0"],
    ["author_image", "VARCHAR(500) NULL"],
  ];
  for (const [column, definition] of blogColumns) {
    await ensureColumn(conn, "blog_posts", column, definition);
  }

  // Feature posts gained their detail page URL (`slug`) and body (`content`)
  // after the first release, so backfill them on an existing database.
  await syncFeaturePostColumns(conn);

  // Packages live in their own table so `/pricing` manages them; page copy stays
  // in page_sections under Pages -> Pricing.
  await migratePricingPlans(conn);
  await seedPricingPlans(conn);

  const email = process.env.ADMIN_EMAIL || "admin@avenque.com";
  const plain = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(plain, 10);

  await conn.query(
    `INSERT INTO admins (email, password_hash, name)
     VALUES (?, ?, 'Avenque Admin')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name)`,
    [email, hash]
  );
  console.log(`Admin user ready: ${email}`);

  const pages = [
    { slug: "home", title: "Home" },
    { slug: "about", title: "About Us" },
    { slug: "features", title: "Features" },
    { slug: "pricing", title: "Pricing" },
    { slug: "blog", title: "Blog" },
    { slug: "faq", title: "FAQ" },
    { slug: "contact", title: "Contact" },
    { slug: "request-demo", title: "Request Demo" },
    { slug: "footer", title: "Footer" },
  ];

  for (const page of pages) {
    await conn.query(
      `INSERT INTO pages (slug, title, status)
       VALUES (?, ?, 'published')
       ON DUPLICATE KEY UPDATE title = VALUES(title)`,
      [page.slug, page.title]
    );
  }
  console.log("Pages seeded.");

  const [pageRows] = await conn.query<mysql.RowDataPacket[]>("SELECT id, slug FROM pages");
  const bySlug = Object.fromEntries(pageRows.map((r) => [r.slug, r.id]));

  const sections: Array<{
    slug: string;
    key: string;
    heading?: string;
    subheading?: string;
    body?: string;
    cta_label?: string;
    cta_href?: string;
    image_url?: string;
    extra?: Record<string, unknown>;
    sort: number;
  }> = [
    {
      slug: "home",
      key: "hero",
      heading: "Empower Your",
      subheading:
        "Simplify bookings, manage staff, delight your customers and grow your salon with SalonAI — built for modern beauty businesses.",
      cta_label: "Get Started Today",
      cta_href: "/request-demo",
      extra: {
        heading_accent: "Salon Business",
        secondary_cta_label: "Watch Video",
        secondary_cta_href: "#watch-video",
        secondary_cta_sub: "See how it works",
        image_alt: "SalonAI mobile app mockups in a modern salon",
        highlights: [
          { title: "Easy Booking", desc: "24/7 online appointments." },
          { title: "Manage Staff", desc: "Save time, work smarter." },
          { title: "Grow Revenue", desc: "Insights & reports." },
          { title: "Secure & Reliable", desc: "Your data is safe." },
        ],
      },
      sort: 1,
    },
    {
      slug: "home",
      key: "features_overview",
      heading: "Everything You Need to",
      subheading:
        "Powerful tools to manage your salon, save time and deliver a better experience — all in one place.",
      cta_label: "See more",
      cta_href: "/features",
      extra: {
        heading_accent: "Run Your Salon Smarter",
        features: [
          {
            title: "Booking Management",
            description: "Manage appointments, schedule and walk-ins effortlessly.",
          },
          {
            title: "Staff Management",
            description: "Organize staff, roles, commissions and performance.",
          },
          {
            title: "Customer Management",
            description: "Keep customer profiles, history, notes and preferences.",
          },
          {
            title: "AI Features",
            description: "Manage appointments with AI-powered workflows effortlessly.",
          },
        ],
      },
      sort: 2,
    },
    {
      slug: "home",
      key: "product_preview",
      heading: "A Powerful Platform",
      subheading:
        "SalonAI brings all your business operations together in one beautiful and intelligent platform.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      extra: {
        heading_accent: "Designed for Salons",
        image_alt: "Modern salon interior",
        points: [
          {
            title: "Easy Navigation",
            desc: "A clean and intuitive interface for everyone.",
          },
          {
            title: "Real-time Updates",
            desc: "Stay in sync with bookings, staff and customers.",
          },
          {
            title: "Advanced Analytics",
            desc: "Track performance and grow with clear insights.",
          },
          {
            title: "Secure & Cloud Based",
            desc: "Your salon data stays protected and accessible.",
          },
        ],
      },
      sort: 3,
    },
    {
      slug: "home",
      key: "pricing",
      heading: "Simple,",
      subheading:
        "Choose the plan that fits your salon. Upgrade, downgrade or cancel anytime — no hidden fees.",
      cta_label: "View Full Pricing →",
      cta_href: "/pricing",
      extra: {
        heading_accent: "Transparent Pricing",
        plans: [
          {
            name: "Starter",
            price: "$19",
            period: "/month",
            description: "Perfect for small salons getting started.",
            features: ["Up to 2 Staff", "Basic Features", "Email Support"],
            featured: false,
            badge: "",
            cta_label: "Get Started",
            cta_href: "/request-demo",
          },
          {
            name: "Growth",
            price: "$39",
            period: "/month",
            description: "Great for growing salons.",
            features: ["Up to 10 Staff", "Advanced Features", "Priority Support"],
            featured: false,
            badge: "",
            cta_label: "Get Started",
            cta_href: "/request-demo",
          },
          {
            name: "Pro",
            price: "$69",
            period: "/month",
            description: "For large salons & multi-branches.",
            features: ["Unlimited Staff", "All Features", "24/7 Support"],
            featured: true,
            badge: "Most Popular",
            cta_label: "Get Started",
            cta_href: "/request-demo",
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For large enterprises.",
            features: ["Custom Solutions", "Dedicated Support", "Onboarding & Training"],
            featured: false,
            badge: "",
            cta_label: "Contact Sales",
            cta_href: "/contact",
          },
        ],
      },
      sort: 4,
    },
    {
      slug: "home",
      key: "testimonials",
      heading: "Loved by",
      subheading:
        "Real stories from salon owners who are growing their business with SalonAI.",
      extra: {
        heading_accent: "Salon Owners",
        items: [
          {
            name: "Priya Sharma",
            role: "Owner",
            salon: "Looks Salon",
            avatar_url:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
            rating: 5,
            content:
              "SalonAI has completely transformed the way we manage our salon. Booking, staff, customers — everything is now so easy and automated.",
          },
          {
            name: "Ananya Patel",
            role: "Founder",
            salon: "Glow & Shine Studio",
            avatar_url:
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
            rating: 5,
            content:
              "Our no-shows dropped by 40% in the first month! The automated reminders alone have been a total game-changer for us.",
          },
          {
            name: "Rohan Kapoor",
            role: "Managing Director",
            salon: "Urban Cut Barbers",
            avatar_url:
              "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
            rating: 5,
            content:
              "Managing staff commission and inventory used to take hours every weekend. Now SalonAI handles accounting in real-time.",
          },
        ],
      },
      sort: 5,
    },
    {
      slug: "home",
      key: "mobile_app",
      heading: "On the Go,",
      subheading:
        "Manage your salon anytime, anywhere with our beautiful mobile apps for you and your customers.",
      extra: {
        heading_accent: "Always in Control",
        image_alt: "SalonAI mobile apps for owners and customers",
        app_store_url: "#",
        play_store_url: "#",
      },
      sort: 6,
    },
    {
      slug: "home",
      key: "faq",
      heading: "Frequently Asked",
      subheading: "Quick answers to the most common questions about SalonAI.",
      cta_label: "View All FAQs →",
      cta_href: "/faq",
      // Questions live in the `faqs` table and the category tabs come from the
      // FAQ page's `categories` section, so the home section only owns its copy.
      extra: {
        heading_accent: "Questions",
      },
      sort: 7,
    },
    {
      slug: "home",
      key: "cta_banner",
      heading: "Ready to Transform",
      subheading:
        "Join 10,000+ salon owners who are saving time, increasing bookings and growing their business with SalonAI.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      extra: {
        eyebrow: "Get Started",
        heading_accent: "Your Salon Business?",
        image_alt: "Salon professional at work",
        features: [
          { title: "Easy Setup" },
          { title: "Dedicated Support" },
          { title: "Grow Faster" },
        ],
      },
      sort: 8,
    },
    {
      slug: "about",
      key: "hero",
      heading: "Built for modern salon businesses",
      body: "SalonAI by Avenque helps salon owners streamline bookings, staff scheduling, customer relationships, and day-to-day operations.",
      sort: 1,
    },
    {
      slug: "features",
      key: "hero",
      heading: "Everything You Need to",
      subheading:
        "SalonAI comes with all the tools you need to manage your salon efficiently, delight your clients, and grow your business faster than ever.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      extra: {
        heading_accent: "Run Your Salon Smarter",
        secondary_cta_label: "Our Story",
        secondary_cta_href: "/about",
      },
      sort: 1,
    },
    {
      slug: "features",
      key: "feature_grid",
      heading: "Explore Our",
      extra: {
        heading_accent: "Powerful Features",
        categories: [
          { id: "all", label: "All Features" },
          { id: "bookings", label: "Bookings" },
          { id: "customers", label: "Customers" },
          { id: "staff", label: "Staff" },
          { id: "business", label: "Business" },
          { id: "marketing", label: "Marketing" },
          { id: "reports", label: "Reports" },
          { id: "integrations", label: "Integrations" },
        ],
        // Feature cards are not seeded here: they live in the `feature_posts`
        // table and are managed from Admin -> Features Posts. This section only
        // wraps the category tabs and the grid, so its is_visible flag toggles
        // the card grid.
      },
      sort: 2,
    },
    {
      slug: "features",
      key: "platform_showcase",
      heading: "A Powerful Platform",
      body: "SalonAI is more than just software. It's a complete management solution that helps you save time, improve customer experience and grow your salon.",
      extra: {
        heading_accent: "Designed for Your Success",
        benefits: [
          { title: "Save Time", desc: "Automate tasks and focus on what matters most." },
          { title: "Work from Anywhere", desc: "Access your salon data anytime, on any device." },
          { title: "Increase Revenue", desc: "Boost sales with smart insights and retention." },
          { title: "Scalable Solution", desc: "From single salons to large enterprises." },
          { title: "Delight Customers", desc: "Provide exceptional service and experience." },
          { title: "Always Improving", desc: "We innovate and ship new features regularly." },
        ],
      },
      sort: 3,
    },
    {
      slug: "about",
      key: "hero",
      heading: "Building Intelligent",
      subheading:
        "SalonAI is more than just software — it's our commitment to empower salon and beauty businesses with AI-powered tools that simplify operations, delight customers, and drive growth.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      image_url: "",
      extra: {
        heading_accent: "Solutions for Modern Salons",
        secondary_cta_label: "Explore Features",
        secondary_cta_href: "/features",
        image_alt: "SalonAI platform overview",
      },
      sort: 1,
    },
    {
      slug: "about",
      key: "mission_stats",
      heading: "Our Mission, Vision",
      extra: {
        heading_accent: "& Values",
        subheading:
          "We are driven by a purpose to transform the beauty and wellness industry through innovation and technology.",
        mission_title: "Our Mission",
        mission_body:
          "To simplify salon management and empower businesses with AI-driven tools that enhance productivity, improve customer experience, and drive growth.",
        vision_title: "Our Vision",
        vision_body:
          "To be the leading intelligent salon management platform, powering every salon to achieve excellence and scale effortlessly.",
      },
      sort: 2,
    },
    {
      slug: "about",
      key: "journey",
      heading: "Milestones That",
      extra: {
        heading_accent: "Shaped Us",
        milestones: [
          { title: "The Beginning", desc: "SalonAI was founded with a vision to modernize salon operations with technology and innovation." },
          { title: "Early Growth", desc: "We launched our platform and onboarded our first 1,000+ salons, improving bookings and operations." },
          { title: "Expanding Features", desc: "AI features, analytics, loyalty programs, and mobile apps were introduced to empower salons even more." },
          { title: "Global Reach", desc: "We reached 10,000+ salons worldwide and continue to grow our global community every day." },
          { title: "What's Next", desc: "We're building the future of salon management with smarter AI, more integrations, and limitless possibilities." },
        ],
      },
      sort: 4,
    },
    {
      slug: "about",
      key: "team",
      heading: "The Team Behind",
      extra: {
        eyebrow: "Our Team",
        heading_accent: "SalonAI",
        subheading:
          "We are a passionate team of innovators, designers, engineers, and dreamers working together to build technology that makes a real impact.",
        members: [
          { name: "Alex Johnson", role: "Lead Software Engineer", image_url: "" },
          { name: "Priya Sharma", role: "Head of Product", image_url: "" },
          { name: "Marcus Lee", role: "AI & Data Lead", image_url: "" },
          { name: "Sara Bennett", role: "Customer Success", image_url: "" },
          { name: "Daniel Osei", role: "Design Lead", image_url: "" },
        ],
      },
      sort: 3,
    },
    {
      slug: "about",
      key: "why_choose",
      heading: "Why Salons Choose",
      subheading:
        "Everything you need to run and grow a modern salon — powerful enough for enterprises, simple enough for a single chair.",
      image_url: "",
      extra: {
        heading_accent: "SalonAI",
        features: [
          { title: "Easy to Use", desc: "Simple, intuitive and built for salons of all sizes." },
          { title: "AI-Powered", desc: "Smart insights and automation to save time and grow faster." },
          { title: "Secure & Reliable", desc: "Enterprise-grade security to keep your data safe and protected." },
          { title: "Scalable", desc: "From single salons to multi-branch enterprises." },
          { title: "Always Improving", desc: "We listen, we innovate and we continuously make things better." },
        ],
      },
      sort: 5,
    },
    {
      slug: "pricing",
      key: "hero",
      heading: "Simple, Transparent",
      subheading: "Choose the perfect plan for your salon. Upgrade, downgrade or cancel anytime.",
      extra: {
        heading_accent: "Pricing for Every Salon",
      },
      sort: 1,
    },
    {
      // Packages are not seeded here: they live in the `pricing_plans` table and
      // are managed from Admin -> Pricing. This section only wraps the hero and
      // the plan grid, so its is_visible flag toggles the plan cards.
      slug: "pricing",
      key: "pricing_cards",
      sort: 2,
    },
    {
      slug: "pricing",
      key: "comparison",
      heading: "Compare Plans",
      subheading: "Find the perfect fit for your salon's size and growth goals.",
      extra: {
        feature_column_label: "Features",
        plan_columns: ["Starter", "Growth", "Pro", "Enterprise"],
        rows: [
          {
            icon: "Users",
            name: "Staff Users",
            values: [
              { value: "Up to 2" },
              { value: "Up to 10" },
              { value: "Unlimited" },
              { value: "Unlimited" },
            ],
          },
          {
            icon: "Calendar",
            name: "Bookings & Appointments",
            values: [{ yes: true }, { yes: true }, { yes: true }, { yes: true }],
          },
          {
            icon: "UserCheck",
            name: "Customer Management",
            values: [{ yes: true }, { yes: true }, { yes: true }, { yes: true }],
          },
          {
            icon: "BarChart2",
            name: "Reports & Analytics",
            values: [
              { value: "Basic" },
              { value: "Advanced" },
              { value: "Advanced" },
              { value: "Advanced + Custom" },
            ],
          },
          {
            icon: "Sparkles",
            name: "AI Insights",
            values: [{}, { yes: true }, { yes: true }, { yes: true }],
          },
          {
            icon: "Gift",
            name: "Loyalty Programs",
            values: [{}, { yes: true }, { yes: true }, { yes: true }],
          },
          {
            icon: "Network",
            name: "Multi-branch Management",
            values: [{}, {}, { yes: true }, { yes: true }],
          },
          {
            icon: "ShieldCheck",
            name: "Custom Roles & Permissions",
            values: [{}, {}, { yes: true }, { yes: true }],
          },
          { icon: "Puzzle", name: "Custom Integrations", values: [{}, {}, {}, { yes: true }] },
          {
            icon: "Headphones",
            name: "Priority Support",
            values: [
              { value: "Email" },
              { value: "Priority" },
              { value: "24/7 Priority" },
              { value: "Dedicated" },
            ],
          },
          {
            icon: "GraduationCap",
            name: "Onboarding & Training",
            values: [{}, {}, {}, { yes: true }],
          },
          {
            icon: "ShieldAlert",
            name: "SLA & Uptime Guarantee",
            values: [{}, {}, {}, { yes: true }],
          },
        ],
      },
      sort: 3,
    },
    {
      slug: "pricing",
      key: "closing_cta",
      extra: {
        title: "Still not sure which plan is right for you?",
        subtitle: "Our team is happy to help you choose the perfect plan for your salon.",
        cta_label: "Talk to Sales",
        cta_href: "/contact",
        secondary_cta_label: "Start Free Trial",
        secondary_cta_href: "#",
      },
      sort: 4,
    },
    {
      slug: "pricing",
      key: "banner",
      extra: {
        strip_heading: "All plans include",
        items: [
          {
            title: "Cloud Based",
            desc: "Your salon data lives securely in the cloud and stays synced across every device in real time, so you can manage bookings, staff and customers from anywhere — even from home.",
          },
          {
            title: "Automatic Updates",
            desc: "New features, performance improvements and security fixes are rolled out automatically for everyone. There is nothing to install and no downtime — you always run the latest version.",
          },
          {
            title: "Data Backup",
            desc: "Automatic daily backups keep your appointments, customer records, payment history and settings safe. If anything goes wrong, your data can be fully restored with no loss.",
          },
          {
            title: "Mobile Apps",
            desc: "Run your salon on the go with dedicated iOS and Android apps. Check today's schedule, confirm bookings, message customers and track revenue straight from your phone.",
          },
          {
            title: "GDPR Compliant",
            desc: "We follow strict EU data-protection and privacy rules. Your customers' personal data is encrypted, never sold, and handled with full consent management built in.",
          },
        ],
      },
      sort: 5,
    },
    {
      slug: "pricing",
      key: "faq_cta",
      heading: "Frequently Asked Questions",
      subheading: "Got questions? We've got answers.",
      extra: {
        faqs: [
          {
            question: "Can I change my plan later?",
            answer:
              "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.",
          },
          {
            question: "Is there a free trial available?",
            answer: "Yes! We offer a 14-day free trial on all plans with no credit card required.",
          },
          {
            question: "Do you offer refunds?",
            answer:
              "We offer a 30-day money-back guarantee if you are not satisfied with our platform.",
          },
          {
            question: "Is my data secure?",
            answer: "Absolutely. We use enterprise-grade encryption and daily automated backups.",
          },
          {
            question: "Can I manage multiple branches?",
            answer: "Yes, multi-branch management is supported on our Pro and Enterprise plans.",
          },
        ],
        cta_heading: "Ready to Transform",
        cta_heading_accent: "Your Salon?",
        cta_subheading:
          "Join thousands of salon owners who are streamlining their operations with SalonAI.",
        cta_label: "Book a Demo →",
        cta_href: "/request-demo",
        cta_secondary_label: "Contact Sales",
        cta_secondary_href: "/contact",
      },
      sort: 6,
    },
    {
      slug: "blog",
      key: "hero",
      heading: "Insights That Help",
      subheading:
        "Expert tips, industry trends, and product updates to help you run a smarter, more profitable salon business.",
      extra: {
        heading_accent: "Your Salon Grow",
        search_placeholder: "Search articles...",
        search_label: "All Categories",
      },
      sort: 1,
    },
    {
      slug: "blog",
      key: "categories",
      extra: {
        items: [
          { icon: "LayoutGrid", label: "All Posts", slug: "" },
          { icon: "Briefcase", label: "Management", slug: "management" },
          { icon: "Megaphone", label: "Marketing", slug: "marketing" },
          { icon: "Cpu", label: "Technology", slug: "technology" },
          { icon: "Smile", label: "Customer Experience", slug: "customer-experience" },
          { icon: "Rocket", label: "Product Updates", slug: "product-updates" },
        ],
      },
      sort: 2,
    },
    {
      slug: "blog",
      key: "latest",
      heading: "Latest",
      extra: {
        heading_accent: "Articles",
        empty_message: "No articles have been published yet. Check back soon.",
      },
      sort: 3,
    },
    {
      slug: "blog",
      key: "popular",
      heading: "Popular Posts",
      extra: {
        empty_message: "Popular articles will show up here once the blog is live.",
      },
      sort: 4,
    },
    {
      slug: "faq",
      key: "hero",
      heading: "Got Questions?",
      subheading:
        "Find quick answers to the most common questions about SalonAI. Can't find what you're looking for? Feel free to contact our team.",
      extra: {
        heading_accent: "We've Got Answers",
        search_placeholder: "Search for answers...",
        search_label: "Search",
      },
      sort: 1,
    },
    {
      slug: "faq",
      key: "categories",
      heading: "Answers",
      subheading: "Browse questions and answers below.",
      extra: {
        heading_accent: "by Category",
        categories: [
          { id: "general", label: "General", icon: "BookOpen", slug: "" },
          { id: "features", label: "Features", icon: "Sparkles", slug: "features" },
          { id: "bookings", label: "Bookings", icon: "Calendar", slug: "bookings" },
          { id: "billing", label: "Billing", icon: "Settings2", slug: "billing" },
          { id: "security", label: "Security", icon: "Shield", slug: "security" },
          { id: "support", label: "Support", icon: "HelpCircle", slug: "support" },
        ],
      },
      sort: 2,
    },
    {
      slug: "faq",
      key: "cta_banner",
      heading: "Our Support Team is Here to",
      subheading:
        "Can't find the answer you're looking for? Get in touch with our friendly support team and we'll be happy to assist you.",
      cta_label: "Contact Support",
      cta_href: "/contact",
      extra: {
        eyebrow: "Still have questions?",
        heading_accent: "Help",
        secondary_cta_label: "Book a Demo",
        secondary_cta_href: "/request-demo",
      },
      sort: 3,
    },
    {
      slug: "contact",
      key: "hero",
      heading: "Let’s build a better salon business together",
      subheading: "Have a question or want a demo? Reach out and we’ll help.",
      extra: {
        image_alt: "SalonAI support team",
      },
      sort: 1,
    },
    {
      slug: "contact",
      key: "contact_form",
      heading: "Send Us a Message",
      subheading: "Fill out the form below and we'll get back to you within 24 hours.",
      extra: {
        name_label: "Full Name *",
        name_placeholder: "Enter your full name",
        email_label: "Email Address *",
        email_placeholder: "Enter your email",
        phone_label: "Phone Number",
        phone_placeholder: "Enter your phone number",
        subject_label: "Subject *",
        subject_placeholder: "Select a subject",
        message_label: "Message *",
        message_placeholder: "Tell us how we can help you...",
        submit_label: "Send Message →",
        success_message: "Thanks! Your message has been sent. We'll get back to you shortly.",
        privacy_note: "Your information is safe with us.",
        details_heading: "Contact Information",
        socials_heading: "Follow Us",
        details: [
          { icon: "Mail", label: "Email Us", value: "hello@avenque.com" },
          { icon: "Phone", label: "Call Us", value: "+94 11 234 5678" },
          { icon: "MapPin", label: "Visit Our Office", value: "No. 123, Innovation Drive, Colombo 00500" },
        ],
        subjects: ["Sales & Pricing", "Technical Support", "Partnership", "General Enquiry"],
      },
      sort: 2,
    },
    {
      slug: "contact",
      key: "location_map",
      heading: "Find Us",
      body: "Visit our office or get directions to meet with our team.",
      extra: {
        address: "No. 123, Innovation Drive, Colombo 00500, Sri Lanka",
        map_query: "Colombo Sri Lanka",
        directions_label: "Get Directions",
        directions_href: "https://maps.google.com/?q=Colombo+Sri+Lanka",
      },
      sort: 3,
    },
    {
      slug: "request-demo",
      key: "demo_hero",
      heading: "See SalonAI",
      subheading:
        "Tell us a bit about your salon and we'll schedule a personalized walkthrough.",
      extra: {
        eyebrow: "Book a Demo",
        heading_accent: "in Action",
      },
      sort: 1,
    },
    {
      slug: "request-demo",
      key: "contact_form",
      heading: "Send Us a Message",
      subheading: "Fill out the form below and we'll get back to you within 24 hours.",
      extra: {
        name_label: "Full Name *",
        name_placeholder: "Enter your full name",
        email_label: "Email Address *",
        email_placeholder: "Enter your email",
        phone_label: "Phone Number",
        phone_placeholder: "Enter your phone number",
        subject_label: "Subject *",
        subject_placeholder: "Select a subject",
        message_label: "Message *",
        message_placeholder: "Tell us how we can help you...",
        submit_label: "Send Message →",
        success_message: "Thanks! Your message has been sent. We'll get back to you shortly.",
        privacy_note: "Your information is safe with us.",
        details_heading: "Contact Information",
        socials_heading: "Follow Us",
        details: [
          { icon: "Mail", label: "Email Us", value: "hello@avenque.com" },
          { icon: "Phone", label: "Call Us", value: "+94 11 234 5678" },
          { icon: "MapPin", label: "Visit Our Office", value: "No. 123, Innovation Drive, Colombo 00500" },
        ],
        subjects: ["Book a Demo", "Sales & Pricing", "Technical Support", "General Enquiry"],
      },
      sort: 2,
    },
    {
      slug: "request-demo",
      key: "cta_banner",
      heading: "Ready to Transform",
      subheading: "Let’s discuss how SalonAI can help your salon grow faster.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      extra: {
        eyebrow: "Get Started",
        heading_accent: "Your Salon?",
        secondary_cta_label: "Start Free Trial",
        secondary_cta_href: "#",
        image_alt: "SalonAI team",
      },
      sort: 3,
    },
    {
      slug: "footer",
      key: "footer",
      heading: "Manage. Grow. Shine.",
      subheading:
        "Simplify bookings, manage staff, delight your customers and grow your salon — all from one elegant platform.",
      extra: {
        explore_heading: "Explore",
        explore_links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Request a Demo", href: "/request-demo" },
          { label: "Login", href: "/login" },
        ],
        company_heading: "Company",
        company_links: [
          { label: "About Us", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "FAQ", href: "/faq" },
          { label: "Contact", href: "/contact" },
        ],
        contact_heading: "Get in Touch",
        contacts: [
          {
            label: "Email Us",
            value: "hello@avenque.com",
            href: "mailto:hello@avenque.com",
          },
          {
            label: "Call Us",
            value: "+94 11 234 5678",
            href: "tel:+94112345678",
          },
          {
            label: "Visit Us",
            value: "No. 123, Innovation Drive, Colombo 00500",
            href: "https://maps.google.com/?q=Colombo+Sri+Lanka",
          },
        ],
        socials: [
          { label: "Instagram", href: "https://www.instagram.com" },
          { label: "Facebook", href: "https://www.facebook.com" },
          { label: "LinkedIn", href: "https://www.linkedin.com" },
          { label: "YouTube", href: "https://www.youtube.com" },
        ],
        copyright: "Avenque. All rights reserved.",
        footer_note: "Beauty Meets Technology",
      },
      sort: 1,
    },
    {
      slug: "footer",
      key: "newsletter",
      heading: "Stay Updated with the Latest Insights",
      subheading:
        "Subscribe to our newsletter and get the latest tips, trends, and product updates straight to your inbox.",
      extra: {
        email_placeholder: "Enter your email address",
        submit_label: "Subscribe",
        success_message: "Thanks for subscribing! Watch your inbox for the next issue.",
      },
      sort: 2,
    },
  ];

  for (const s of sections) {
    const pageId = bySlug[s.slug];
    if (!pageId) continue;
    await upsertSection(conn, pageId, s);
  }
  console.log("Page sections seeded.");

  // Remove the legacy `faq` section from the FAQ page. The questions now come
  // from the `faqs` table, and the page wraps them with the `hero`,
  // `categories` and `cta_banner` sections seeded above. Re-running keeps both
  // fresh and existing installs consistent.
  await conn.query(
    `DELETE ps FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'faq' AND ps.section_key = 'faq'`
  );

  // The Features page no longer renders a closing CTA, so drop the section row
  // left behind by earlier seeds and keep the two codebases in sync.
  await conn.query(
    `DELETE ps FROM page_sections ps
     JOIN pages p ON p.id = ps.page_id
     WHERE p.slug = 'features' AND ps.section_key = 'cta_banner'`
  );

  // The features page was redesigned on the Client: drop the Stats Bar section
  // and the fields the editor no longer owns from existing installs.
  await cleanupFeaturesSections(conn);

  // The about page was redesigned too: the hero plays a fixed video, and the
  // stats/highlights/eyebrow fields are gone.
  await cleanupAboutSections(conn);

  // The pricing page was redesigned too: the hero eyebrow, the FAQ "view all"
  // link and the included-item icons are no longer rendered.
  await cleanupPricingSections(conn);

  // The blog index was redesigned: the newsletter box is gone, and the
  // categories / latest / popular sections dropped the fields it no longer
  // renders. The article pages no longer render a closing CTA banner either.
  await cleanupBlogSections(conn);

  // The contact page now ends at the Location & Map section, so the closing
  // CTA banner is no longer rendered.
  await cleanupContactSections(conn);

  // The FAQ page dropped the hero eyebrow and the categories eyebrow, which the
  // reworked Client layout no longer renders.
  await cleanupFaqSections(conn);

  // The home page dropped the eyebrows on most sections, the features footer
  // note, the testimonial header link and the CTA banner extras the Client no
  // longer renders.
  await cleanupHomeSections(conn);

  // Feature cards live in their own table so `/features-posts` manages them;
  // only the category tabs stay in page_sections under Pages -> Features.
  await migrateFeaturePosts(conn);
  await seedFeaturePosts(conn);
  // Every row needs a unique slug so its /features/<slug> page resolves.
  await backfillFeaturePostSlugs(conn);
  // Newer installs get the detail bodies for the built-in feature cards.
  await backfillFeaturePostContent(conn);

  const [faqCount] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS c FROM faqs");
  if (Number(faqCount[0].c) === 0) {
    // Categories match the labels on the FAQ page (`categories` section) so the
    // home teaser (newest 5) and the FAQ page group them under the right tabs.
    await conn.query(
      `INSERT INTO faqs (question, answer, category, sort_order) VALUES
       ('What is SalonAI?', 'SalonAI is an AI-powered salon management platform for bookings, staff, customers and operations.', 'General', 1),
       ('Who is SalonAI built for?', 'SalonAI is designed for salons, spas, barbershops and beauty studios of all sizes.', 'General', 2),
       ('Do I need technical skills to use it?', 'No. SalonAI is designed to be intuitive and easy to use for both owners and staff.', 'General', 3),
       ('Can I use SalonAI on mobile devices?', 'Yes, we have dedicated iOS and Android apps along with a fully responsive web app.', 'General', 4),
       ('Is setup easy?', 'Yes. Most salons are up and running within a day with our guided onboarding.', 'General', 5),
       ('What features are included?', 'Online booking, customer management, staff scheduling, payments, reports and more.', 'Features', 6),
       ('Does it support multiple locations?', 'Yes, multi-branch management is available on higher plans with shared reporting.', 'Features', 7),
       ('Can I send automated reminders?', 'Yes, automated SMS and email reminders help reduce no-shows significantly.', 'Features', 8),
       ('Can I track staff commissions?', 'Yes, you can track commissions based on services, products or custom rules.', 'Features', 9),
       ('Does it include marketing tools?', 'Yes, loyalty programmes, gift cards and targeted campaigns are built in.', 'Features', 10),
       ('Can clients book online?', 'Yes, clients can book 24/7 through your booking page with real-time availability.', 'Bookings', 11),
       ('Can I block time slots?', 'Yes, you can block time for breaks, holidays or private appointments with ease.', 'Bookings', 12),
       ('Can I manage waitlists?', 'Yes, waitlists help fill cancellations automatically when slots become available.', 'Bookings', 13),
       ('Can clients reschedule themselves?', 'Yes, depending on your settings, clients can reschedule or cancel their own appointments.', 'Bookings', 14),
       ('Does it sync with calendars?', 'Yes, you can sync appointments with popular calendars to avoid double bookings.', 'Bookings', 15),
       ('Is there a free trial?', 'Yes, we offer a 14-day free trial on all plans with no credit card required.', 'Billing', 16),
       ('Can I change my plan later?', 'Yes, you can upgrade, downgrade or cancel your subscription at any time from your dashboard.', 'Billing', 17),
       ('Do you offer refunds?', 'Yes, we offer a 30-day money-back guarantee if you are not satisfied.', 'Billing', 18),
       ('What payment methods do you accept?', 'We accept major credit and debit cards. Enterprise plans can be invoiced.', 'Billing', 19),
       ('Are there any hidden fees?', 'No, all pricing is transparent with no hidden setup or cancellation fees.', 'Billing', 20),
       ('Is my data secure?', 'Your data is encrypted in transit and at rest with automatic daily backups.', 'Security', 21),
       ('Is SalonAI GDPR compliant?', 'Yes, we follow strict data-protection and privacy rules to stay compliant.', 'Security', 22),
       ('Who can access my data?', 'Only authorised users. Role-based permissions give you full control over access.', 'Security', 23),
       ('Do you have two-factor authentication?', 'Yes, 2FA is available to add an extra layer of security for your account.', 'Security', 24),
       ('How often is data backed up?', 'We run automatic daily backups to secure cloud storage with redundancy.', 'Security', 25),
       ('How can I contact support?', 'You can reach us via email, live chat or the contact form on our website.', 'Support', 26),
       ('What support hours do you have?', 'Our support team is available during business hours, with priority for paid plans.', 'Support', 27),
       ('Do you offer priority support?', 'Yes, Pro and Enterprise plans include priority support with faster response times.', 'Support', 28),
       ('Can I get help with migration?', 'Yes, our team can help you migrate your client and appointment data over to SalonAI.', 'Support', 29),
       ('Where can I find tutorials?', 'Our help centre has guides, videos and FAQs to help you get the most out of SalonAI.', 'Support', 30)`
    );
    console.log("FAQs seeded.");
  }

  // Seed blog posts so the Client blog page renders real articles instead of
  // an empty list. `slug` is unique, so re-running is safe.
  const blogPosts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    tags: string;
    read_time: string;
    is_popular: number;
    status: string;
  }> = [
    {
      title: "How AI is Transforming Salon Management",
      slug: "how-ai-is-transforming-salon-management",
      excerpt:
        "Discover how artificial intelligence helps salon owners save time, increase revenue and delight customers.",
      category: "Technology",
      author: "Sarah Johnson",
      tags: "AI,Automation,Salon Management",
      read_time: "5 min read",
      is_popular: 1,
      status: "published",
      content: [
        "Running a salon means juggling bookings, staff schedules, stock and customer relationships at the same time. SalonAI pulls all of that into one place so you can spend your day with clients instead of paperwork.",
        "",
        "## Where AI actually saves you time",
        "",
        "- **No-show prediction** flags bookings that are likely to cancel, so you can fill the slot.",
        "- **Automatic reminders** are sent by email and SMS in the client's own language.",
        "- **Smart waitlists** rebook a cancelled chair without you touching the calendar.",
        "",
        "## Start with the numbers",
        "",
        "Open the Reports tab every Monday. Look at revenue per chair, rebooking rate and average ticket size. Those three numbers tell you where to focus the week.",
        "",
        "> The salons that grow fastest are not the ones with the most clients. They are the ones with the clearest picture of their own numbers.",
        "",
        "See the full [pricing](/pricing) or [book a demo](/request-demo) to get started.",
      ].join("\n"),
    },
    {
      title: "10 Ways to Improve Salon Efficiency and Save Time",
      slug: "10-ways-to-improve-salon-efficiency",
      excerpt:
        "Streamline your daily operations and cut down on no-shows with these proven strategies.",
      category: "Management",
      author: "Michael Brown",
      tags: "Efficiency,Workflow,Management",
      read_time: "4 min read",
      is_popular: 1,
      status: "published",
      content: [
        "Most salons lose hours a week to avoidable admin. Here is where that time usually goes, and what to do about it.",
        "",
        "1. **One shared calendar.** Every chair, stylist and treatment room on a single timeline.",
        "2. **Deposit on bookings.** Cuts no-shows dramatically for high-value services.",
        "3. **Pre-treatment forms.** Collect allergy and preference notes before the client arrives.",
        "4. **Standardise cleaning times.** Build them into the gap after each appointment.",
        "5. **Batch your admin.** Do invoicing and stock at one fixed time each day.",
        "6. **Track rebooking rate.** The cheapest new client is the one who already came back.",
        "7. **Use a colour-coded rota.** Makes gaps visible at a glance.",
        "8. **Keep two chairs free at peak.** Protects you from overbooking.",
        "9. **Automate confirmations.** One template, zero manual texting.",
        "10. **Review the week on Friday.** Fifteen minutes prevents next week's problems.",
        "",
        "SalonAI handles items 1, 2, 3 and 9 for you out of the box.",
      ].join("\n"),
    },
    {
      title: "Salon Marketing Ideas That Actually Bring in More Clients",
      slug: "salon-marketing-ideas-that-work",
      excerpt:
        "Creative and affordable marketing ideas to help you attract and keep more customers.",
      category: "Marketing",
      author: "Emily Roberts",
      tags: "Marketing,Retention,Growth",
      read_time: "6 min read",
      is_popular: 1,
      status: "published",
      content: [
        "You do not need a big budget. You need consistent, trackable ideas.",
        "",
        "## Bring back old clients first",
        "",
        "Your database already holds lapsed clients from last year. A short reactivation offer usually converts better than any new campaign, and it costs nothing.",
        "",
        "## Show the work",
        "",
        "Before and after photos with the client's permission are the single highest performing salon post. Ask permission at checkout, while they are already happy.",
        "",
        "## Partner with nearby businesses",
        "",
        "Cross promotions with the gym, the bridal shop and the coffee place downstairs all cost nothing but a conversation.",
        "",
        "## Make rebooking the default",
        "",
        "Offer the next appointment at the chair, at the till, and in the follow-up message. Every extra channel you add lifts the rebooking rate.",
      ].join("\n"),
    },
    {
      title: "The Benefits of Online Booking for Salons",
      slug: "benefits-of-online-booking-for-salons",
      excerpt:
        "Why 24/7 online booking changes the way clients pick and keep a salon.",
      category: "Technology",
      author: "David Wilson",
      tags: "Online Booking,Technology",
      read_time: "5 min read",
      is_popular: 0,
      status: "published",
      content: [
        "Clients book at 11pm, on the commute, and from their phone while waiting for coffee. If you only take bookings while sitting at the desk, you are losing that demand.",
        "",
        "## What changes when you go online",
        "",
        "- Bookings arrive even when the salon is closed.",
        "- Fewer no-shows, because clients confirm themselves.",
        "- Staff see their own schedule, so swapping shifts stops being a phone call chain.",
        "- Every booking carries the client's preferences and notes with it.",
        "",
        "## The one thing to get right",
        "",
        "Keep your availability accurate. A booking page that shows slots you cannot honour is worse than no booking page at all.",
        "",
        "SalonAI syncs online bookings with the in-salon calendar automatically, so the two can never disagree.",
      ].join("\n"),
    },
  ];

  for (const post of blogPosts) {
    await conn.query(
      `INSERT INTO blog_posts
         (title, slug, excerpt, content, category, author, tags, read_time, is_popular, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE title = VALUES(title)`,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.category,
        post.author,
        post.tags,
        post.read_time,
        post.is_popular,
        post.status,
      ]
    );
  }
  console.log(`Blog posts seeded (${blogPosts.length}).`);

  await conn.end();
  console.log("Database setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
