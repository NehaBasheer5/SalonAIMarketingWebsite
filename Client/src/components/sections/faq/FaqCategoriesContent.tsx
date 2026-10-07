"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import type { HomeContent } from "@/lib/content";

type Props = {
  content?: Partial<HomeContent["faq"]>;
  faqsFromDb?: Array<{ question: string; answer: string; category?: string }>;
};

type Category = { id: string; label: string; icon: string; slug?: string };

function matchesCategory(cat: Category, faq: { category?: string }): boolean {
  const value = String(faq.category ?? "").trim();
  if (!value) return cat.id === "general" || cat.slug === "";
  const needle = value.toLowerCase();
  return (
    needle === String(cat.label ?? "").toLowerCase() ||
    needle === String(cat.slug ?? "").toLowerCase() ||
    needle === String(cat.id ?? "").toLowerCase()
  );
}

export default function FaqCategoriesContent({ content, faqsFromDb }: Props) {
  const categories: Category[] =
    Array.isArray(content?.categories) && content.categories.length > 0
      ? content.categories.map((c) => ({
          id: c.id,
          label: c.label,
          icon: c.icon,
          slug: (c as Category).slug,
        }))
      : [{ id: "general", label: "General", icon: "BookOpen", slug: "" }];

  const dbFaqs = Array.isArray(faqsFromDb) ? faqsFromDb : [];

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "general");
  const active = categories.find((cat) => cat.id === activeCategory) ?? categories[0];

  const faqItems =
    dbFaqs.length > 0
      ? dbFaqs
          .filter((f) => matchesCategory(active, f))
          .map((f) => ({ question: f.question, answer: f.answer }))
      : Array.isArray(content?.faqs)
        ? content.faqs
        : [];

  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              {content?.eyebrow || "Browse"}
            </span>
            <span className="h-px w-8 bg-salon-rule" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            {(content?.heading || "Answers")} <span className="text-salon-accent">{content?.heading_accent || "by Category"}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${isActive ? "border-salon-brand bg-white shadow-sm" : "border-salon-card bg-white/60 hover:bg-white"}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isActive ? "bg-salon-brand text-white" : "bg-salon-soft text-salon-ink"}`}
                    >
                      <CmsIcon name={cat.icon as any} className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold">
                        {cat.label}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-salon-brand" />
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm lg:col-span-8">
            <h3 className="font-display text-2xl text-salon-ink">{active.label}</h3>
            <p className="mb-6 mt-1 text-xs text-salon-muted">
              {content?.subheading || "Browse questions and answers."}
            </p>
            {faqItems.length > 0 ? (
              <div className="space-y-3">
                {faqItems.map((f, idx) => (
                  <details key={idx} className="group rounded-xl border border-salon-card bg-white/80 p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-salon-ink">{f.question}</span>
                      <span className="text-salon-brand">+</span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-salon-muted">{f.answer}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="text-sm text-salon-muted">No FAQs available for this category.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
