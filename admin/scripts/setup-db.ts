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

loadEnvLocal();

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
    heading: string;
    subheading?: string;
    body?: string;
    cta_label?: string;
    cta_href?: string;
    image_url?: string;
    sort: number;
  }> = [
    {
      slug: "home",
      key: "hero",
      heading: "Intelligent Salon Management, Simplified.",
      subheading: "SalonAI helps you manage bookings, staff, customers and business operations from one powerful platform.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      image_url: "/images/dashboard-mockup.png",
      sort: 1,
    },
    {
      slug: "home",
      key: "features_overview",
      heading: "Everything you need to run your salon",
      subheading: "Bookings, staff, loyalty, payments and AI insights — in one place.",
      sort: 2,
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
      heading: "All-in-one salon platform features",
      subheading: "Explore booking, staff, loyalty, AI insights and more.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      image_url: "/images/dashboard-features.png",
      sort: 1,
    },
    {
      slug: "pricing",
      key: "hero",
      heading: "Simple, transparent pricing",
      subheading: "Choose the plan that fits your salon.",
      sort: 1,
    },
    {
      slug: "blog",
      key: "hero",
      heading: "Salon growth insights",
      subheading: "Tips, product updates and industry ideas.",
      sort: 1,
    },
    {
      slug: "faq",
      key: "hero",
      heading: "Frequently asked questions",
      subheading: "Answers to common questions about SalonAI.",
      sort: 1,
    },
    {
      slug: "contact",
      key: "hero",
      heading: "Let’s build a better salon business together",
      subheading: "Have a question or want a demo? Reach out and we’ll help.",
      sort: 1,
    },
  ];

  for (const s of sections) {
    const pageId = bySlug[s.slug];
    if (!pageId) continue;
    await conn.query(
      `INSERT INTO page_sections
        (page_id, section_key, heading, subheading, body, cta_label, cta_href, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         heading = VALUES(heading),
         subheading = VALUES(subheading),
         body = VALUES(body),
         cta_label = VALUES(cta_label),
         cta_href = VALUES(cta_href),
         image_url = VALUES(image_url),
         sort_order = VALUES(sort_order)`,
      [
        pageId,
        s.key,
        s.heading,
        s.subheading || null,
        s.body || null,
        s.cta_label || null,
        s.cta_href || null,
        s.image_url || null,
        s.sort,
      ]
    );
  }
  console.log("Page sections seeded.");

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

  const [planCount] = await conn.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS c FROM pricing_plans");
  if (Number(planCount[0].c) === 0) {
    await conn.query(
      `INSERT INTO pricing_plans
        (name, price_monthly, price_yearly, description, features_json, is_featured, sort_order)
       VALUES
       ('Starter', 29, 290, 'For single-location salons getting started.', JSON_ARRAY('Online booking', 'Staff schedule', 'Basic reports'), 0, 1),
       ('Pro', 79, 790, 'For growing salons that need automation.', JSON_ARRAY('Everything in Starter', 'Loyalty program', 'AI insights', 'Payments'), 1, 2),
       ('Enterprise', 149, 1490, 'For multi-branch brands.', JSON_ARRAY('Everything in Pro', 'Multi-branch', 'Priority support', 'Custom onboarding'), 0, 3)`
    );
    console.log("Pricing plans seeded.");
  }

  await conn.end();
  console.log("Database setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
