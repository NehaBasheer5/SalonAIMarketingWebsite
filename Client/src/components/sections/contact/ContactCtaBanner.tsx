"use client";

import React from "react";
import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";
import { images } from "@/assets";
import pricingCtaVideo from "@/assets/images/images/pricingCTA.mp4";

export type ContactCtaBannerProps = {
  eyebrow: string;
  heading: string;
  heading_accent?: string;
  subheading?: string;
  cta_label: string;
  cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  image_url?: string;
  image_alt?: string;
};

export default function ContactCtaBanner({
  eyebrow,
  heading,
  heading_accent,
  subheading,
  cta_label,
  cta_href,
  secondary_cta_label,
  secondary_cta_href,
  image_url,
  image_alt,
}: ContactCtaBannerProps) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg pt-8 pb-16 lg:pt-12 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="relative flex min-h-[320px] items-center overflow-hidden rounded-3xl border border-salon-brand shadow-[0_24px_60px_rgba(133,89,47,0.35)] lg:min-h-[400px]">
          {image_url ? (
            <CmsImage
              value={image_url}
              fallback={images.dashboardMockup}
              alt={image_alt || "SalonAI"}
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          ) : (
            <video
              src={pricingCtaVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1a0e]/90 via-salon-brand-dark/70 to-salon-brand/20" />

          <div className="relative max-w-xl p-8 text-white lg:p-12">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                {eyebrow}
              </p>
            ) : null}
            <h3 className="mt-1 font-display text-2xl leading-tight text-white sm:text-3xl">
              {heading}
              {heading_accent ? (
                <span className="italic text-white/85"> {heading_accent}</span>
              ) : null}
            </h3>
            {subheading ? (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">{subheading}</p>
            ) : null}

            {cta_label || secondary_cta_label ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {cta_label ? (
                  <Link
                    href={cta_href || "/request-demo"}
                    className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-salon-brand transition hover:bg-salon-chip"
                  >
                    {cta_label}
                  </Link>
                ) : null}
                {secondary_cta_label ? (
                  <Link
                    href={secondary_cta_href || "/contact"}
                    className="rounded-lg border border-white/45 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    {secondary_cta_label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
