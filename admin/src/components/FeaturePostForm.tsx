"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownEditor from "@/components/MarkdownEditor";
import MediaPickerField from "@/components/MediaPickerField";

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

const emptyPost: FeaturePost = {
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "",
  icon: "Sparkles",
  image_url: "",
  image_alt: "",
  href: "",
  sort_order: 0,
  is_published: true,
  is_featured: false,
};

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm";
const labelClass = "block text-xs font-semibold text-slate-600";

function slugify(input: string) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** DB rows come back loosely typed; coerce them into the form's shape. */
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
 * Pages > Features > Feature Grid, so the dropdown suggests the same ids the
 * Client already renders as filter tabs.
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

/**
 * The create/edit form for a feature post, rendered on its own page
 * (Admin -> Features Posts -> Create post / Edit).
 *
 * Omit `postId` to create a new card; pass one to edit the existing card. On
 * save it returns to the features posts list.
 */
export default function FeaturePostForm({ postId }: { postId?: number }) {
  const router = useRouter();
  const [form, setForm] = useState<FeaturePost>(emptyPost);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [knownPosts, setKnownPosts] = useState<FeaturePost[]>([]);
  const [loading, setLoading] = useState(Boolean(postId));
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/features-posts");
      const data = await res.json();
      const rows: Record<string, unknown>[] = Array.isArray(data?.posts) ? data.posts : [];
      const all = rows.map(normalizePost);
      setKnownPosts(all);
      const found = all.find((post) => post.id === postId);
      if (found) setForm(found);
      else setNotFound(true);
    } catch {
      setError("Could not load the feature post.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetchConfiguredCategories().then(setCategories);
  }, []);

  // Every category a card could be filed under: the configured tabs plus any
  // already stored against a card, so a stale id still shows up for editing.
  const categoryOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const cat of categories) byId.set(cat.id, cat.label);
    for (const post of knownPosts) {
      const id = (post.category ?? "").trim();
      if (id && !byId.has(id)) byId.set(id, id);
    }
    return Array.from(byId, ([id, label]) => ({ id, label }));
  }, [categories, knownPosts]);

  /** The detail page this card will open, exactly as the API will store it. */
  const detailUrl = useMemo(() => {
    const slug = slugify(form.slug || form.title);
    return slug ? `/features/${slug}` : "";
  }, [form.slug, form.title]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/features-posts", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not save the feature post.");
        return;
      }

      router.push("/features-posts");
    } catch {
      setError("Could not save the feature post.");
    } finally {
      setSaving(false);
    }
  }

  const heading = postId ? "Edit feature post" : "Create feature post";

  if (loading) {
    return <p className="text-sm text-slate-500">Loading feature post...</p>;
  }

  if (notFound) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600">That feature post could not be found.</p>
        <Link
          href="/features-posts"
          className="inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Back to feature posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/features-posts"
            className="text-xs font-semibold text-slate-500 hover:underline"
          >
            ← Back to feature posts
          </Link>
          <h2 className="mt-1 text-2xl font-bold text-[#0D1140]">{heading}</h2>
          <p className="text-sm text-slate-600">
            Each card is shown in the Client features grid, and its own detail page lives at the slug
            below.
          </p>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className={labelClass}>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            placeholder="Online Booking"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={inputClass}
            placeholder="Leave blank to generate from the title"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            {detailUrl ? (
              <>Detail page lives at <span className="font-mono">{detailUrl}</span>.</>
            ) : (
              <>Detail page URL, opened when the card&apos;s &quot;Learn more&quot; is clicked.</>
            )}
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description (card summary)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
            rows={2}
            placeholder="One or two sentences shown on the card and as the detail page summary."
          />
        </div>

        <MarkdownEditor
          label="Detail page content"
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          rows={14}
          help="Markdown body rendered on the feature's own detail page."
        />

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-400">
            Must match a category id under Pages &gt; Features &gt; Feature Grid, or the card only
            shows under the All tab.
          </p>
        </div>

        <div>
          <label className={labelClass}>Icon</label>
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className={inputClass}
            placeholder="Sparkles"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Lucide icon name, e.g. Calendar, Sparkles, Zap. Used when the card has no image.
          </p>
        </div>

        <div className="sm:col-span-2">
          <MediaPickerField
            label="Card image"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Optional. Falls back to the built-in imagery when unset.
          </p>
        </div>

        <div>
          <label className={labelClass}>Image alt text</label>
          <input
            value={form.image_alt}
            onChange={(e) => setForm({ ...form, image_alt: e.target.value })}
            className={inputClass}
            placeholder="Describe the image for screen readers"
          />
        </div>

        <div>
          <label className={labelClass}>External link (optional)</label>
          <input
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            className={inputClass}
            placeholder="https://example.com"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Leave blank so &quot;Learn more&quot; opens the detail page at{" "}
            <span className="font-mono">{detailUrl || "/features/…"}</span>. Set an http(s) URL to
            send visitors somewhere else instead.
          </p>
        </div>

        <div>
          <label className={labelClass}>Order</label>
          <input
            type="number"
            min={1}
            value={form.sort_order || ""}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className={inputClass}
            placeholder="Leave blank to add at the end"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="h-4 w-4"
            />
            Published (visible on the Client site)
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4"
            />
            Feature on the home page
          </label>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/features-posts"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : form.id ? "Update post" : "Create post"}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600 sm:col-span-2">{error}</p> : null}
      </form>
    </div>
  );
}
