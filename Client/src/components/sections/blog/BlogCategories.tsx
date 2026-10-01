"use client";

import React, { useState } from "react";
import { Briefcase, Cpu, LayoutGrid, Megaphone, Rocket, Smile } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Posts", count: "24 Articles", icon: LayoutGrid },
  { id: "management", name: "Management", count: "6 Articles", icon: Briefcase },
  { id: "marketing", name: "Marketing", count: "5 Articles", icon: Megaphone },
  { id: "technology", name: "Technology", count: "6 Articles", icon: Cpu },
  { id: "customer-experience", name: "Customer Experience", count: "4 Articles", icon: Smile },
  { id: "product-updates", name: "Product Updates", count: "3 Articles", icon: Rocket },
] as const;

export default function BlogCategories() {
  const [active, setActive] = useState("all");

  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-9 bg-salon-rule" />
          <h3 className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
            Categories
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  isActive
                    ? "border-salon-brand bg-salon-shell shadow-[0_8px_24px_rgba(133,89,47,0.1)]"
                    : "border-salon-card bg-white/70 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-salon-brand text-white"
                      : "bg-salon-tile text-salon-brand-dark"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span>
                  <span
                    className={`block text-xs font-semibold ${
                      isActive ? "text-salon-brand" : "text-salon-ink"
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-salon-muted">{cat.count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
