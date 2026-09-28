"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, HelpCircle, Settings2, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "general", label: "General", icon: HelpCircle },
  { id: "features", label: "Features", icon: Sparkles },
  { id: "billing", label: "Billing", icon: Settings2 },
  { id: "security", label: "Security", icon: Shield },
] as const;

const FAQS = [
  {
    q: "What is SalonAI?",
    a: "SalonAI is an all-in-one salon management platform that helps you handle bookings, staff, customers, and growth from one place.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. You can start with a free trial and explore the full platform before choosing a plan.",
  },
  {
    q: "Can I manage multiple branches?",
    a: "Absolutely. Higher plans support multi-branch management with shared reporting and staff controls.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. SalonAI uses secure cloud infrastructure with encryption and reliable backups to protect your salon data.",
  },
] as const;

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#a98a65]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
              FAQ
            </span>
            <span className="h-px w-8 bg-[#a98a65]" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            Frequently Asked <span className="text-[#91663f]">Questions</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-salon-muted">
            Quick answers to the most common questions about SalonAI.
          </p>
          <Link
            href="/faq"
            className="mt-3 text-sm font-semibold text-[#85592f] underline-offset-4 hover:underline"
          >
            View All FAQs →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <aside className="rounded-2xl border border-[#eadfce] bg-white/70 p-3 lg:col-span-4">
            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      active ? "bg-[#efe2d4]" : "hover:bg-[#f8f1ea]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          active ? "bg-[#85592f] text-white" : "bg-[#f3ebe2] text-[#85592f]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-salon-ink">{cat.label}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#85592f]" />
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-3 lg:col-span-8">
            {FAQS.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-[#eadfce] bg-white/80"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe2d4] text-[11px] font-bold text-[#85592f]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-salon-ink">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#85592f] transition ${open ? "rotate-180" : ""}`}
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
                        <p className="border-t border-[#eadfce] px-4 pb-4 pt-3 text-sm leading-relaxed text-salon-muted">
                          {faq.a}
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
