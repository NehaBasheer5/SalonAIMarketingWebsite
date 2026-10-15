"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultHomeContent, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["faq"];
};

export default function FaqSection({ content = defaultHomeContent.faq }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(
    content.categories[0]?.id ?? "general"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const visibleFaqs = content.faqs.filter(
    (faq) => !faq.category || faq.category === activeCategory
  );

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8 flex flex-col items-start gap-4 text-left sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
              {content.heading}
              {content.heading_accent ? (
                <span className="block bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                  {content.heading_accent}
                </span>
              ) : null}
            </h2>
            {content.subheading ? (
               <p className="mt-2 max-w-xl text-[19px] text-salon-muted">{content.subheading}</p>
            ) : null}
          </div>
          {content.cta_label ? (
            <Link
              href={content.cta_href || "/faq"}
              className="shrink-0 text-sm font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              {content.cta_label}
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {content.categories.length ? (
            <aside className="lg:col-span-4">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
                {content.categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setOpenIndex(0);
                      }}
                      className={`group flex w-full shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                        active
                          ? "bg-gradient-to-r from-salon-brand to-salon-gold text-white shadow-[0_10px_26px_-10px_rgba(133,89,47,0.6)]"
                          : "bg-white/70 text-salon-ink hover:bg-salon-shell-soft"
                      }`}
                    >
                      <span className="text-sm font-semibold">{cat.label}</span>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition group-hover:translate-x-0.5 ${
                          active ? "text-white" : "text-salon-brand"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </aside>
          ) : null}

          <div className={`space-y-3 ${content.categories.length ? "lg:col-span-8" : "lg:col-span-12"}`}>
            {visibleFaqs.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-salon-card bg-white/60 px-5 py-8 text-center text-sm text-salon-muted">
                No questions in this category yet.
              </p>
            ) : null}
            {visibleFaqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl bg-white/80 transition ${
                    open ? "shadow-[0_14px_34px_-14px_rgba(133,89,47,0.4)]" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
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
