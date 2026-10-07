"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  BadgeDollarSign,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
} from "lucide-react";

const NAV_SECTIONS: {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    /** Show the unread-enquiry count next to this item. */
    liveBadge?: "enquiries";
  }[];
}[] = [
  {
    title: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Engagement",
    items: [{ href: "/enquiries", label: "Enquiries", icon: Inbox, liveBadge: "enquiries" }],
  },
  {
    title: "Content",
    items: [
      { href: "/pages", label: "Pages", icon: FileText },
      { href: "/media", label: "Media", icon: ImageIcon },
      { href: "/blog", label: "Blog", icon: Newspaper },
      { href: "/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
  {
    title: "Monetization",
    items: [{ href: "/pricing", label: "Pricing", icon: BadgeDollarSign }],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);

  const loadNewCount = useCallback(async () => {
    try {
      const res = await fetch("/api/enquiries/count", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setNewCount(Math.max(0, Number(data.new ?? 0)));
    } catch {
      // Best-effort: a failed poll just keeps the last known number.
    }
  }, []);

  useEffect(() => {
    // Deferred so the effect body only schedules work, it never sets state.
    const initial = setTimeout(loadNewCount, 0);
    const id = setInterval(loadNewCount, 30_000);
    window.addEventListener("focus", loadNewCount);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
      window.removeEventListener("focus", loadNewCount);
    };
  }, [loadNewCount, pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = adminName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-salon-border/70 px-5">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-display text-[1.75rem] font-medium tracking-[-0.045em] text-salon-ink">
              Salon <span className="text-salon-gold">AI</span>
            </span>
            <span className="mt-1 pl-0.5 text-[8px] font-medium uppercase tracking-[0.24em] text-salon-muted">
              Manage. Grow. Shine.
            </span>
          </Link>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-[#0D1140] text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`h-[18px] w-[18px] shrink-0 ${
                            active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        />
                        {item.label}
                        {item.liveBadge === "enquiries" && newCount > 0 ? (
                          <span
                            aria-label={`${newCount} new enquiries`}
                            className={`ml-auto rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none tabular-nums transition ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-red-500 text-white shadow-sm"
                            }`}
                          >
                            {newCount > 99 ? "99+" : newCount}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0D1140]/10 text-xs font-bold text-[#0D1140]">
              {initials || "A"}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-slate-800">{adminName}</p>
              <p className="truncate text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Log out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
