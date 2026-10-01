"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import { defaultAboutContent, fallbackImages, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["hero"];
};

export default function AboutHero({ content = defaultAboutContent.hero }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {content.eyebrow ? (
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-9 bg-salon-rule" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                  {content.eyebrow}
                </span>
              </div>
            ) : null}

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl lg:text-[4rem]">
              {content.heading}
              {content.heading_accent ? (
                <span className="block text-salon-accent">{content.heading_accent}</span>
              ) : null}
            </h1>

            {content.subheading ? (
              <p className="mt-5 max-w-lg text-base leading-relaxed text-salon-muted">
                {content.subheading}
              </p>
            ) : null}

            {content.cta_label || content.secondary_cta_label ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {content.cta_label ? (
                  <Link
                    href={content.cta_href || "/request-demo"}
                    className="inline-flex items-center gap-2 rounded-lg bg-salon-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-salon-brand-dark"
                  >
                    {content.cta_label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}

                {content.secondary_cta_label ? (
                  <Link
                    href={content.secondary_cta_href || "/features"}
                    className="inline-flex items-center rounded-lg border border-salon-brand px-7 py-3.5 text-sm font-semibold text-salon-brand transition hover:bg-salon-tile/40"
                  >
                    {content.secondary_cta_label}
                  </Link>
                ) : null}
              </div>
            ) : null}

            {content.highlights.length ? (
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-salon-border/80 pt-8 sm:grid-cols-4">
                {content.highlights.map((item) => (
                  <div key={item.title} className="min-w-0 text-center">
                    <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                      <CmsIcon name={item.icon} className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <p className="text-xs font-semibold text-salon-ink">{item.title}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-salon-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <div className="relative -mt-14 w-full lg:-ml-16 lg:-mt-32">
              <CmsImage
                value={content.image_url}
                fallback={fallbackImages.about_hero}
                alt={content.image_alt}
                className="h-auto w-full scale-110 object-contain lg:scale-125"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
