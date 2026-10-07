"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import BlogPostCard from "@/components/sections/blog/BlogPostCard";
import {
  categoryKey,
  defaultBlogContent,
  resolveBlogCategories,
  type BlogCategoryOption,
  type BlogContent,
  type BlogPost,
} from "@/lib/content";

type Props = {
  content?: BlogContent["categories"];
  latest?: BlogContent["latest"];
  posts: BlogPost[];
  /** Resolved on the page so the chips and the hero dropdown cannot drift apart. */
  categories?: BlogCategoryOption[];
};

/**
 * Category chips plus the article grid.
 *
 * Search and category filtering live here, and the hero's inputs drive this
 * state through the `blog-search` / `blog-category` ids, so the inputs and the
 * grid stay in sync wherever they sit on the page.
 *
 * Both inputs write the same resolved filter value into `category`, and a post
 * matches when its own `category` normalises to any key behind that option, so
 * "Management" and "management" select the same articles.
 */
export default function BlogCategories({ content = defaultBlogContent.categories, latest = defaultBlogContent.latest, posts, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  // The hero renders the inputs, this section owns their value.
  useEffect(() => {
    const search = document.getElementById("blog-search") as HTMLInputElement | null;
    const select = document.getElementById("blog-category") as HTMLSelectElement | null;

    const onSearch = () => setQuery(search?.value ?? "");
    const onSelect = () => setCategory(select?.value ?? "");

    search?.addEventListener("input", onSearch);
    select?.addEventListener("change", onSelect);
    return () => {
      search?.removeEventListener("input", onSearch);
      select?.removeEventListener("change", onSelect);
    };
  }, []);

  // Only categories that at least one published article uses are offered.
  const options = useMemo(
    () => categories ?? resolveBlogCategories(content.items, posts),
    [categories, content.items, posts]
  );

  const activeOption = useMemo(
    () => options.find((option) => option.value === category),
    [options, category]
  );
  const activeKeys = useMemo(() => new Set(activeOption?.keys ?? []), [activeOption]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeKeys.size && !activeKeys.has(categoryKey(post.category))) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle) ||
        post.category.toLowerCase().includes(needle) ||
        post.author.toLowerCase().includes(needle) ||
        post.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [posts, query, activeKeys]);

  const total = posts.length;
  const allOption = options.find((option) => !option.value);
  const chips = allOption ? [allOption, ...options.filter((option) => option.value)] : options;

  return (
    <>
      <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-9 bg-salon-rule" />
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              {content.heading}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {chips.map((cat) => {
              const active = category === cat.value;
              const count = cat.value ? cat.count : allOption?.count ?? total;

              return (
                <button
                  key={cat.value || "all"}
                  type="button"
                  onClick={() => setCategory(active ? "" : cat.value)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-salon-brand bg-salon-shell shadow-[0_8px_24px_rgba(133,89,47,0.1)]"
                      : "border-salon-card bg-white/70 hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      active ? "bg-salon-brand text-white" : "bg-salon-tile text-salon-brand-dark"
                    }`}
                  >
                    {cat.icon ? (
                      <CmsIcon name={cat.icon} className="h-4 w-4" strokeWidth={1.8} />
                    ) : (
                      <LayoutGrid className="h-4 w-4" strokeWidth={1.8} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-xs font-semibold ${
                        active ? "text-salon-brand" : "text-salon-ink"
                      }`}
                    >
                      {cat.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-salon-muted">
                      {count} Article{count === 1 ? "" : "s"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="articles" className="w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col items-end justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <h2 className="font-display text-2xl tracking-tight text-salon-ink sm:text-3xl">
                {latest.heading}
                {latest.heading_accent ? (
                  <span className="text-salon-accent"> {latest.heading_accent}</span>
                ) : null}
              </h2>
            </div>
            {latest.cta_label ? (
              <Link
                href={latest.cta_href || "/blog"}
                className="inline-flex items-center gap-1 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
              >
                {latest.cta_label} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>

          {filtered.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-salon-card bg-white/70 p-10 text-center text-sm text-salon-muted">
              {query || category
                ? "No articles match that search. Try a different term or category."
                : latest.empty_message}
            </p>
          )}
        </div>
      </section>
    </>
  );
}