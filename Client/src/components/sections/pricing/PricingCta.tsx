"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import CmsImage from "@/components/ui/CmsImage";
import { images } from "@/assets";

export type PricingCtaProps = {
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
 * The closing "still not sure which plan" call-to-action.
 *
 * Copy and media are CMS driven from the Admin Pricing screen so they can be
 * edited without a deploy.
 */
export default function PricingCta({
  title,
  subtitle,
  cta_label,
  cta_href,
  secondary_cta_label,
  secondary_cta_href,
  image_url,
  image_alt,
}: PricingCtaProps = {}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });
  const boxWidth = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["90%", "100%", "100%", "90%"]);
  const boxRadius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["24px", "0px", "0px", "24px"]);

  const hasCta = Boolean(title || subtitle || cta_label || secondary_cta_label);
  if (!hasCta) return null;

  return (
    <section className="w-full overflow-hidden bg-salon-bg">
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
    </section>
  );
}
