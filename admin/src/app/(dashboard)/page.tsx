import Link from "next/link";
import {
  BarChart3,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  Newspaper,
  TrendingUp,
  BadgeDollarSign,
  MessagesSquare,
  Phone,
} from "lucide-react";
import { getPool, RowDataPacket } from "@/lib/db";
import {
  ContentBarChart,
  EnquiriesTrendChart,
  SourceBarChart,
  StatusPieChart,
  TopPostsBarChart,
} from "@/components/dashboard/Charts";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

const PLANS_COUNT_SQL = `SELECT COALESCE(JSON_LENGTH(JSON_EXTRACT(s.extra_json, '$.plans')), 0) AS c
  FROM page_sections s
  JOIN pages p ON p.id = s.page_id
  WHERE p.slug = 'pricing' AND s.section_key = 'pricing_cards'
  LIMIT 1`;

type Enquiry = {
  id: number;
  name: string;
  subject: string | null;
  source: string;
  status: string;
  created_at: string | Date;
};

export default async function DashboardPage() {
  const [
    pageCount,
    mediaCount,
    postCount,
    faqCount,
    planCount,
    enquiryTotal,
    newCount,
    blogViews,
    trendRaw,
    statusRaw,
    sourceRaw,
    topPosts,
    recent,
  ] = await Promise.all([
    count("SELECT COUNT(*) AS c FROM pages"),
    count("SELECT COUNT(*) AS c FROM media"),
    count("SELECT COUNT(*) AS c FROM blog_posts"),
    count("SELECT COUNT(*) AS c FROM faqs"),
    count(PLANS_COUNT_SQL),
    count("SELECT COUNT(*) AS c FROM enquiries"),
    count("SELECT COUNT(*) AS c FROM enquiries WHERE status = 'new'"),
    count("SELECT COALESCE(SUM(view_count), 0) AS c FROM blog_posts"),
    rows<{ d: string; c: number }>(
      "SELECT DATE(created_at) AS d, COUNT(*) AS c FROM enquiries WHERE created_at >= CURRENT_DATE - INTERVAL 29 DAY GROUP BY DATE(created_at) ORDER BY d"
    ),
    rows<{ status: string; c: number }>(
      "SELECT status, COUNT(*) AS c FROM enquiries GROUP BY status"
    ),
    rows<{ source: string; c: number }>(
      "SELECT source, COUNT(*) AS c FROM enquiries GROUP BY source"
    ),
    rows<{ title: string; view_count: number }>(
      "SELECT title, view_count FROM blog_posts ORDER BY view_count DESC LIMIT 6"
    ),
    rows<Enquiry>(
      "SELECT id, name, subject, source, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 6"
    ),
  ]);

  const trend = fillLast30Days(trendRaw);
  const statusData = ["new", "read", "replied", "archived"].map((s) => ({
    name: STATUS_LABELS[s] ?? s,
    value: Number(statusRaw.find((r) => r.status === s)?.c ?? 0),
  }));
  const sourceData = sourceRaw.map((r) => ({ name: r.source, count: Number(r.c) }));
  const contentData = [
    { name: "Pages", count: pageCount },
    { name: "Media", count: mediaCount },
    { name: "Blog", count: postCount },
    { name: "FAQs", count: faqCount },
    { name: "Plans", count: planCount },
  ];
  const postData = topPosts.map((p) => ({
    title: p.title,
    short:
      p.title.length > 26 ? `${p.title.slice(0, 24)}…` : p.title,
    views: Number(p.view_count),
  }));

  const replyRate =
    enquiryTotal > 0
      ? Math.round(((statusData[2].value + statusData[3].value) / enquiryTotal) * 100)
      : 0;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0D1140]">Dashboard</h2>
          <p className="text-sm text-slate-600">{today}</p>
        </div>
        <Link
          href="/enquiries"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Inbox className="h-4 w-4" />
          View enquiries
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Inbox} label="Total enquiries" value={enquiryTotal} href="/enquiries" tone="navy" />
        <StatCard icon={MessagesSquare} label="New (unread)" value={newCount} href="/enquiries?status=new" tone="blue" />
        <StatCard icon={TrendingUp} label="Blog views" value={blogViews} href="/blog" tone="teal" />
        <StatCard icon={BarChart3} label="Reply rate" value={`${replyRate}%`} href="/enquiries" tone="gold" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Enquiries — last 30 days"
          subtitle="Leads sent from the contact & demo forms"
          className="lg:col-span-2"
        >
          <EnquiriesTrendChart data={trend} />
        </ChartCard>
        <ChartCard title="By status" subtitle="Current mailbox breakdown">
          <StatusPieChart data={statusData} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="By source" subtitle="Which form every lead came from">
          <SourceBarChart data={sourceData} />
        </ChartCard>
        <ChartCard title="Content overview" subtitle="Everything currently published">
          <ContentBarChart data={contentData} />
        </ChartCard>
        <ChartCard title="Top blog posts" subtitle="Ranked by page views">
          <TopPostsBarChart data={postData} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Recent enquiries</h3>
                <p className="text-xs text-slate-500">Latest messages from the marketing site</p>
              </div>
              <Link href="/enquiries" className="text-sm font-medium text-[#0D1140] hover:underline">
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-slate-400">No enquiries received yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent.map((row) => (
                  <li key={row.id} className="flex items-center gap-3 py-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-[#0D1140]">
                      {initials(row.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {row.name}
                        {row.subject ? <span className="ml-2 font-normal text-slate-500">— {row.subject}</span> : null}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {row.source === "request-demo" ? "Request a demo" : "Contact form"} ·{" "}
                        {formatDate(row.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={row.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Quick access</h3>
          <p className="mb-4 text-xs text-slate-500">Jump to any section</p>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink href="/pages" icon={FileText} label="Pages" value={pageCount} />
            <QuickLink href="/media" icon={ImageIcon} label="Media" value={mediaCount} />
            <QuickLink href="/blog" icon={Newspaper} label="Blog" value={postCount} />
            <QuickLink href="/faqs" icon={HelpCircle} label="FAQs" value={faqCount} />
            <QuickLink href="/pricing" icon={BadgeDollarSign} label="Pricing" value={planCount} />
            <QuickLink href="/enquiries" icon={Phone} label="Enquiries" value={enquiryTotal} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  href: string;
  tone: "navy" | "blue" | "teal" | "gold";
}) {
  const tones: Record<string, string> = {
    navy: "bg-[#0D1140]/10 text-[#0D1140]",
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600",
    gold: "bg-amber-50 text-amber-600",
  };
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0D1140]/30"
    >
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </Link>
  );
}

function ChartCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-3">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-slate-200 p-3 transition hover:border-[#0D1140]/40 hover:bg-slate-50"
    >
      <Icon className="h-4 w-4 text-[#0D1140]" />
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <span className="text-lg font-bold leading-none text-slate-900">{value}</span>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    read: "bg-amber-50 text-amber-700",
    replied: "bg-emerald-50 text-emerald-700",
    archived: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function fillLast30Days(
  rows: { d: string; c: number }[]
): { date: string; label: string; count: number }[] {
  const map = new Map(rows.map((r) => [String(r.d).slice(0, 10), Number(r.c)]));
  const out: { date: string; label: string; count: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    out.push({ date: key, label, count: map.get(key) ?? 0 });
  }
  return out;
}

/** Runs a single-row COUNT query; failures degrade to 0 instead of 500-ing the page. */
async function count(sql: string): Promise<number> {
  try {
    const [rows] = await getPool().query<RowDataPacket[]>(sql);
    return Number(rows[0]?.c ?? 0);
  } catch {
    return 0;
  }
}

/** Runs a multi-row query with LIMITs; failures degrade to an empty array. */
async function rows<T>(sql: string): Promise<T[]> {
  try {
    const [result] = await getPool().query<RowDataPacket[] & T[]>(sql);
    return (result ?? []) as T[];
  } catch {
    return [];
  }
}