"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type FeaturePost = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  icon: string;
  image_url: string;
  image_alt: string;
  href: string;
  sort_order: number;
  is_published: boolean;
  is_featured: boolean;
};

type CategoryOption = { id: string; label: string };

/** DB rows come back loosely typed; coerce them into the list's shape. */
function normalizePost(raw: Record<string, unknown>): FeaturePost {
  const text = (value: unknown) => (value === null || value === undefined ? "" : String(value));
  return {
    id: raw.id === undefined || raw.id === null ? undefined : Number(raw.id),
    title: text(raw.title),
    slug: text(raw.slug),
    description: text(raw.description),
    content: text(raw.content),
    category: text(raw.category),
    icon: text(raw.icon) || "Sparkles",
    image_url: text(raw.image_url),
    image_alt: text(raw.image_alt),
    href: text(raw.href),
    sort_order: Number(raw.sort_order ?? 0),
    is_published: Boolean(raw.is_published),
    is_featured: Boolean(raw.is_featured),
  };
}

/**
 * Pulls the category tabs the marketing site offers under
 * Pages > Features > Feature Grid, so the list can show a friendly label.
 */
async function fetchConfiguredCategories(): Promise<CategoryOption[]> {
  try {
    const res = await fetch("/api/pages/features");
    if (!res.ok) return [];
    const data = await res.json();
    const section = (data?.sections ?? []).find(
      (item: { section_key?: string }) => item.section_key === "feature_grid"
    );
    const items = Array.isArray(section?.extra?.categories) ? section.extra.categories : [];
    return items
      .filter((item: { id?: string }) => String(item?.id ?? "").trim())
      .map((item: { id?: string; label?: string }) => ({
        id: String(item.id).trim(),
        label: String(item.label ?? item.id ?? "").trim() || String(item.id).trim(),
      }));
  } catch {
    return [];
  }
}

export default function FeaturePostsAdminPage() {
  const [posts, setPosts] = useState<FeaturePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/features-posts");
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts.map(normalizePost) : []);
    } catch {
      setError("Could not load feature posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetchConfiguredCategories().then(setCategories);
  }, []);

  // Every category a card could be filed under: the configured tabs plus any
  // already stored against a card, so a stale id still shows up.
  const categoryOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const cat of categories) byId.set(cat.id, cat.label);
    for (const post of posts) {
      const id = (post.category ?? "").trim();
      if (id && !byId.has(id)) byId.set(id, id);
    }
    return Array.from(byId, ([id, label]) => ({ id, label }));
  }, [categories, posts]);

  async function onDelete(id: number) {
    if (!confirm("Delete this feature post permanently?")) return;
    await fetch(`/api/features-posts?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-[#0D1140]">Features posts</h2>
          <p className="text-sm text-slate-600">
            Create and edit the feature cards shown in the Client features page grid. Published cards
            appear on the marketing site immediately. Tick &quot;Feature on the home page&quot; to also
            show a card in the home features section. The category filter tabs are managed under
            Pages &gt; Features.
          </p>
        </div>
        <Link
          href="/features-posts/new"
          className="shrink-0 rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Create post
        </Link>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">
          {loading
            ? "Loading feature posts..."
            : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
        </h3>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!loading && posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No feature posts yet. Use the Create post button above to add your first card.
          </p>
        ) : null}

        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">
                  {post.title}
                  {post.is_published ? null : (
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                      draft
                    </span>
                  )}
                  {post.is_featured ? (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      home
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {categoryOptions.find((c) => c.id === post.category)?.label ||
                    post.category ||
                    "Uncategorised"}{" "}
                  · order {post.sort_order}
                  {post.slug ? ` · /features/${post.slug}` : ""}
                  {post.href ? ` · ${post.href}` : ""}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.description}</p>
              </div>

              <div className="flex shrink-0 gap-3">
                <Link
                  href={`/features-posts/${post.id}/edit`}
                  className="text-xs font-semibold text-[#0D1140] hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(post.id!)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
