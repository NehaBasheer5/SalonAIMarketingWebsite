import Link from "next/link";
import { getPool, RowDataPacket } from "@/lib/db";

export default async function DashboardPage() {
  const pool = getPool();
  const [[pages]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS c FROM pages");
  const [[media]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS c FROM media");
  const [[posts]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS c FROM blog_posts");
  const [[faqs]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS c FROM faqs");
  const [[plans]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS c FROM pricing_plans");

  const cards = [
    { label: "Pages", value: pages.c, href: "/pages" },
    { label: "Media files", value: media.c, href: "/media" },
    { label: "Blog posts", value: posts.c, href: "/blog" },
    { label: "FAQs", value: faqs.c, href: "/faqs" },
    { label: "Pricing plans", value: plans.c, href: "/pricing" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Dashboard</h2>
        <p className="text-sm text-slate-600">
          Manage Client website content, images, blog, FAQs and pricing.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0D1140]/30"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{Number(card.value)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
