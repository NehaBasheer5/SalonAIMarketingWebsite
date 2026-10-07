"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Faq = {
  id?: number;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: number | boolean;
};

type CategoryDef = {
  id: string;
  label: string;
  icon?: string;
  slug?: string;
};

const empty: Faq = {
  question: "",
  answer: "",
  category: "General",
  sort_order: 0,
  is_published: true,
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
  const [tab, setTab] = useState("all");
  const [form, setForm] = useState<Faq>(empty);

  const load = useCallback(async () => {
    try {
      const [faqRes, pageRes] = await Promise.all([fetch("/api/faqs"), fetch("/api/pages/faq")]);
      const faqData = faqRes.ok ? await safeJson(faqRes) : null;
      setFaqs(Array.isArray(faqData?.faqs) ? faqData.faqs : []);
      try {
        const pageData = pageRes.ok ? await safeJson(pageRes) : null;
        const catSection = (pageData?.sections || []).find(
          (s: { section_key: string }) => s.section_key === "categories"
        );
        const list = Array.isArray(catSection?.extra?.categories)
          ? catSection.extra.categories
          : [];
        setCategories(
          list.map((c: Record<string, unknown>) => ({
            id: String(c.id ?? "") || "",
            label: String(c.label ?? "") || "Category",
            icon: typeof c.icon === "string" ? c.icon : undefined,
            slug: String(c.slug ?? "") || "",
          }))
        );
      } catch {
        setCategories([]);
      }
    } catch {
      setFaqs([]);
      setCategories([]);
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

  const activeTabLabel =
    (categories.find((c) => c.id === tab)?.label ?? "") || (tab === UNCATEGORIZED ? "Uncategorized" : "All categories");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">FAQs</h2>
        <p className="text-sm text-slate-600">
          Manage questions shown on the Client FAQ page. Categories are defined under Pages → FAQ → Categories &amp; Questions.
        </p>
      </div>

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
              Choices come from Pages → FAQ → Categories &amp; Questions.
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