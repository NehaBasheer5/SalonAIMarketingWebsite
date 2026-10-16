import React from "react";
import type { PricingIncludedItem } from "@/lib/content";

export type PricingBannerProps = {
  strip_heading?: string;
  items?: PricingIncludedItem[];
};

/**
 * The "all plans include" strip.
 *
 * Items are CMS driven from the Admin Pricing screen so they can be edited
 * without a deploy.
 */
export default function PricingBanner({
  strip_heading = "All plans include",
  items = [],
}: PricingBannerProps = {}) {
  const hasStrip = items.length > 0;
  if (!hasStrip) return null;

  return (
    <section className="w-full overflow-hidden bg-salon-bg pt-14 pb-14 lg:pb-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <h3 className="mb-8 text-center text-[40px] font-semibold text-black">{strip_heading}</h3>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex min-h-[230px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(91,64,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(91,64,39,0.12)]"
            >
              <span className="text-lg font-semibold text-salon-ink sm:text-xl">{item.title}</span>
              {item.desc ? (
                <span className="mt-2 text-base text-salon-muted sm:text-lg">{item.desc}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
