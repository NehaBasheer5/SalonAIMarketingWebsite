"use client";

import { FormEvent, useEffect, useState } from "react";
import ImagePickerField from "@/components/ImagePickerField";

type Post = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  status: "draft" | "published";
};

const empty: Post = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "General",
  status: "draft",
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Post>(empty);

  async function load() {
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(data.posts || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/blog", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    load();
  }

  async function onDelete(id: number) {
    if (!confirm("Delete post?")) return;
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Blog posts</h2>
        <p className="text-sm text-slate-600">Create and edit articles for the Client blog page.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <ImagePickerField
          label="Cover image"
          value={form.cover_image}
          onChange={(url) => setForm({ ...form, cover_image: url })}
        />
        <textarea
          placeholder="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={2}
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={6}
        />
        <div className="flex items-center gap-3">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Post["status"] })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <button type="submit" className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white">
            {form.id ? "Update post" : "Create post"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-slate-400">
                  /{post.slug} · {post.category} · {post.status}
                </p>
                <p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setForm(post)} className="text-xs font-semibold text-[#0D1140]">
                  Edit
                </button>
                <button onClick={() => onDelete(post.id!)} className="text-xs font-semibold text-red-600">
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
