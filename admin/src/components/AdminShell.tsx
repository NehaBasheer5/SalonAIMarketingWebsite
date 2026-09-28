"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/pages", label: "Pages" },
  { href: "/media", label: "Media" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
  { href: "/pricing", label: "Pricing" },
];

export default function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="w-60 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
          <div className="mb-8 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">SalonAI</p>
            <h1 className="text-lg font-bold text-[#0D1140]">Admin CMS</h1>
          </div>
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-[#0D1140] text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-10 border-t border-slate-100 px-2 pt-4">
            <p className="truncate text-xs text-slate-500">{adminName}</p>
            <button
              onClick={logout}
              className="mt-2 text-sm font-semibold text-red-600 hover:underline"
            >
              Log out
            </button>
          </div>
        </aside>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
