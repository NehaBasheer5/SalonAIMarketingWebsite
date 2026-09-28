"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImagePickerField from "@/components/ImagePickerField";

type Section = {
  id: number;
  section_key: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  sort_order: number;
};

type PageData = {
  id: number;
  slug: string;
  title: string;
  status: string;
};

export default function EditPageContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPage(data.page);
        setSections(data.sections || []);
      });
  }, [slug]);

  function updateSection(id: number, field: keyof Section, value: string | number) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!page) return;
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: page.title,
        status: page.status,
        sections,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Saved successfully.");
      router.refresh();
    } else {
      setMessage("Save failed.");
    }
  }

  if (!page) {
    return <p className="text-sm text-slate-500">Loading page...</p>;
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D1140]">Edit: {page.title}</h2>
          <p className="text-sm text-slate-600">/{page.slug}</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-600">Page title</label>
          <input
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Status</label>
          <select
            value={page.status}
            onChange={(e) => setPage({ ...page, status: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Section: {section.section_key}</h3>
            <span className="text-xs text-slate-400">sort {section.sort_order}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Heading</label>
              <input
                value={section.heading || ""}
                onChange={(e) => updateSection(section.id, "heading", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Subheading</label>
              <textarea
                value={section.subheading || ""}
                onChange={(e) => updateSection(section.id, "subheading", e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Body</label>
              <textarea
                value={section.body || ""}
                onChange={(e) => updateSection(section.id, "body", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">CTA label</label>
              <input
                value={section.cta_label || ""}
                onChange={(e) => updateSection(section.id, "cta_label", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">CTA link</label>
              <input
                value={section.cta_href || ""}
                onChange={(e) => updateSection(section.id, "cta_href", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <ImagePickerField
              label="Image"
              value={section.image_url || ""}
              onChange={(url) => updateSection(section.id, "image_url", url)}
            />
          </div>
        </div>
      ))}
    </form>
  );
}
