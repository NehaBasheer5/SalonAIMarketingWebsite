"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import CmsImage from "@/components/ui/CmsImage";
import { images } from "@/assets";
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
 * The closing CTA plus the "all plans include" strip.
 *
 * The strip is a full-width block placed directly above the FAQ section. Both
 * the strip items and the banner media are CMS driven so they can be edited
 * from the admin Pricing screen.
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
  const boxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });
  const boxWidth = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["90%", "100%", "100%", "90%"]);
  const boxRadius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["24px", "0px", "0px", "24px"]);

  const hasStrip = items.length > 0;
  const hasCta = Boolean(title || subtitle || cta_label || secondary_cta_label);

  if (!hasStrip && !hasCta) return null;

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-14 lg:pb-16">
      {hasCta ? (
        <div ref={boxRef} className="relative">
          <motion.div
            style={{ width: boxWidth, borderRadius: boxRadius }}
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden bg-[linear-gradient(90deg,#271a0f_0%,#503420_52%,#9a7248_100%)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,238,216,0.30),transparent_62%)]"
            />
          </motion.div>

          <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 lg:grid-cols-2">
            <div className="relative z-10 flex flex-col justify-center px-5 py-20 sm:px-8 lg:py-28 lg:pl-32 lg:pr-10 xl:pl-52">
            {title ? (
              <h2 className="max-w-2xl font-display text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                {subtitle}
              </p>
            ) : null}

            {cta_label || secondary_cta_label ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {cta_label ? (
                  <Link
                    href={cta_href || "/contact"}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-salon-brand-dark transition hover:bg-salon-shell"
                  >
                    {cta_label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
                {secondary_cta_label ? (
                  <Link
                    href={secondary_cta_href || "/request-demo"}
                    className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    {secondary_cta_label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="relative h-[320px] sm:h-[420px] lg:h-auto lg:min-h-[620px]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-white/70 via-salon-gold-soft/40 to-transparent blur-3xl"
            />
            <CmsImage
              value={image_url}
              fallback={images.pricingStillNot}
              alt={image_alt || "Smiling salon owner"}
              fill
              className="object-contain object-center drop-shadow-[0_8px_36px_rgba(255,255,255,0.35)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          </div>
        </div>
      ) : null}

      {hasStrip ? (
        <div className="mx-auto mt-14 max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
          <h3 className="mb-8 text-center text-[40px] font-semibold text-black">
            {strip_heading}
          </h3>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(91,64,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(91,64,39,0.12)]"
              >
                <span className="text-lg font-semibold text-salon-ink sm:text-xl">
                  {item.title}
                </span>
                {item.desc ? (
                  <span className="mt-2 text-base text-salon-muted sm:text-lg">{item.desc}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
