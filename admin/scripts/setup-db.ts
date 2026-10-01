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
 * A row that already carries `extra_json` has been touched by the CMS, so it
 * is left completely untouched. That keeps re-running this script from
 * silently reverting edits made in the admin panel.
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
  const hasContent = row.extra_json !== null && row.extra_json !== undefined;
  if (hasContent) return;

  // Legacy row from an earlier seed: backfill the full structured content once.
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
      slug: "features",
      key: "cta_banner",
      heading: "Ready to Experience",
      body: "Join thousands of salon owners who are running their business smarter with SalonAI.",
      cta_label: "Book a Demo",
      cta_href: "/request-demo",
      image_url: "",
      extra: {
        eyebrow: "Get Started",
        heading_accent: "All Features?",
        secondary_cta_label: "Contact Sales",
        secondary_cta_href: "/contact",
        image_alt: "SalonAI Dashboard",
      },
      sort: 5,
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
    await upsertSection(conn, pageId, s);
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
