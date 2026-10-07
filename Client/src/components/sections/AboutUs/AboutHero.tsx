"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultAboutContent, fallbackImages, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["hero"];
};

export default function AboutHero({ content = defaultAboutContent.hero }: Props) {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden bg-salon-bg lg:min-h-[min(760px,100svh)]">
      {/* On desktop the photo fills the right half, same as the home hero. */}
      <div className="relative h-[52vh] min-h-[380px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[52%]">
        <CmsImage
          value={content.image_url}
          fallback={fallbackImages.about_hero}
          alt={content.image_alt}
          fill
          priority
          className="object-contain object-center"
          sizes="(max-width: 1024px) 100vw, 52vw"
        />
        <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-salon-bg to-transparent lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex py-12 lg:min-h-[590px] lg:w-[47%] lg:items-center lg:pb-32 lg:pt-24">
          <div className="w-full max-w-xl">
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

          </div>
        </div>
      </div>
    </section>
  );
}
