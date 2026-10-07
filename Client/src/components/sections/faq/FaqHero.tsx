"use client";

import React from "react";
import { Search } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { fallbackImages } from "@/lib/content";

type Props = {
  content?: {
    eyebrow?: string;
    heading?: string;
    heading_accent?: string;
    subheading?: string;
    search_placeholder?: string;
    search_label?: string;
    image_url?: string;
    image_alt?: string;
  };
};

export default function FaqHero({ content }: Props) {
  const eyebrow = content?.eyebrow || "FAQ";
  const heading = content?.heading || "Got Questions?";
  const headingAccent = content?.heading_accent || "We've Got Answers";
  const subheading =
    content?.subheading ||
    "Find quick answers to the most common questions about SalonAI. Can't find what you're looking for? Feel free to contact our team.";
  const searchPlaceholder = content?.search_placeholder || "Search for answers...";
  const searchLabel = content?.search_label || "Search";

  return (
    <section className="relative w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {eyebrow}
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
              {heading}
              <span className="block text-salon-accent">{headingAccent}</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-salon-muted">
              {subheading}
            </p>

            <div className="mt-8 flex max-w-md items-center gap-2 rounded-xl border border-salon-card bg-white/80 p-2 shadow-sm">
              <Search className="ml-2 h-5 w-5 text-salon-muted/60" />
<input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-salon-ink outline-none placeholder:text-salon-muted/60"
              />
              <button
                type="button"
                className="rounded-lg bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark"
              >
                {searchLabel}
              </button>
            </div>
          </div>

<div className="lg:col-span-5">
            <div className="relative mt-2 w-full lg:-ml-16 lg:-mt-6">
              <CmsImage
                value={content?.image_url}
                fallback={fallbackImages.about_hero}
                alt={content?.image_alt || "SalonAI support team"}
                className="h-auto w-full scale-95 object-contain lg:scale-[1.05]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
