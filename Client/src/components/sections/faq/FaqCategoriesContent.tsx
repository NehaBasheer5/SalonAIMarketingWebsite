"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

const CATEGORIES = [
  { id: "getting-started", name: "Getting Started", count: "8 questions" },
  { id: "features", name: "Features & Functionality", count: "12 questions" },
  { id: "pricing", name: "Pricing & Billing", count: "6 questions" },
] as const;

export default function FaqCategoriesContent() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const active = CATEGORIES.find((cat) => cat.id === activeCategory) ?? CATEGORIES[0];

  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              Browse
            </span>
            <span className="h-px w-8 bg-salon-rule" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            Answers <span className="text-salon-accent">by Category</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-salon-brand bg-salon-shell font-semibold shadow-[0_8px_24px_rgba(133,89,47,0.1)]"
                      : "border-salon-card bg-white/70 text-salon-muted hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isActive ? "bg-salon-brand text-white" : "bg-salon-tile text-salon-brand-dark"
                      }`}
                    >
                      #
                    </span>
                    <span>
                      <span className={`block text-xs font-semibold ${isActive ? "text-salon-ink" : ""}`}>
                        {cat.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-normal text-salon-muted">
                        {cat.count}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-salon-brand" />
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm lg:col-span-8">
            <h3 className="font-display text-2xl text-salon-ink">{active.name}</h3>
            <p className="mb-6 mt-1 text-xs text-salon-muted">
              Find answers to the most common questions about setting up your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
