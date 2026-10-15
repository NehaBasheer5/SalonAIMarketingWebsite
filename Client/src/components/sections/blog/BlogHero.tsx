"use client";

import React from "react";
import { ChevronDown, Search } from "lucide-react";
import contactVideo from "@/assets/images/images/contact.mp4";
import {
  defaultBlogContent,
  type BlogCategoryOption,
  type BlogContent,
} from "@/lib/content";

type Props = {
  content?: BlogContent["hero"];
  /**
   * Filter options resolved on the page from the CMS chip list and the published
   * posts. The blank-value "all" entry is skipped because the dropdown already
   * carries `content.search_label` as its default option.
   */
  categories?: BlogCategoryOption[];
};

/**
 * Blog intro with the search box.
 *
 * The search and category inputs are controlled by the grid below, so this
 * component is rendered by the client wrapper that owns that state.
 */
export default function BlogHero({ content = defaultBlogContent.hero, categories = [] }: Props) {
  return (
    <section className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-salon-bg lg:min-h-[min(560px,100svh)]">
      <video
        src={contactVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center lg:py-28">
          <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
            {content.heading}
            {content.heading_accent ? (
              <span className="block text-salon-gold-soft">{content.heading_accent}</span>
            ) : null}
          </h1>

          {content.subheading ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {content.subheading}
            </p>
          ) : null}

          <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row">
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/70" />
              <input
                id="blog-search"
                type="search"
                placeholder={content.search_placeholder}
                className="w-full rounded-2xl border border-white/40 bg-white/95 py-3 pl-10 pr-4 text-sm text-salon-ink shadow-lg backdrop-blur placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none"
              />
            </div>

            <div className="relative w-full sm:w-1/3">
              <select
                id="blog-category"
                defaultValue=""
                aria-label={content.search_label}
                className="w-full appearance-none rounded-2xl border border-white/40 bg-white/95 px-4 py-3 text-sm font-medium text-salon-ink shadow-lg backdrop-blur focus:border-salon-brand focus:outline-none"
              >
                <option value="">{content.search_label}</option>
                {categories
                  .filter((option) => option.value)
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
