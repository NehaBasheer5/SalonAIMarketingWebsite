"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Check, Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import BrandIcon, { hasBrandIcon } from "@/components/ui/BrandIcons";
import {
  defaultFooterContent,
  type FooterContact,
  type FooterContent,
  type FooterSocial,
} from "@/lib/content";

const SOCIAL_BRANDS: Record<string, string> = {
  instagram: "instagram",
  insta: "instagram",
  facebook: "facebook",
  fb: "facebook",
  linkedin: "linkedin",
  youtube: "youtube",
  yt: "youtube",
  twitter: "x",
  x: "x",
  tiktok: "tiktok",
  whatsapp: "whatsapp",
  telegram: "telegram",
  pinterest: "pinterest",
  blog: "rss",
  rss: "rss",
};

const SOCIAL_HREF_RULES: { match: RegExp; brand: string }[] = [
  { match: /instagram\.com/i, brand: "instagram" },
  { match: /facebook\.com|fb\.com|fb\.me/i, brand: "facebook" },
  { match: /linkedin\.com|lnkd\.in/i, brand: "linkedin" },
  { match: /youtube\.com|youtu\.be/i, brand: "youtube" },
  { match: /twitter\.com|(?:\/\/|\.)x\.com/i, brand: "x" },
  { match: /tiktok\.com/i, brand: "tiktok" },
  { match: /whatsapp\.com|wa\.me/i, brand: "whatsapp" },
  { match: /telegram\.me|t\.me|telegram\.org/i, brand: "telegram" },
  { match: /pinterest\.com|pin\.it/i, brand: "pinterest" },
];

function socialBrand(social: FooterSocial): string {
  const explicit = (social.icon || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (explicit && SOCIAL_BRANDS[explicit]) return SOCIAL_BRANDS[explicit];

  const fromHref = SOCIAL_HREF_RULES.find((rule) => rule.match.test(social.href || ""));
  if (fromHref) return fromHref.brand;

  const byLabel = (social.label || "").trim().toLowerCase();
  if (byLabel && SOCIAL_BRANDS[byLabel]) return SOCIAL_BRANDS[byLabel];

  return "";
}

function socialHref(social: FooterSocial): string {
  const href = (social.href || "").trim();
  if (!href) return "#";
  return /^https?:\/\//i.test(href) || href.startsWith("//") ? href : `https://${href}`;
}

function SocialGlyph({ social }: { social: FooterSocial }) {
  const brand = socialBrand(social);
  if (hasBrandIcon(brand)) return <BrandIcon brand={brand} className="h-4 w-4" />;
  return <Globe className="h-4 w-4" strokeWidth={1.8} />;
}

function contactIcon(item: FooterContact): LucideIcon {
  const label = item.label.toLowerCase();
  if (label.includes("mail")) return Mail;
  if (label.includes("call") || label.includes("phone")) return Phone;
  if (label.includes("visit") || label.includes("address") || label.includes("location")) {
    return MapPin;
  }
  return Globe;
}

const HEADING_CLASS = "text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-gold";
const LINK_CLASS =
  "text-sm text-white/55 transition hover:text-salon-gold focus-visible:text-salon-gold focus-visible:outline-none";

export default function Footer({
  content = defaultFooterContent.footer,
  newsletter = defaultFooterContent.newsletter,
  showNewsletter = true,
}: {
  content?: FooterContent["footer"];
  newsletter?: FooterContent["newsletter"];
  showNewsletter?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const res = await fetch(`${adminOrigin()}/api/public/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Please check the email address and try again.");
        return;
      }

      setState("done");
      setMessage(newsletter.success_message);
      setEmail("");
    } catch {
      setState("error");
      setMessage("Could not subscribe. Please try again.");
    }
  }

  return (
    <footer className="w-full overflow-hidden bg-salon-ink text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex flex-col leading-none">
              <span className="font-display text-[1.75rem] font-medium tracking-[-0.045em] text-white">
                Salon <span className="text-salon-gold">AI</span>
              </span>
              <span className="mt-1 pl-0.5 text-[8px] font-medium uppercase tracking-[0.24em] text-salon-gold-soft/70">
                {content.heading}
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {content.subheading}
            </p>

            {content.socials.length ? (
              <div className="mt-6 flex items-center gap-3">
                {content.socials.map((social) => (
                  <a
                    key={`${social.label}-${social.href}`}
                    href={socialHref(social)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/55 transition hover:border-salon-gold hover:text-salon-gold focus-visible:border-salon-gold focus-visible:text-salon-gold focus-visible:outline-none"
                  >
                    <SocialGlyph social={social} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <p className={HEADING_CLASS}>{content.explore_heading}</p>
            <ul className="mt-5 space-y-3">
              {content.explore_links.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link href={item.href} className={LINK_CLASS}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className={HEADING_CLASS}>{content.company_heading}</p>
            <ul className="mt-5 space-y-3">
              {content.company_links.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link href={item.href} className={LINK_CLASS}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <p className={HEADING_CLASS}>{content.contact_heading}</p>
            <ul className="mt-5 space-y-4">
              {content.contacts.map((item) => {
                const Icon = contactIcon(item);
                return (
                  <li key={`${item.label}-${item.value}`}>
                    <a
                      href={item.href}
                      className="group flex items-start gap-3 focus-visible:outline-none"
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-salon-gold transition group-hover:bg-salon-gold group-hover:text-salon-ink">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block break-words text-sm text-white/70 transition group-hover:text-white">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {showNewsletter ? (
          <div className="border-t border-white/10 py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <h3 className="font-display text-xl leading-tight text-white">
                  {newsletter.heading}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {newsletter.subheading}
                </p>
              </div>

              <form
                onSubmit={onSubmit}
                className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.email_placeholder}
                  aria-label={newsletter.email_placeholder}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-salon-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={state === "sending" || state === "done"}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-salon-gold px-6 py-3 text-sm font-semibold text-salon-ink transition hover:bg-salon-gold-soft disabled:opacity-60 sm:w-auto"
                >
                  {state === "done" ? <Check className="h-4 w-4" /> : null}
                  {state === "sending"
                    ? "Subscribing..."
                    : state === "done"
                      ? "Subscribed"
                      : newsletter.submit_label}
                </button>
              </form>
            </div>

            {message ? (
              <p
                className={`mt-3 text-xs lg:text-right ${
                  state === "error" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {message}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {content.copyright}
          </p>
          <p className="font-display text-[10px] uppercase tracking-[0.24em] text-salon-gold-soft/60">
            {content.footer_note}
          </p>
        </div>
      </div>
    </footer>
  );
}

function adminOrigin(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001").replace(/\/$/, "");
}
