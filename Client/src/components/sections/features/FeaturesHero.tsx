"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { defaultFeaturesContent, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["hero"];
};

export default function FeaturesHero({ content = defaultFeaturesContent.hero }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="flex items-center justify-center pb-10 pt-2 text-center lg:pb-14 lg:pt-4">
          <div className="w-full max-w-2xl">
            <h1 className="font-display text-4xl leading-[1.06] tracking-tight text-salon-ink sm:text-5xl lg:text-[3.25rem]">
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
                    href={content.secondary_cta_href || "/about"}
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
