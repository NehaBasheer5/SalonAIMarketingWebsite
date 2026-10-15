"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const fallbackFaqs = Array.isArray(content?.faqs) ? content.faqs : [];

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "general");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const active = categories.find((cat) => cat.id === activeCategory) ?? categories[0];

  const faqsFor = (cat: Category): { question: string; answer: string }[] => {
    // Prefer the database, but fall back to the bundled list when the `faqs`
    // table is empty. Both are filtered by category so each tab shows its own.
    const source = dbFaqs.length > 0 ? dbFaqs : fallbackFaqs;
    return source
      .filter((f) => matchesCategory(cat, f))
      .map((f) => ({ question: f.question, answer: f.answer }));
  };

  const faqItems = faqsFor(active);

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
            {content?.heading || "Frequently Asked"}
            {content?.heading_accent ? (
              <span className="text-black"> {content.heading_accent}</span>
            ) : null}
          </h2>
          {content?.subheading ? (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-black">
              {content.subheading}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenFaq(0);
                    }}
                    className={`group flex w-full shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      isActive
                        ? "bg-gradient-to-r from-salon-brand to-salon-gold text-white shadow-[0_10px_26px_-10px_rgba(133,89,47,0.6)]"
                        : "bg-white/70 text-salon-ink hover:bg-salon-shell-soft"
                    }`}
                  >
                    <span className="text-sm font-semibold">{cat.label}</span>
                    <ChevronRight
                      className={`ml-auto h-4 w-4 transition group-hover:translate-x-0.5 ${
                        isActive ? "text-white" : "text-salon-brand"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-3 lg:col-span-8">
            {faqItems.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-salon-card bg-white/60 px-5 py-8 text-center text-sm text-salon-muted">
                No questions in this category yet.
              </p>
            ) : null}
            {faqItems.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={`${faq.question}-${index}`}
                  className={`overflow-hidden rounded-2xl bg-white/80 transition ${
                    open ? "shadow-[0_14px_34px_-14px_rgba(133,89,47,0.4)]" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition ${
                        open
                          ? "bg-gradient-to-br from-salon-brand to-salon-gold text-white"
                          : "bg-salon-tile text-salon-brand"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-salon-ink sm:text-base">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                        open ? "rotate-180 bg-salon-brand text-white" : "bg-salon-shell text-salon-brand"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <p className="border-t border-salon-card/70 px-5 pb-5 pt-4 text-sm leading-relaxed text-salon-muted sm:pl-[4.75rem]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
