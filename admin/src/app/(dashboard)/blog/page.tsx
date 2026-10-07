"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import MediaPickerField from "@/components/MediaPickerField";
import MarkdownEditor from "@/components/MarkdownEditor";

type Post = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_video: string;
  category: string;
  author: string;
  author_image: string;
  tags: string;
  read_time: string;
  is_featured: boolean;
  status: "draft" | "published";
  view_count?: number;
  published_at?: string | null;
};

const emptyPost: Post = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  cover_video: "",
  category: "General",
  author: "",
  author_image: "",
  tags: "",
  read_time: "",
  is_featured: false,
  status: "draft",
};

const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm";
const labelClass = "block text-xs font-semibold text-slate-600";

/** Sentinel for the "add a category that does not exist yet" option. */
const NEW_CATEGORY = "__new__";

/** Mirrors the Client's ~200 words per minute so an unset read time still shows one. */
function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "";
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/**
 * Pulls the category labels the marketing site offers under
 * Pages > Blog > Categories, so the dropdown suggests the same names the Client
 * already renders as filter chips.
 *
 * The blank-slug entry is skipped: on the site that is the "no filter" option,
 * so it is not a category a post can actually be filed under.
 */
async function fetchConfiguredCategories(): Promise<string[]> {
  try {
    const res = await fetch("/api/pages/blog");
    if (!res.ok) return [];
    const data = await res.json();
    const section = (data?.sections ?? []).find(
      (item: { section_key?: string }) => item.section_key === "categories"
    );
    const items = Array.isArray(section?.extra?.items) ? section.extra.items : [];
    return items
      .filter((item: { slug?: string }) => String(item?.slug ?? "").trim())
      .map((item: { label?: string }) => String(item?.label ?? "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Post>(emptyPost);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [configuredCategories, setConfiguredCategories] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setError("Could not load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetchConfiguredCategories().then(setConfiguredCategories);
  }, []);

  /**
   * Every category a post could reuse: the ones configured on the blog page
   * plus the ones already stored against a post, drafts included. Sorting keeps
   * the list stable between loads instead of reshuffling on every post.
   */
  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    for (const name of configuredCategories) names.add(name);
    for (const post of posts) {
      const name = (post.category ?? "").trim();
      if (name) names.add(name);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [configuredCategories, posts]);

  // A category typed by hand is not in the list, so the select falls through to
  // the free text box instead of silently dropping the value on save.
  const isCustomCategory = Boolean(form.category) && !categoryOptions.includes(form.category);

  function reset() {
    setForm(emptyPost);
    setError("");
  }

  function edit(post: Post) {
    setError("");
    setNotice("");
    setForm({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : (post.tags ?? ""),
      is_featured: Boolean(post.is_featured),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const res = await fetch("/api/blog", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          read_time: form.read_time || estimateReadTime(form.content),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not save the post.");
        return;
      }

      setNotice(form.id ? "Post updated." : "Post created.");
      reset();
      await load();
    } catch {
      setError("Could not save the post.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    if (form.id === id) reset();
    await load();
  }

  const previewUrl = useMemo(() => {
    const slug = (form.slug || form.title).trim();
    if (!slug) return "";
    return `/blog/${slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;
  }, [form.slug, form.title]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Blog posts</h2>
        <p className="text-sm text-slate-600">
          Create and edit articles for the Client blog page. Everything you save here is written to
          the database and appears on the marketing site immediately once the post is published.
        </p>
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
            placeholder="How AI is transforming salon management"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={inputClass}
            placeholder="Leave blank to generate from the title"
          />
          {previewUrl ? (
            <p className="mt-1 text-[11px] text-slate-400">
              Lives at <span className="font-mono">{previewUrl}</span> on the marketing site.
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={isCustomCategory ? NEW_CATEGORY : form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value === NEW_CATEGORY ? "" : e.target.value })
            }
            className={inputClass}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={NEW_CATEGORY}>Add a new category...</option>
          </select>

          {isCustomCategory ? (
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`mt-2 ${inputClass}`}
              placeholder="Type the category name"
              autoFocus
            />
          ) : null}

          <p className="mt-1 text-[11px] text-slate-400">
            Categories already used by a post, plus the ones set under Pages &gt; Blog &gt;
            Categories. Anything saved here becomes a filter chip on the Client blog page.
          </p>
        </div>

        <div>
          <label className={labelClass}>Author</label>
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className={inputClass}
            placeholder="Sarah Johnson"
          />
        </div>

        <div className="sm:col-span-2">
          <MediaPickerField
            label="Author image"
            value={form.author_image}
            onChange={(url) => setForm({ ...form, author_image: url })}
            imageOnly
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Appears inside the avatar circle next to the author name on the article page.
          </p>
        </div>

        <div>
          <label className={labelClass}>Read time</label>
          <input
            value={form.read_time}
            onChange={(e) => setForm({ ...form, read_time: e.target.value })}
            className={inputClass}
            placeholder={estimateReadTime(form.content) || "5 min read"}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            {form.read_time || estimateReadTime(form.content) || "Calculated from the content."}
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Tags</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className={inputClass}
            placeholder="Efficiency, Workflow, Management"
          />
          <p className="mt-1 text-[11px] text-slate-400">Comma separated.</p>
        </div>

        <MediaPickerField
          label="Cover image"
          value={form.cover_image}
          onChange={(url) => setForm({ ...form, cover_image: url })}
        />

        <MediaPickerField
          label="Cover video (optional, overrides the image)"
          value={form.cover_video}
          onChange={(url) => setForm({ ...form, cover_video: url })}
        />

        <div className="sm:col-span-2">
          <label className={labelClass}>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className={inputClass}
            rows={2}
            placeholder="One or two sentences shown on the cards and in search results."
          />
        </div>

        <MarkdownEditor
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          rows={18}
        />

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <div className="flex items-center gap-2">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Post["status"] })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4"
            />
            Feature this article in the blog hero
          </label>

          <div className="ml-auto flex items-center gap-3">
            {form.id ? (
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel edit
              </button>
            ) : null}
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
        {notice ? <p className="text-sm text-emerald-600 sm:col-span-2">{notice}</p> : null}
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">
          {loading ? "Loading posts..." : `${posts.length} post${posts.length === 1 ? "" : "s"}`}
        </h3>

        {!loading && posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No posts yet. Create your first article above, then set it to published.
          </p>
        ) : null}

        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">
                  {post.title}
                  {post.is_featured ? (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      featured
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  /{post.slug} · {post.category || "Uncategorised"} ·{" "}
                  <span
                    className={
                      post.status === "published" ? "text-emerald-600" : "text-slate-400"
                    }
                  >
                    {post.status}
                  </span>
                  {post.view_count ? ` · ${post.view_count} views` : ""}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
              </div>

              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => edit(post)}
                  className="text-xs font-semibold text-[#0D1140] hover:underline"
                >
                  Edit
                </button>
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