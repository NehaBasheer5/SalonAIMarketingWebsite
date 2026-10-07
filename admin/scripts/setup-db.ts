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
    ["view_count", "INT UNSIGNED NOT NULL DEFAULT 0"],
    ["author_image", "VARCHAR(500) NULL"],
  ];
  for (const [column, definition] of blogColumns) {
    await ensureColumn(conn, "blog_posts", column, definition);
  }

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
        eyebrow: "All-in-One Salon Management App",
        heading_accent: "Salon Business",
        secondary_cta_label: "Watch Video",
        secondary_cta_href: "#watch-video",
        secondary_cta_sub: "See how it works",
        image_alt: "SalonAI mobile app mockups in a modern salon",
        highlights: [
          { icon: "CalendarDays", title: "Easy Booking", desc: "24/7 online appointments." },
          { icon: "Users", title: "Manage Staff", desc: "Save time, work smarter." },
          { icon: "Sparkles", title: "Grow Revenue", desc: "Insights & reports." },
          { icon: "ShieldCheck", title: "Secure & Reliable", desc: "Your data is safe." },
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
        eyebrow: "Features",
        heading_accent: "Run Your Salon Smarter",
        features: [
          {
            icon: "CalendarClock",
            title: "Booking Management",
            description: "Manage appointments, schedule and walk-ins effortlessly.",
          },
          {
            icon: "UsersRound",
            title: "Staff Management",
            description: "Organize staff, roles, commissions and performance.",
          },
          {
            icon: "UserRoundCog",
            title: "Customer Management",
            description: "Keep customer profiles, history, notes and preferences.",
          },
          {
            icon: "Cpu",
            title: "AI Features",
            description: "Manage appointments with AI-powered workflows effortlessly.",
          },
        ],
        footer_note: "Beauty Meets Technology",
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
        eyebrow: "Platform",
        heading_accent: "Designed for Salons",
        image_alt: "Modern salon interior",
        points: [
          {
            icon: "CalendarDays",
            title: "Easy Navigation",
            desc: "A clean and intuitive interface for everyone.",
          },
          {
            icon: "Zap",
            title: "Real-time Updates",
            desc: "Stay in sync with bookings, staff and customers.",
          },
          {
            icon: "ChartColumnIncreasing",
            title: "Advanced Analytics",
            desc: "Track performance and grow with clear insights.",
          },
          {
            icon: "ShieldCheck",
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
      cta_label: "View Full Pricing →",
      cta_href: "/pricing",
      extra: {
        eyebrow: "Pricing",
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
      cta_label: "View All Testimonials →",
      cta_href: "/#testimonials",
      extra: {
        eyebrow: "Testimonials",
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
        eyebrow: "Mobile App",
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
      extra: {
        eyebrow: "FAQ",
        heading_accent: "Questions",
        categories: [
          { id: "general", label: "General", icon: "HelpCircle" },
          { id: "features", label: "Features", icon: "Sparkles" },
          { id: "billing", label: "Billing", icon: "Settings2" },
          { id: "security", label: "Security", icon: "Shield" },
        ],
        faqs: [
          {
            question: "What is SalonAI?",
            answer:
              "SalonAI is an all-in-one salon management platform that helps you handle bookings, staff, customers, and growth from one place.",
          },
          {
            question: "Is there a free trial?",
            answer:
              "Yes. You can start with a free trial and explore the full platform before choosing a plan.",
          },
          {
            question: "Can I manage multiple branches?",
            answer:
              "Absolutely. Higher plans support multi-branch management with shared reporting and staff controls.",
          },
          {
            question: "Is my data secure?",
            answer:
              "Yes. SalonAI uses secure cloud infrastructure with encryption and reliable backups to protect your salon data.",
          },
        ],
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
        secondary_cta_label: "Contact Sales",
        secondary_cta_href: "/contact",
        image_alt: "Salon professional at work",
        features: [
          { icon: "CalendarDays", title: "Easy Setup", desc: "Get started in minutes." },
          {
            icon: "Users",
            title: "Dedicated Support",
            desc: "Real help when you need it.",
          },
          {
            icon: "ChartColumnIncreasing",
            title: "Grow Faster",
            desc: "Insights that drive bookings.",
          },
        ],
        avatars: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80",
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
        ],
        trust_text: "Trusted by 10,000+ salon owners worldwide",
        stat_label: "Bookings This Month",
        stat_value: "1,248",
        stat_delta: "+12.5%",
        stat_note_title: "More Time For What You Love",
        stat_note_body: "Spend less time on admin and more time with your clients.",
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
      image_url: "",
      extra: {
        eyebrow: "Features",
        heading_accent: "Run Your Salon Smarter",
        secondary_cta_label: "Our Story",
        secondary_cta_href: "/about",
        image_alt: "SalonAI Dashboard Interface",
        highlights: [
          { icon: "Sparkles", title: "Easy to Use", desc: "Onboard in minutes." },
          { icon: "Cpu", title: "AI-Powered", desc: "Smarter workflows." },
          { icon: "ShieldCheck", title: "Secure & Reliable", desc: "Your data is safe." },
          { icon: "Cloud", title: "Cloud Based", desc: "Access anywhere." },
        ],
      },
      sort: 1,
    },
    {
      slug: "features",
      key: "feature_grid",
      heading: "Explore Our",
      extra: {
        eyebrow: "Everything Included",
        heading_accent: "Powerful Features",
        categories: [
          { id: "all", label: "All Features", icon: "LayoutGrid" },
          { id: "bookings", label: "Bookings", icon: "Calendar" },
          { id: "customers", label: "Customers", icon: "Users" },
          { id: "staff", label: "Staff", icon: "UserCheck" },
          { id: "business", label: "Business", icon: "Briefcase" },
          { id: "marketing", label: "Marketing", icon: "Megaphone" },
          { id: "reports", label: "Reports", icon: "BarChart3" },
          { id: "integrations", label: "Integrations", icon: "Puzzle" },
        ],
        features: [
          { title: "Online Booking", description: "Let clients book appointments 24/7 with real-time availability and instant confirmation.", category: "bookings", icon: "Calendar", href: "/features/booking" },
          { title: "Customer Management", description: "Store customer profiles, history, preferences, notes and keep relationships stronger.", category: "customers", icon: "Users", href: "/features/customers" },
          { title: "Staff Management", description: "Manage staff roles, schedules, commissions and performance in one place.", category: "staff", icon: "UserCheck", href: "/features/staff" },
          { title: "Service Management", description: "Organize services, duration, pricing and resources effortlessly.", category: "business", icon: "Scissors", href: "/features/services" },
          { title: "Payments & Invoices", description: "Accept payments, generate invoices and manage refunds securely.", category: "business", icon: "CreditCard", href: "/features/payments" },
          { title: "Loyalty Programs", description: "Build customer loyalty with points, rewards, memberships and special offers.", category: "marketing", icon: "Gift", href: "/features/loyalty" },
          { title: "SMS & Email Notifications", description: "Send automated reminders, promotions and personalized messages.", category: "marketing", icon: "Bell", href: "/features/notifications" },
          { title: "Reports & Analytics", description: "Get real-time insights and detailed reports to grow your business.", category: "reports", icon: "BarChart3", href: "/features/analytics" },
          { title: "AI Insights", description: "AI-powered recommendations to optimize bookings, staff and services.", category: "reports", icon: "Sparkles", href: "/features/ai" },
          { title: "Multi-branch Management", description: "Manage multiple branches seamlessly from a single dashboard.", category: "business", icon: "Network", href: "/features/multi-branch" },
          { title: "Roles & Permissions", description: "Set custom roles and permissions to keep your data secure and organized.", category: "staff", icon: "ShieldCheck", href: "/features/permissions" },
          { title: "Integrations", description: "Connect with your favorite tools like accounting, marketing and payment gateways.", category: "integrations", icon: "Puzzle", href: "/features/integrations" },
        ],
      },
      sort: 2,
    },
    {
      slug: "features",
      key: "platform_showcase",
      heading: "A Powerful Platform",
      body: "SalonAI is more than just software. It's a complete management solution that helps you save time, improve customer experience and grow your salon.",
      image_url: "",
      extra: {
        eyebrow: "Platform",
        heading_accent: "Designed for Your Success",
        image_alt: "SalonAI Laptop and Mobile App Interface",
        benefits: [
          { icon: "Clock", title: "Save Time", desc: "Automate tasks and focus on what matters most." },
          { icon: "Globe", title: "Work from Anywhere", desc: "Access your salon data anytime, on any device." },
          { icon: "Shield", title: "Increase Revenue", desc: "Boost sales with smart insights and retention." },
          { icon: "Zap", title: "Scalable Solution", desc: "From single salons to large enterprises." },
          { icon: "Smile", title: "Delight Customers", desc: "Provide exceptional service and experience." },
          { icon: "RefreshCw", title: "Always Improving", desc: "We innovate and ship new features regularly." },
        ],
      },
      sort: 3,
    },
    {
      slug: "features",
      key: "stats_bar",
      extra: {
        stats: [
          { icon: "Users", value: "10,000+", label: "Salons Worldwide" },
          { icon: "Smile", value: "500K+", label: "Happy Customers" },
          { icon: "CalendarCheck", value: "1M+", label: "Appointments Managed" },
          { icon: "TrendingUp", value: "95%", label: "Customer Satisfaction" },
          { icon: "Headset", value: "24/7", label: "Customer Support" },
        ],
      },
      sort: 4,
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
        eyebrow: "About SalonAI",
        heading_accent: "Solutions for Modern Salons",
        secondary_cta_label: "Explore Features",
        secondary_cta_href: "/features",
        image_alt: "SalonAI platform overview",
        highlights: [
          { icon: "Sparkles", title: "AI-Powered", desc: "Smarter tools, less admin." },
          { icon: "Users", title: "10,000+ Salons", desc: "Trusted worldwide." },
          { icon: "TrendingUp", title: "Proven Growth", desc: "Real results, daily." },
          { icon: "ShieldCheck", title: "Secure", desc: "Enterprise-grade data safety." },
        ],
      },
      sort: 1,
    },
    {
      slug: "about",
      key: "mission_stats",
      heading: "Our Mission, Vision",
      extra: {
        eyebrow: "Our Mission",
        heading_accent: "& Values",
        subheading:
          "We are driven by a purpose to transform the beauty and wellness industry through innovation and technology.",
        mission_title: "Our Mission",
        mission_body:
          "To simplify salon management and empower businesses with AI-driven tools that enhance productivity, improve customer experience, and drive growth.",
        vision_title: "Our Vision",
        vision_body:
          "To be the leading intelligent salon management platform, powering every salon to achieve excellence and scale effortlessly.",
        stats: [
          { value: "10,000+", label: "Salons Worldwide" },
          { value: "500K+", label: "Happy Customers" },
          { value: "1M+", label: "Appointments Managed" },
          { value: "95%", label: "Customer Satisfaction" },
          { value: "24/7", label: "Customer Support" },
        ],
      },
      sort: 2,
    },
    {
      slug: "about",
      key: "journey",
      heading: "Milestones That",
      extra: {
        eyebrow: "Our Journey",
        heading_accent: "Shaped Us",
        milestones: [
          { icon: "Sparkles", title: "The Beginning", desc: "SalonAI was founded with a vision to modernize salon operations with technology and innovation." },
          { icon: "Rocket", title: "Early Growth", desc: "We launched our platform and onboarded our first 1,000+ salons, improving bookings and operations." },
          { icon: "BarChart2", title: "Expanding Features", desc: "AI features, analytics, loyalty programs, and mobile apps were introduced to empower salons even more." },
          { icon: "Globe", title: "Global Reach", desc: "We reached 10,000+ salons worldwide and continue to grow our global community every day." },
          { icon: "Star", title: "What's Next", desc: "We're building the future of salon management with smarter AI, more integrations, and limitless possibilities." },
        ],
      },
      sort: 3,
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
      sort: 4,
    },
    {
      slug: "about",
      key: "why_choose",
      heading: "Why Salons Choose",
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
        eyebrow: "Pricing",
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
      key: "banner",
      extra: {
        strip_heading: "All plans include",
        items: [
          { icon: "Cloud", title: "Cloud Based", desc: "Secure & Reliable" },
          { icon: "RefreshCw", title: "Automatic Updates", desc: "Always up to date" },
          { icon: "Database", title: "Data Backup", desc: "Daily backups" },
          { icon: "Smartphone", title: "Mobile Apps", desc: "iOS & Android" },
          { icon: "ShieldCheck", title: "GDPR Compliant", desc: "Your data is safe" },
        ],
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
      key: "faq_cta",
      heading: "Frequently Asked Questions",
      subheading: "Got questions? We've got answers.",
      extra: {
        link_label: "View All FAQs →",
        link_href: "/faq",
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
        cta_eyebrow: "Get Started",
        cta_heading: "Ready to Transform",
        cta_heading_accent: "Your Salon?",
        cta_subheading:
          "Join thousands of salon owners who are streamlining their operations with SalonAI.",
        cta_label: "Book a Demo →",
        cta_href: "/request-demo",
        cta_secondary_label: "Contact Sales",
        cta_secondary_href: "/contact",
      },
      sort: 5,
    },
    {
      slug: "blog",
      key: "hero",
      heading: "Insights That Help",
      subheading:
        "Expert tips, industry trends, and product updates to help you run a smarter, more profitable salon business.",
      extra: {
        eyebrow: "Our Blog",
        heading_accent: "Your Salon Grow",
        image_alt: "SalonAI blog",
        search_placeholder: "Search articles...",
        search_label: "All Categories",
        featured_label: "Featured Article",
      },
      sort: 1,
    },
    {
      slug: "blog",
      key: "categories",
      heading: "Categories",
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
      cta_label: "View All Articles",
      cta_href: "/blog",
      extra: {
        heading_accent: "Articles",
        empty_message: "No articles have been published yet. Check back soon.",
      },
      sort: 3,
    },
    {
      slug: "blog",
      key: "newsletter",
      heading: "Stay Updated with the Latest Insights",
      subheading:
        "Subscribe to our newsletter and get the latest tips, trends, and product updates straight to your inbox.",
      extra: {
        email_placeholder: "Enter your email address",
        submit_label: "Subscribe",
        success_message: "Thanks for subscribing! Watch your inbox for the next issue.",
      },
      sort: 4,
    },
    {
      slug: "blog",
      key: "popular",
      heading: "Popular Posts",
      subheading: "Most read articles from the SalonAI blog.",
      extra: {
        empty_message: "Popular articles will show up here once the blog is live.",
      },
      sort: 5,
    },
    {
      slug: "blog",
      key: "cta_banner",
      heading: "Ready to Transform",
      subheading: "See how SalonAI can run your salon smarter, faster and more profitably.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      extra: {
        eyebrow: "Get Started",
        heading_accent: "Your Salon?",
        secondary_cta_label: "Contact Sales",
        secondary_cta_href: "/contact",
      },
      sort: 6,
    },
    {
      slug: "faq",
      key: "hero",
      heading: "Got Questions?",
      subheading:
        "Find quick answers to the most common questions about SalonAI. Can't find what you're looking for? Feel free to contact our team.",
      extra: {
        eyebrow: "FAQ",
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
        eyebrow: "Browse",
        heading_accent: "by Category",
        categories: [
          { id: "general", label: "General", icon: "BookOpen", slug: "" },
          { id: "billing", label: "Billing", icon: "Settings2", slug: "billing" },
          { id: "product", label: "Product", icon: "Sparkles", slug: "product" },
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
        eyebrow: "Contact Us",
        image_alt: "SalonAI support team",
        quick_contacts: [
          { icon: "Mail", label: "Email Us", value: "hello@avenque.com" },
          { icon: "Phone", label: "Call Us", value: "+94 11 234 5678" },
          { icon: "MapPin", label: "Visit Our Office", value: "Colombo, Sri Lanka" },
        ],
      },
      sort: 1,
    },
    {
      slug: "contact",
      key: "contact_form",
      heading: "Send Us a Message",
      subheading: "Fill out the form below and we'll get back to you within 24 hours.",
      extra: {
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
      slug: "contact",
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
      },
      sort: 4,
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

  const [faqCount] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS c FROM faqs");
  if (Number(faqCount[0].c) === 0) {
    await conn.query(
      `INSERT INTO faqs (question, answer, category, sort_order) VALUES
       ('What is SalonAI?', 'SalonAI is an AI-powered salon management platform for bookings, staff, customers and operations.', 'General', 1),
       ('Is there a free trial?', 'Yes, we offer a 14-day free trial on all plans with no credit card required.', 'Billing', 2),
       ('Can I manage multiple branches?', 'Yes, multi-branch management is supported on Pro and Enterprise plans.', 'Product', 3)`
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
    is_featured: number;
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
      is_featured: 1,
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
      is_featured: 0,
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
      is_featured: 0,
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
      is_featured: 0,
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
         (title, slug, excerpt, content, category, author, tags, read_time, is_featured, status, published_at)
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
        post.is_featured,
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
