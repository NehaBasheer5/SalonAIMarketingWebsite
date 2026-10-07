"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { BlogPostMeta } from "@/components/sections/blog/BlogPostCard";
import {
  defaultBlogContent,
  fallbackImages,
  type BlogCategoryOption,
  type BlogContent,
  type BlogPost,
} from "@/lib/content";

type Props = {
  content?: BlogContent["hero"];
  featured?: BlogPost;
  /**
   * Filter options resolved on the page from the CMS chip list and the published
   * posts. The blank-value "all" entry is skipped because the dropdown already
   * carries `content.search_label` as its default option.
   */
  categories?: BlogCategoryOption[];
};

/**
 * Blog intro with the search box and the featured article.
 *
 * The search and category inputs are controlled by the grid below, so this
 * component is rendered by the client wrapper that owns that state.
 */
export default function BlogHero({
  content = defaultBlogContent.hero,
  featured,
  categories = [],
}: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {content.eyebrow}
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
              {content.heading}
              {content.heading_accent ? (
                <span className="block text-salon-accent">{content.heading_accent}</span>
              ) : null}
            </h1>

            {content.subheading ? (
              <p className="max-w-xl text-sm leading-relaxed text-salon-muted">
                {content.subheading}
              </p>
            ) : null}

            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <div className="relative w-full sm:w-2/3">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                <input
                  id="blog-search"
                  type="search"
                  placeholder={content.search_placeholder}
                  className="w-full rounded-2xl border border-salon-card bg-white/70 py-2.5 pl-10 pr-4 text-xs text-salon-ink placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none"
                />
              </div>

              <div className="relative w-full sm:w-1/3">
                <select
                  id="blog-category"
                  defaultValue=""
                  aria-label={content.search_label}
                  className="w-full appearance-none rounded-2xl border border-salon-card bg-white/70 px-4 py-2.5 text-xs font-medium text-salon-ink focus:border-salon-brand focus:outline-none"
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

          <div className="lg:col-span-6">
            {featured ? (
              <article className="group overflow-hidden rounded-2xl border border-salon-card bg-white/80 shadow-sm transition hover:bg-white">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-salon-shell">
                  <CmsImage
                    value={featured.cover_video || featured.cover_image}
                    fallback={fallbackImages.blog_cover}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-3 p-6">
                  <span className="inline-block rounded-md bg-salon-tile px-2.5 py-1 text-[10px] font-semibold text-salon-brand-dark">
                    {content.featured_label}
                  </span>

                  <h2 className="font-display text-2xl leading-tight text-salon-ink transition group-hover:text-salon-brand">
                    <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                  </h2>

                  {featured.excerpt ? (
                    <p className="line-clamp-2 text-xs leading-relaxed text-salon-muted">
                      {featured.excerpt}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between gap-3 border-t border-salon-card pt-4 text-[11px] text-salon-muted">
                    <BlogPostMeta post={featured} />
                  </div>
                </div>
              </article>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-salon-card bg-white/80 shadow-sm">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-salon-shell">
                  <CmsImage
                    value={content.image_url}
                    fallback={fallbackImages.blog_cover}
                    alt={content.image_alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-6">
                  <h2 className="font-display text-2xl leading-tight text-salon-ink">
                    {content.heading}
                  </h2>
                  <p className="text-xs leading-relaxed text-salon-muted">
                    {content.subheading}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}