"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultAboutContent, resolveImageUrl, type AboutContent } from "@/lib/content";
import aboutVideo from "@/assets/images/images/contact.mp4";

type Props = {
  content?: AboutContent["hero"];
};

export default function AboutHero({ content = defaultAboutContent.hero }: Props) {
  const hasCmsMedia = Boolean(resolveImageUrl(content.image_url));

  return (
    <section className="relative w-full overflow-hidden bg-salon-bg">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="flex flex-col items-center gap-16 pt-20 pb-10 lg:pt-28 lg:pb-14">
          <div className="-mt-8 w-full max-w-3xl text-center lg:-mt-12">
            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl lg:text-[4rem]">
              {content.heading}
              {content.heading_accent ? (
                <span className="block bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                  {content.heading_accent}
                </span>
              ) : null}
            </h1>

            {content.subheading ? (
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-salon-muted">
                {content.subheading}
              </p>
            ) : null}

            {content.cta_label || content.secondary_cta_label ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {content.cta_label ? (
                  <Link
                    href={content.cta_href || "/request-demo"}
                    className="inline-flex items-center gap-2 rounded-lg bg-salon-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
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

          <div className="relative mx-auto aspect-[8/5] w-full max-w-5xl overflow-hidden rounded-2xl border border-salon-card bg-salon-shell shadow-sm">
            {hasCmsMedia ? (
              <CmsImage
                value={content.image_url}
                alt={content.image_alt}
                fill
                controls={false}
                className="h-full w-full object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            ) : (
              <video
                src={aboutVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={content.image_alt}
                className="h-full w-full object-cover object-center"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
