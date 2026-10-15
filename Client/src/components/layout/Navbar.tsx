"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "For Business", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  // The header stays fixed on top; once the page scrolls it swaps the
  // transparent hero treatment for a blurred, readable bar.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          scrolled
            ? "border-b border-salon-border/60 bg-salon-bg/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-[2rem] font-medium tracking-[-0.045em] text-salon-ink">
            Salon <span className="text-salon-gold">AI</span>
          </span>
          <span className="mt-1 pl-0.5 text-[10px] font-medium uppercase tracking-[0.24em] text-salon-muted">
            Manage. Grow. Shine.
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative text-base font-medium transition-colors ${
                  active ? "text-salon-ink" : "text-salon-muted hover:text-salon-ink"
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-salon-gold" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            className="text-base font-semibold text-salon-ink hover:text-salon-gold"
          >
            Login
          </Link>
          <Link
            href="/request-demo"
            className="rounded-lg bg-salon-ink px-6 py-2.5 text-base font-semibold text-white transition hover:bg-black"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-salon-ink lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-salon-border bg-salon-bg px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-salon-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="text-base font-semibold">
              Login
            </Link>
            <Link
              href="/request-demo"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-salon-ink px-5 py-2.5 text-center text-base font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      ) : null}
      </header>

      {!isHome ? <div className="h-20" aria-hidden="true" /> : null}
    </>
  );
}
