"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { images } from "@/assets";
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
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                FAQ
              </span>
            </div>
            <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
              {heading || (
                <>
                  Frequently Asked <span className="text-salon-accent">Questions</span>
                </>
              )}
            </h2>
            {subheading ? (
              <p className="mt-3 text-sm leading-relaxed text-salon-muted">{subheading}</p>
            ) : null}

            {faqs.length ? (
              <div className="mt-6 space-y-3">
                {faqs.map((faq, index) => {
                  const open = openIdx === index;
                  return (
                    <div
                      key={`${faq.question}-${index}`}
                      className="overflow-hidden rounded-2xl border border-salon-card bg-white/80"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIdx(open ? null : index)}
                        className="flex w-full items-center justify-between gap-4 p-4 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-salon-tile text-[11px] font-bold text-salon-brand">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-semibold text-salon-ink">{faq.question}</span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-salon-brand transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {open ? (
                        <p className="border-t border-salon-card px-4 py-3 text-xs leading-relaxed text-salon-muted">
                          {faq.answer}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {link_label ? (
              <div className="mt-4">
                <Link
                  href={link_href || "/faq"}
                  className="text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
                >
                  {link_label}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-salon-brand bg-salon-brand p-8 text-white shadow-[0_16px_40px_rgba(133,89,47,0.2)]">
              <div>
                {cta_eyebrow ? (
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-9 bg-white/40" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75">
                      {cta_eyebrow}
                    </span>
                  </div>
                ) : null}

                <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
                  {cta_heading}
                  {cta_heading_accent ? (
                    <span className="italic text-white/85"> {cta_heading_accent}</span>
                  ) : null}
                </h3>
                {cta_subheading ? (
                  <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/80">
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

              <div className="relative mt-6 hidden aspect-[16/10] w-full sm:block">
                <CmsImage
                  value={image_url}
                  fallback={images.dashboardMockup}
                  alt={image_alt}
                  fill
                  className="rounded-lg object-contain opacity-95"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}