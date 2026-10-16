"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type NavLink = { label: string; href: string };

export type NavbarSettings = {
  /** Resolved logo URL; when empty the brand wordmark is rendered instead. */
  logoSrc: string;
  logoAlt: string;
  brandName: string;
  brandAccent: string;
  tagline: string;
  navItems: NavLink[];
  secondary: NavLink;
  cta: NavLink;
};

export default function Navbar({
  logoSrc,
  logoAlt,
  brandName,
  brandAccent,
  tagline,
  navItems,
  secondary,
  cta,
}: NavbarSettings) {
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

  const brand = logoSrc ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={logoSrc} alt={logoAlt || brandName} className="h-20 w-auto sm:h-[5.5rem]" />
  ) : (
    <>
      <span className="font-display text-[2rem] font-medium tracking-[-0.045em] text-salon-ink">
        {brandName} <span className="text-salon-gold">{brandAccent}</span>
      </span>
      {tagline ? (
        <span className="mt-1 pl-0.5 text-[10px] font-medium uppercase tracking-[0.24em] text-salon-muted">
          {tagline}
        </span>
      ) : null}
    </>
  );

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          scrolled
            ? "border-b border-salon-border/60 bg-salon-bg/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <Link href="/" className="group flex flex-col leading-none" aria-label={brandName}>
          {brand}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={`${item.label}-${item.href}`}
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
          {secondary.label ? (
            <Link
              href={secondary.href || "/"}
              className="text-base font-semibold text-salon-ink hover:text-salon-gold"
            >
              {secondary.label}
            </Link>
          ) : null}
          {cta.label ? (
            <Link
              href={cta.href || "/"}
              className="rounded-lg bg-salon-ink px-6 py-2.5 text-base font-semibold text-white transition hover:bg-black"
            >
              {cta.label}
            </Link>
          ) : null}
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
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-salon-ink"
              >
                {item.label}
              </Link>
            ))}
            {secondary.label ? (
              <Link
                href={secondary.href || "/"}
                onClick={() => setOpen(false)}
                className="text-base font-semibold"
              >
                {secondary.label}
              </Link>
            ) : null}
            {cta.label ? (
              <Link
                href={cta.href || "/"}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-salon-ink px-5 py-2.5 text-center text-base font-semibold text-white"
              >
                {cta.label}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      </header>

      {!isHome ? <div className="h-24" aria-hidden="true" /> : null}
    </>
  );
}

