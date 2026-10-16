import fs from "fs";
import path from "path";
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

const posts = [
  {
    title: "How to Reduce No-Shows in Your Salon",
    slug: "how-to-reduce-no-shows-in-your-salon",
    excerpt:
      "Practical tactics — deposits, reminders and smart waitlists — that keep your chairs full.",
    category: "Management",
    author: "Priya Menon",
    tags: "No-Shows,Bookings,Management",
    read_time: "4 min read",
    content: [
      "A no-show is not just an empty chair. It is the colour that was mixed, the stylist who waited, and the client who could have taken that slot.",
      "",
      "## Ask for a deposit",
      "",
      "Even a small deposit changes behaviour. Clients who have paid something show up. Keep it refundable up to 24 hours so it never feels unfair.",
      "",
      "## Remind them twice",
      "",
      "One reminder 24 hours before, one two hours before. Two short messages cut no-shows far more than one long one.",
      "",
      "## Hold a live waitlist",
      "",
      "When someone cancels, the waitlist gets an automated offer. Most salons recover half their cancelled revenue just by being fast.",
      "",
      "> No-shows are a system problem, not a people problem. Fix the system.",
    ].join("\n"),
  },
  {
    title: "Seasonal Promotions That Actually Fill Your Calendar",
    slug: "seasonal-promotions-that-fill-your-calendar",
    excerpt:
      "Plan your offers around the natural peaks and dips of the salon year and never discount in a vacuum.",
    category: "Marketing",
    author: "Emily Roberts",
    tags: "Promotions,Seasonal,Revenue",
    read_time: "5 min read",
    content: [
      "Every salon has a rhythm. January is fresh starts, May is weddings, August is holidays, November is party season. Plan around it.",
      "",
      "## Match the offer to the season",
      "",
      "- **January:** grooming and goal packages.",
      "- **Spring:** bridal trials and colour refreshes.",
      "- **Summer:** travel-size product bundles.",
      "- **Autumn:** repair treatments after sun and salt.",
      "- **Festive:** gift cards and party-ready slots.",
      "",
      "## Bundle, do not discount",
      "",
      "A 20 percent cut trains clients to wait. A bundle of a cut, treatment and retail item at a package price protects your margin and raises the ticket.",
      "",
      "## Track every campaign",
      "",
      "Give each promotion its own code. If you cannot attribute the booking, you cannot repeat what worked.",
    ].join("\n"),
  },
  {
    title: "Building a Client Loyalty Program Your Regulars Will Love",
    slug: "building-a-client-loyalty-program",
    excerpt:
      "Simple loyalty structures that reward frequency without eating into your margin.",
    category: "Growth",
    author: "Sarah Johnson",
    tags: "Loyalty,Retention,Growth",
    read_time: "6 min read",
    content: [
      "Acquiring a new client costs several times more than keeping one. A loyalty program is the cheapest growth lever you have.",
      "",
      "## Points or punch card?",
      "",
      "Punch cards are simple and work for visit-based loyalty. Points work better when your service mix is wide, because clients can aim at what they actually want.",
      "",
      "## Reward the behaviour you want",
      "",
      "Give the best rewards for rebooking at checkout, referrals and off-peak visits. Loyalty should steer the calendar, not just say thank you.",
      "",
      "## Keep the rules short",
      "",
      "If staff need a manual to explain it, it is too complicated. Three rules, printed on the card, is the sweet spot.",
      "",
      "SalonAI tracks visits and points automatically, so nobody has to remember stamps.",
    ].join("\n"),
  },
  {
    title: "Retail Sales in Salons: Turning Chairs Into Revenue",
    slug: "retail-sales-in-salons-turning-chairs-into-revenue",
    excerpt:
      "How to recommend retail naturally, display products better and grow retail share past 20 percent.",
    category: "Growth",
    author: "Michael Brown",
    tags: "Retail,Sales,Revenue",
    read_time: "5 min read",
    content: [
      "Retail is the part of the business that keeps earning after the client leaves. Most salons sit under 10 percent retail share. The ceiling is closer to 25.",
      "",
      "## Recommend from the chair",
      "",
      "The product conversation belongs in the service, not at the till. If the stylist explains what they used and why, the client decides before they ever see a price.",
      "",
      "## Display at eye level",
      "",
      "One shelf at eye level outsells a whole wall below the knee. Curate fewer brands and give them space.",
      "",
      "## Track retail per client",
      "",
      "Your software should show retail attached to each visit. Once stylists see their own number, it moves.",
      "",
      "> Clients do not resist buying products. They resist being sold to after a service they already paid for.",
    ].join("\n"),
  },
  {
    title: "Hiring and Keeping Great Salon Staff",
    slug: "hiring-and-keeping-great-salon-staff",
    excerpt:
      "Recruitment, onboarding and culture habits that reduce salon turnover for good.",
    category: "Management",
    author: "David Wilson",
    tags: "Hiring,Team,Culture",
    read_time: "7 min read",
    content: [
      "Staff turnover is the quiet killer of salon profit. Every departure costs recruitment, training and the clients who followed that stylist out of the door.",
      "",
      "## Hire for attitude, train for skill",
      "",
      "Technique can be taught in months. Tone with clients in the chair is far harder to change. Watch how a candidate talks to the receptionist before you look at their portfolio.",
      "",
      "## Onboard with a plan",
      "",
      "First week goals, a named mentor and a 30-day check-in. Salons that do this keep new hires twice as long.",
      "",
      "## Grow them deliberately",
      "",
      "Monthly one-to-ones, a clear path from junior to senior, and a training budget they can see. Ambition that has nowhere to go walks out the door.",
      "",
      "## Share the numbers",
      "",
      "Teams that understand rebooking rate and retail share make better choices without being told. Transparency builds ownership.",
    ].join("\n"),
  },
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  for (const post of posts) {
    await conn.query(
      `INSERT INTO blog_posts
         (title, slug, excerpt, content, category, author, tags, read_time, is_popular, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 'published', NOW())
       ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content)`,
      [
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.category,
        post.author,
        post.tags,
        post.read_time,
      ]
    );
    console.log(`Seeded: ${post.title}`);
  }

  const [rows] = await conn.query("SELECT COUNT(*) AS total FROM blog_posts");
  console.log("Total posts in DB:", (rows as any[])[0].total);

  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
