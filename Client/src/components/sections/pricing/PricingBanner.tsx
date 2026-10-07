import React from "react";
import Link from "next/link";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import type { PricingIncludedItem } from "@/lib/content";

export type PricingBannerProps = {
  strip_heading?: string;
  items?: PricingIncludedItem[];
  title?: string;
  subtitle?: string;
  cta_label?: string;
  cta_href?: string;
  secondary_cta_label?: string;
  secondary_cta_href?: string;
  image_url?: string;
  image_alt?: string;
};

/**
 * The "all plans include" strip plus the closing CTA.
 *
 * The strip items and banner media are CMS driven so they can be edited from
 * the admin Pricing screen.
 */
export default function PricingFeaturesBanner({
  strip_heading = "All plans include",
  items = [],
  title,
  subtitle,
  cta_label,
  cta_href,
  secondary_cta_label,
  secondary_cta_href,
  image_url,
  image_alt,
}: PricingBannerProps = {}) {
  const hasStrip = items.length > 0;
  const hasCta = Boolean(title || subtitle || cta_label || secondary_cta_label);

  if (!hasStrip && !hasCta) return null;

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-14 lg:pb-16">
      {hasStrip ? (
        <div className="w-full">
          <div className="border-y border-salon-card bg-salon-shell-soft p-6 text-center">
            <h3 className="mb-6 text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              {strip_heading}
            </h3>
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 sm:gap-10">
              {items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex flex-col items-center">
                  <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                    <CmsIcon name={item.icon} className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-semibold text-salon-ink">{item.title}</span>
                  {item.desc ? (
                    <span className="mt-0.5 text-[11px] text-salon-muted">{item.desc}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {hasCta ? (
        <div className="mx-auto mt-12 max-w-3xl px-5 text-center sm:px-8">
          {title ? (
            <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-3 text-sm leading-relaxed text-salon-muted">{subtitle}</p>
          ) : null}

          {image_url ? (
            <div className="relative mx-auto mt-8 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-salon-card bg-salon-shell-soft">
              <CmsImage
                value={image_url}
                alt={image_alt || "SalonAI platform"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          ) : null}

          {cta_label || secondary_cta_label ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {cta_label ? (
                <Link
                  href={cta_href || "/contact"}
                  className="rounded-lg bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark"
                >
                  {cta_label}
                </Link>
              ) : null}
              {secondary_cta_label ? (
                <Link
                  href={secondary_cta_href || "/request-demo"}
                  className="rounded-lg border border-salon-brand px-6 py-2.5 text-xs font-semibold text-salon-brand transition hover:bg-salon-tile/40"
                >
                  {secondary_cta_label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}