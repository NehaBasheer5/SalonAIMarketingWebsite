"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Faq = {
  id?: number;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: number | boolean;
  show_on_home: number | boolean;
};

type CategoryDef = {
  id: string;
  label: string;
  icon?: string;
  slug?: string;
};

/** The editable form of a category row (always has icon + slug strings). */
type CatRow = { id: string; label: string; icon: string; slug: string };

/** A page_sections row from GET /api/pages/faq, round-tripped on save. */
type SectionRow = {
  id: number;
  section_key: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  is_visible: number | boolean;
  sort_order: number;
  extra: Record<string, unknown>;
};

/** Icons the Client's CmsIcon can render for a category tab. */
const CATEGORY_ICONS = [
  "HelpCircle",
  "Sparkles",
  "BookOpen",
  "Settings2",
  "CreditCard",
  "Shield",
  "Users",
  "Zap",
  "Star",
  "CalendarDays",
  "Cloud",
  "Headset",
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const empty: Faq = {
  question: "",
  answer: "",
  category: "General",
  sort_order: 0,
  is_published: true,
  show_on_home: false,
};

const UNCATEGORIZED = "_uncategorized";

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    const text = await res.text();
    if (!text) return null;
    const data = JSON.parse(text);
    return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function normalized(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function matchesCategory(faq: Faq, cat: CategoryDef) {
  const value = normalized(faq.category);
  if (!value) return cat.id === "general" || normalized(cat.slug) === "";
  return (
    value === normalized(cat.label) ||
    value === normalized(cat.slug) ||
    value === normalized(cat.id)
  );
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [categories, setCategories] = useState<CategoryDef[]>([]);
  const [catSection, setCatSection] = useState<SectionRow | null>(null);
  const [draftCats, setDraftCats] = useState<CatRow[]>([]);
  const [newCat, setNewCat] = useState<CatRow>({ id: "", label: "", icon: "HelpCircle", slug: "" });
  const [savingCats, setSavingCats] = useState(false);
  const [tab, setTab] = useState("all");
  const [form, setForm] = useState<Faq>(empty);

  const load = useCallback(async () => {
    try {
      const [faqRes, pageRes] = await Promise.all([fetch("/api/faqs"), fetch("/api/pages/faq")]);
      const faqData = faqRes.ok ? await safeJson(faqRes) : null;
      setFaqs(Array.isArray(faqData?.faqs) ? faqData.faqs : []);
      try {
        const pageData = pageRes.ok ? await safeJson(pageRes) : null;
        const sections = Array.isArray(pageData?.sections)
          ? (pageData?.sections as SectionRow[])
          : [];
        const found = sections.find((s) => s.section_key === "categories") ?? null;
        setCatSection(found);

        const list = Array.isArray(found?.extra?.categories)
          ? (found?.extra?.categories as Record<string, unknown>[])
          : [];
        const rows: CatRow[] = list.map((c, idx) => ({
          id: String(c.id ?? c.slug ?? `cat-${idx}`) || `cat-${idx}`,
          label: String(c.label ?? c.name ?? c.id ?? "Category"),
          icon: typeof c.icon === "string" && c.icon ? c.icon : "HelpCircle",
          slug: c.slug === undefined || c.slug === null ? "" : String(c.slug),
        }));
        setCategories(rows.map((r) => ({ id: r.id, label: r.label, icon: r.icon, slug: r.slug })));
        setDraftCats(rows);
      } catch {
        setCategories([]);
        setCatSection(null);
        setDraftCats([]);
      }
    } catch {
      setFaqs([]);
      setCategories([]);
      setCatSection(null);
      setDraftCats([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("all", faqs.length);
    for (const cat of categories) {
      map.set(cat.id, faqs.filter((f) => matchesCategory(f, cat)).length);
    }
    map.set(
      UNCATEGORIZED,
      faqs.filter((f) => !categories.some((cat) => matchesCategory(f, cat))).length
    );
    return map;
  }, [faqs, categories]);

  const filtered = useMemo(() => {
    if (tab === "all") return [...faqs].reverse();
    if (tab === UNCATEGORIZED) {
      return faqs.filter((f) => !categories.some((cat) => matchesCategory(f, cat))).reverse();
    }
    const cat = categories.find((c) => c.id === tab);
    return cat ? faqs.filter((f) => matchesCategory(f, cat)).reverse() : [];
  }, [faqs, categories, tab]);

  function switchTab(id: string, label: string) {
    setTab(id);
    if (!form.id) setForm((prev) => ({ ...prev, category: label }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/faqs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    load();
  }

  async function onDelete(id: number) {
    if (!confirm("Delete FAQ?")) return;
    await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
    load();
  }

  function pickCategory(e: string) {
    setForm((prev) => ({ ...prev, category: e }));
  }

  const savedCatsKey = useMemo(
    () => JSON.stringify(categories.map((c) => [c.id, c.label, c.icon ?? "", c.slug ?? ""])),
    [categories]
  );
  const draftCatsKey = useMemo(
    () => JSON.stringify(draftCats.map((c) => [c.id, c.label, c.icon, c.slug])),
    [draftCats]
  );
  const catsDirty = savedCatsKey !== draftCatsKey;

  function updateCat(index: number, patch: Partial<CatRow>) {
    setDraftCats((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function removeCat(index: number) {
    setDraftCats((prev) => prev.filter((_, i) => i !== index));
  }

  function resetCats() {
    setDraftCats(
      categories.map((c) => ({ id: c.id, label: c.label, icon: c.icon ?? "HelpCircle", slug: c.slug ?? "" }))
    );
  }

  function addCat() {
    const label = newCat.label.trim();
    if (!label) return;
    const slug = newCat.slug.trim() || slugify(label);
    const id = slugify(label) || `cat-${Date.now()}`;
    setDraftCats((prev) => [...prev, { id, label, icon: newCat.icon || "HelpCircle", slug }]);
    setNewCat({ id: "", label: "", icon: "HelpCircle", slug: "" });
  }

  async function saveCategories() {
    if (!catSection || savingCats) return;
    setSavingCats(true);
    const cleaned = draftCats
      .map((c, idx) => ({
        id: c.id.trim() || slugify(c.label) || `cat-${idx}`,
        label: c.label.trim(),
        icon: c.icon.trim() || "HelpCircle",
        slug: c.slug.trim(),
      }))
      .filter((c) => c.label);
    try {
      await fetch("/api/pages/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: [
            {
              id: catSection.id,
              heading: catSection.heading ?? "",
              subheading: catSection.subheading ?? "",
              body: catSection.body ?? "",
              cta_label: catSection.cta_label ?? "",
              cta_href: catSection.cta_href ?? "",
              image_url: catSection.image_url ?? "",
              is_visible: catSection.is_visible,
              sort_order: catSection.sort_order,
              extra: { ...catSection.extra, categories: cleaned },
            },
          ],
        }),
      });
      await load();
    } finally {
      setSavingCats(false);
    }
  }

  const activeTabLabel =
    (categories.find((c) => c.id === tab)?.label ?? "") || (tab === UNCATEGORIZED ? "Uncategorized" : "All categories");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">FAQs</h2>
        <p className="text-sm text-slate-600">
          Manage the questions shown on the Client FAQ page. Tick "Show on home page" to feature a
          question in the home FAQ section (with its category tab); when none are ticked the home
          section falls back to the newest 5. Add or edit the category tabs below.
        </p>
      </div>

      {catSection ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Categories</p>
              <p className="text-xs text-slate-400">
                These tabs appear on the Client home page and the FAQ page. Each question&apos;s category matches a tab by its label, slug or id.
              </p>
            </div>
            {catsDirty ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetCats}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={saveCategories}
                  disabled={savingCats}
                  className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {savingCats ? "Saving…" : "Save categories"}
                </button>
              </div>
            ) : null}
          </div>

          {draftCats.length ? (
            <div className="space-y-2">
              {draftCats.map((cat, idx) => (
                <div
                  key={`${cat.id}-${idx}`}
                  className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_170px_auto]"
                >
                  <input
                    value={cat.label}
                    onChange={(e) => updateCat(idx, { label: e.target.value })}
                    placeholder="Label"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    value={cat.slug}
                    onChange={(e) => updateCat(idx, { slug: e.target.value })}
                    placeholder="slug (optional)"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <select
                    value={cat.icon}
                    onChange={(e) => updateCat(idx, { icon: e.target.value })}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    {CATEGORY_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeCat(idx)}
                    className="justify-self-end rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-400">
              No categories yet. Add one below.
            </p>
          )}

          <div className="grid items-center gap-2 border-t border-slate-100 pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_170px_auto]">
            <input
              value={newCat.label}
              onChange={(e) => setNewCat((p) => ({ ...p, label: e.target.value }))}
              placeholder="New category label"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={newCat.slug}
              onChange={(e) => setNewCat((p) => ({ ...p, slug: e.target.value }))}
              placeholder="slug (optional)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <select
              value={newCat.icon}
              onChange={(e) => setNewCat((p) => ({ ...p, icon: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {CATEGORY_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addCat}
              className="justify-self-end rounded-lg border border-[#0D1140] px-3 py-2 text-xs font-semibold text-[#0D1140] hover:bg-slate-50"
            >
              + Add category
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "all"} onClick={() => switchTab("all", "General")}>
          All <Count active={tab === "all"}>{counts.get("all") ?? 0}</Count>
        </TabButton>
        {categories.map((cat) => (
          <TabButton key={cat.id} active={tab === cat.id} onClick={() => switchTab(cat.id, cat.label)}>
            {cat.label} <Count active={tab === cat.id}>{counts.get(cat.id) ?? 0}</Count>
          </TabButton>
        ))}
        <TabButton
          active={tab === UNCATEGORIZED}
          onClick={() => switchTab(UNCATEGORIZED, "")}
        >
          Uncategorized <Count active={tab === UNCATEGORIZED}>{counts.get(UNCATEGORIZED) ?? 0}</Count>
        </TabButton>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">
            {form.id ? "Editing question" : `New question`}
            {activeTabLabel ? <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{activeTabLabel}</span> : null}
          </p>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm(empty)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
        <input
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={3}
          required
        />
        <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Category
            </label>
            <select
              value={form.category ?? ""}
              onChange={(e) => pickCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">— Uncategorized —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                  {cat.slug ? ` (${cat.slug})` : ""}
                </option>
              ))}
              {form.category &&
              !categories.some((c) => (c.label ?? "").trim() === (form.category ?? "").trim()) ? (
                <option value={form.category}>{form.category}</option>
              ) : null}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Choices come from the Categories panel above.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Sort order
            </label>
            <input
              type="number"
              placeholder="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              style={{ WebkitAppearance: "none" }}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg bg-[#0D1140] px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {form.id ? "Update FAQ" : "Add FAQ"}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(form.show_on_home)}
            onChange={(e) => setForm({ ...form, show_on_home: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          Show on home page
          <span className="text-xs text-slate-400">
            — shown in the home page FAQ section (with its category tab).
          </span>
        </label>
      </form>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
            No questions in this category yet. Pick the category above and add your first question.
          </p>
        ) : (
          filtered.map((faq) => {
            const isUncategorized = !categories.some((cat) => matchesCategory(faq, cat));
            return (
              <div key={faq.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">{faq.question}</p>
                    <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span
                        className={`rounded-full px-2 py-0.5 font-medium ${
                          isUncategorized
                            ? "bg-slate-100 text-slate-500"
                            : "bg-[#0D1140]/10 text-[#0D1140]"
                        }`}
                      >
                        {normalized(faq.category) ? faq.category : "Uncategorized"}
                      </span>
                      {Boolean(faq.show_on_home) ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">
                          Home
                        </span>
                      ) : null}
                      order {faq.sort_order}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      onClick={() => {
                        setForm(faq);
                        setTab("all");
                      }}
                      className="text-xs font-semibold text-[#0D1140]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(faq.id!)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "border-[#0D1140] bg-[#0D1140] text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function Count({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full px-1.5 text-[10px] font-bold ${
        active ? "bg-white/25" : "bg-slate-100 text-slate-500"
      }`}
    >
      {children}
    </span>
  );
}