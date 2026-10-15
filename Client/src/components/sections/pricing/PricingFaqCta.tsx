"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { images } from "@/assets";
import pricingCtaVideo from "@/assets/images/images/pricingCTA.mp4";
import type { PricingFaq } from "@/lib/content";

export type PricingFaqCtaProps = {
  heading?: string;
  subheading?: string;
  link_label?: string;
  link_href?: string;
  faqs?: PricingFaq[];
  cta_eyebrow?: string;
  cta_heading?: string;
  cta_heading_accent?: string;
  cta_subheading?: string;
  cta_label?: string;
  cta_href?: string;
  cta_secondary_label?: string;
  cta_secondary_href?: string;
  image_url?: string;
  image_alt?: string;
};

/** Pricing FAQs with the closing "get started" card. Both come from the CMS. */
export default function PricingFaqCta({
  heading,
  subheading,
  link_label = "View All FAQs →",
  link_href = "/faq",
  faqs = [],
  cta_eyebrow = "Get Started",
  cta_heading = "Ready to Transform",
  cta_heading_accent = "Your Salon?",
  cta_subheading = "Join thousands of salon owners who are streamlining their operations with SalonAI.",
  cta_label = "Book a Demo →",
  cta_href = "/request-demo",
  cta_secondary_label = "Contact Sales",
  cta_secondary_href = "/contact",
  image_url,
  image_alt = "SalonAI Dashboard Laptop View",
}: PricingFaqCtaProps = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div>
          <div className="text-center">
            <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
              {heading || (
                <>
                  Frequently Asked <span className="text-salon-accent">Questions</span>
                </>
              )}
            </h2>
            {subheading ? (
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-salon-muted">
                {subheading}
              </p>
            ) : null}
          </div>

          {faqs.length ? (
            <div className="mx-auto mt-8 max-w-3xl divide-y divide-salon-card">
              {faqs.map((faq, index) => {
                const open = openIdx === index;
                return (
                  <div key={`${faq.question}-${index}`}>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : index)}
                      className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="text-lg font-semibold text-salon-ink transition-colors duration-300 group-hover:text-salon-brand sm:text-xl">
                        {faq.question}
                      </span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          open
                            ? "rotate-45 border-salon-brand bg-salon-brand text-white"
                            : "border-salon-card text-salon-brand group-hover:border-salon-brand"
                        }`}
                      >
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-5 pr-10 text-base leading-relaxed text-salon-muted">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="relative mt-10 flex min-h-[320px] items-center overflow-hidden rounded-3xl border border-salon-brand shadow-[0_24px_60px_rgba(133,89,47,0.35)] lg:min-h-[400px]">
          {image_url ? (
            <CmsImage
              value={image_url}
              fallback={images.dashboardMockup}
              alt={image_alt}
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
              className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#2a1a0e]/90 via-salon-brand-dark/70 to-salon-brand/20" />

          <div className="relative max-w-xl p-8 text-white lg:p-12">
            <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
              {cta_heading}
              {cta_heading_accent ? (
                <span className="italic text-white/85"> {cta_heading_accent}</span>
              ) : null}
            </h3>
            {cta_subheading ? (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
                {cta_subheading}
              </p>
            ) : null}

            {cta_label || cta_secondary_label ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {cta_label ? (
                  <Link
                    href={cta_href || "/request-demo"}
                    className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-salon-brand transition hover:bg-salon-chip"
                  >
                    {cta_label}
                  </Link>
                ) : null}
                {cta_secondary_label ? (
                  <Link
                    href={cta_secondary_href || "/contact"}
                    className="rounded-lg border border-white/45 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    {cta_secondary_label}
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