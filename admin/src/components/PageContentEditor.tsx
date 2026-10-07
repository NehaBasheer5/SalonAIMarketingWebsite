"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SectionField, { type FieldValue } from "@/components/SectionField";
import { getSectionSpec, type ColumnKey } from "@/lib/sectionSpecs";

type Section = {
  id: number;
  section_key: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  is_visible: number;
  sort_order: number;
  extra: Record<string, FieldValue>;
};

type PageData = {
  id: number;
  slug: string;
  title: string;
  status: string;
};

const FALLBACK_FIELDS: { key: ColumnKey; label: string; kind: "text" | "textarea"; rows?: number }[] = [
  { key: "heading", label: "Heading", kind: "text" },
  { key: "subheading", label: "Subheading", kind: "textarea", rows: 2 },
  { key: "body", label: "Body", kind: "textarea", rows: 4 },
  { key: "cta_label", label: "CTA label", kind: "text" },
  { key: "cta_href", label: "CTA link", kind: "text" },
];

/**
 * Editor for one page's content sections, backed by the `page_sections` table.
 *
 * Shared by `/pages/[slug]` and the `/pricing` shortcut so the pricing page can
 * be edited straight from the sidebar without duplicating the save logic.
 */
export default function PageContentEditor({
  slug,
  heading,
  description,
}: {
  slug: string;
  /** Overrides the default "Edit: <page title>" heading. */
  heading?: string;
  description?: string;
}) {
  const router = useRouter();

  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [showJson, setShowJson] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/pages/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setPage(data.page);
        const loaded: Section[] = (data.sections || []).map((s: Section) => ({
          ...s,
          is_visible: s.is_visible === undefined ? 1 : s.is_visible,
          extra: s.extra || {},
        }));
        setSections(loaded);
        setOpenId(loaded.length ? loaded[0].id : null);
      })
      .catch(() => active && setError("Could not load this page."));
    return () => {
      active = false;
    };
  }, [slug]);

  const total = sections.length;
  const visible = useMemo(() => sections.filter((s) => s.is_visible).length, [sections]);

  function patchSection(id: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function setColumn(id: number, column: ColumnKey, value: string) {
    patchSection(id, { [column]: value } as Partial<Section>);
  }

  function setExtra(id: number, key: string, value: FieldValue) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, extra: { ...s.extra, [key]: value } } : s))
    );
  }

  function move(id: number, direction: -1 | 1) {
    setSections((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!page) return;
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch(`/api/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: page.title,
        status: page.status,
        sections: sections.map((s, i) => ({ ...s, sort_order: i + 1 })),
      }),
    }).catch(() => null);

    setSaving(false);
    if (res && res.ok) {
      setMessage("Saved. The Client site picks this up on its next load.");
      router.refresh();
    } else {
      setError("Save failed. Please try again.");
    }
  }

  if (!page) {
    return <p className="text-sm text-slate-500">Loading page...</p>;
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D1140]">{heading ?? `Edit: ${page.title}`}</h2>
          <p className="text-sm text-slate-600">
            /{page.slug} &middot; {visible} of {total} sections visible
          </p>
          {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

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
          <p className="mt-1 text-[11px] text-slate-400">
            A draft page is not served to the Client site.
          </p>
        </div>
      </div>

      {sections.map((section, index) => {
        const spec = getSectionSpec(slug, section.section_key);
        const isOpen = openId === section.id;
        const hidden = !section.is_visible;

        return (
          <div
            key={section.id}
            className={`overflow-hidden rounded-2xl border bg-white ${
              hidden ? "border-slate-200 opacity-70" : "border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 px-4 py-3">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : section.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {spec?.label ?? section.section_key}
                  </span>
                  <span className="block truncate text-[11px] text-slate-400">
                    {section.section_key}
                  </span>
                </span>
                <span className="text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
              </button>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={Boolean(section.is_visible)}
                  onChange={(e) => patchSection(section.id, { is_visible: e.target.checked ? 1 : 0 })}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Visible
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Move section up"
                  onClick={() => move(section.id, -1)}
                  disabled={index === 0}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-white disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move section down"
                  onClick={() => move(section.id, 1)}
                  disabled={index === sections.length - 1}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-white disabled:opacity-40"
                >
                  ↓
                </button>
              </div>
            </div>

            {isOpen ? (
              <div className="space-y-5 p-5">
                {spec ? <p className="text-sm text-slate-500">{spec.description}</p> : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  {spec
                    ? spec.fields.map((field) => (
                        <SectionField
                          key={field.key}
                          spec={field}
                          value={
                            field.column
                              ? ((section[field.column] as string) ?? "")
                              : section.extra[field.key]
                          }
                          onChange={(next) =>
                            field.column
                              ? setColumn(section.id, field.column, String(next ?? ""))
                              : setExtra(section.id, field.key, next)
                          }
                        />
                      ))
                    : FALLBACK_FIELDS.map((field) => (
                        <div key={field.key} className="sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                          {field.kind === "textarea" ? (
                            <textarea
                              value={(section[field.key] as string) ?? ""}
                              rows={field.rows ?? 3}
                              onChange={(e) => setColumn(section.id, field.key, e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                          ) : (
                            <input
                              value={(section[field.key] as string) ?? ""}
                              onChange={(e) => setColumn(section.id, field.key, e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                          )}
                        </div>
                      ))}

                  {!spec ? (
                    <div className="sm:col-span-2">
                      <SectionField
                        spec={{ kind: "image", key: "image_url", label: "Media" }}
                        value={section.image_url ?? ""}
                        onChange={(next) => setColumn(section.id, "image_url", String(next ?? ""))}
                      />
                    </div>
                  ) : null}
                </div>

                <details
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                  open={showJson === section.id}
                  onToggle={(e) => setShowJson(e.currentTarget.open ? section.id : null)}
                >
                  <summary className="cursor-pointer text-xs font-semibold text-slate-600">
                    Advanced: raw JSON
                  </summary>
                  <SectionField
                    spec={{
                      kind: "json",
                      key: "extra",
                      label: "extra_json",
                      rows: 10,
                      help: "Escape hatch for fields not covered by the form above.",
                    }}
                    value={section.extra}
                    onChange={(next) =>
                      patchSection(section.id, {
                        extra:
                          next && typeof next === "object" && !Array.isArray(next)
                            ? (next as Record<string, FieldValue>)
                            : {},
                      })
                    }
                  />
                </details>
              </div>
            ) : null}
          </div>
        );
      })}
    </form>
  );
}