"use client";

import React from "react";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import { defaultFeaturesContent, fallbackImages, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["platform_showcase"];
};

export default function PlatformShowcase({
  content = defaultFeaturesContent.platform_showcase,
}: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="order-2 flex justify-center lg:order-1 lg:col-span-6">
            <div className="relative aspect-[3/2] w-full max-w-lg">
              <CmsImage
                value={content.image_url}
                fallback={fallbackImages.features_platform}
                alt={content.image_alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            {content.eyebrow ? (
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-9 bg-salon-rule" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                  {content.eyebrow}
                </span>
              </div>
            ) : null}

            <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-salon-ink sm:text-4xl lg:text-[2.7rem]">
              {content.heading}
              {content.heading_accent ? (
                <span className="block text-salon-accent">{content.heading_accent}</span>
              ) : null}
            </h2>

            {content.body ? (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-salon-muted">
                {content.body}
              </p>
            ) : null}

            {content.benefits.length ? (
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {content.benefits.map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                      <CmsIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-salon-ink">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-salon-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
