import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultFeaturesContent, fallbackImages, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["cta_banner"];
};

export default function FeaturesCta({ content = defaultFeaturesContent.cta_banner }: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-salon-brand bg-salon-brand px-6 py-12 text-white shadow-[0_16px_40px_rgba(133,89,47,0.24)] sm:px-12 sm:py-16">
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {content.eyebrow ? (
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-9 bg-white/40" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75">
                    {content.eyebrow}
                  </span>
                </div>
              ) : null}

              <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-white sm:text-4xl">
                {content.heading}
                {content.heading_accent ? (
                  <span className="italic text-white/85"> {content.heading_accent}</span>
                ) : null}
              </h2>

              {content.body ? (
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
                  {content.body}
                </p>
              ) : null}

              {content.cta_label || content.secondary_cta_label ? (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {content.cta_label ? (
                    <Link
                      href={content.cta_href || "/request-demo"}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-salon-brand transition hover:bg-salon-chip"
                    >
                      {content.cta_label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}

                  {content.secondary_cta_label ? (
                    <Link
                      href={content.secondary_cta_href || "/contact"}
                      className="inline-flex items-center rounded-lg border border-white/45 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {content.secondary_cta_label}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="hidden justify-end lg:col-span-5 lg:flex">
              <div className="relative h-[200px] w-[300px]">
                <CmsImage
                  value={content.image_url}
                  fallback={fallbackImages.features_cta}
                  alt={content.image_alt}
                  fill
                  className="object-contain"
                  sizes="300px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
