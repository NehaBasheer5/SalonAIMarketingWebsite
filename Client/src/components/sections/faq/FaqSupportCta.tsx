"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import staffImg from "@/assets/images/images/StaffM.jpg";

type Props = {
  content?: Partial<{
    eyebrow: string;
    heading: string;
    heading_accent: string;
    subheading: string;
    cta_label: string;
    cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    image_url: string;
    image_alt: string;
  }>;
};

function unwrap(value: string | undefined, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export default function FaqSupportCta({ content = {} }: Props) {
  const eyebrow = unwrap(content.eyebrow, "Still have questions?");
  const heading = unwrap(content.heading, "Our Support Team is Here to");
  const headingAccent = unwrap(content.heading_accent, "Help");
  const subheading = unwrap(
    content.subheading,
    "Can't find the answer you're looking for? Get in touch with our friendly support team and we'll be happy to assist you."
  );
  const imageAlt = unwrap(content.image_alt, "SalonAI support team");
  const primary = {
    label: unwrap(content.cta_label, "Contact Support").replace(/[\s\u2192]+$/g, ""),
    href: unwrap(content.cta_href, "/contact"),
  };
  const secondary = {
    label: unwrap(content.secondary_cta_label, "Book a Demo"),
    href: unwrap(content.secondary_cta_href, "/request-demo"),
  };

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-16 pt-4 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-salon-muted">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
              {heading} <span className="italic text-salon-brand">{headingAccent}</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-salon-muted sm:text-lg">
              {subheading}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={primary.href}
                className="inline-flex items-center gap-2 rounded-lg bg-salon-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-salon-brand-dark"
              >
                {primary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondary.href}
                className="rounded-lg border border-salon-card px-6 py-3 text-sm font-semibold text-salon-ink transition hover:bg-salon-shell"
              >
                {secondary.label}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[280px] w-full max-w-md overflow-hidden rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:h-[360px] sm:max-w-lg lg:mx-0 lg:h-[420px] lg:max-w-none">
            <CmsImage
              value={content.image_url}
              fallback={staffImg}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
