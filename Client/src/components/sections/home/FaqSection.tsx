"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CmsIcon from "@/components/ui/CmsIcon";
import { defaultHomeContent, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["faq"];
};

export default function FaqSection({ content = defaultHomeContent.faq }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(
    content.categories[0]?.id ?? "general"
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              {content.eyebrow}
            </span>
            <span className="h-px w-8 bg-salon-rule" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            {content.heading}
            {content.heading_accent ? (
              <span className="text-salon-accent"> {content.heading_accent}</span>
            ) : null}
          </h2>
          {content.subheading ? (
            <p className="mt-2 max-w-xl text-sm text-salon-muted">{content.subheading}</p>
          ) : null}
          {content.cta_label ? (
            <Link
              href={content.cta_href || "/faq"}
              className="mt-3 text-sm font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              {content.cta_label}
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {content.categories.length ? (
            <aside className="rounded-2xl border border-salon-card bg-white/70 p-3 lg:col-span-4">
              <div className="space-y-2">
                {content.categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                        active ? "bg-salon-tile" : "hover:bg-salon-shell-soft"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            active ? "bg-salon-brand text-white" : "bg-salon-shell text-salon-brand"
                          }`}
                        >
                          <CmsIcon name={cat.icon} className="h-4 w-4" strokeWidth={2} />
                        </span>
                        <span className="text-sm font-semibold text-salon-ink">{cat.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-salon-brand" />
                    </button>
                  );
                })}
              </div>
            </aside>
          ) : null}

          <div className={`space-y-3 ${content.categories.length ? "lg:col-span-8" : "lg:col-span-12"}`}>
            {content.faqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-salon-card bg-white/80"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-salon-tile text-[11px] font-bold text-salon-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-salon-ink">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-salon-brand transition ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <p className="border-t border-salon-card px-4 pb-4 pt-3 text-sm leading-relaxed text-salon-muted">
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
