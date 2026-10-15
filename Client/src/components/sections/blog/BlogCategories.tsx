"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  const allOption = options.find((option) => !option.value);
  const chips = allOption ? [allOption, ...options.filter((option) => option.value)] : options;

  return (
    <>
      <section className="w-full overflow-hidden bg-salon-bg py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {chips.map((cat) => {
              const active = category === cat.value;

              return (
                <button
                  key={cat.value || "all"}
                  type="button"
                  onClick={() => setCategory(active ? "" : cat.value)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-1.5 text-[19px] font-semibold transition ${
                    active
                      ? "bg-salon-brand text-white"
                      : "text-salon-ink hover:text-salon-brand"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="articles" className="w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
          <div className="mb-8">
            <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
              {latest.heading}
              {latest.heading_accent ? (
                <span className="text-black"> {latest.heading_accent}</span>
              ) : null}
            </h2>
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