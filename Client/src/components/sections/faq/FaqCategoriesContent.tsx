"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

// Sample categories data (or import from your data file)
const categories = [
  { id: "getting-started", name: "Getting Started", count: "8 questions" },
  { id: "features", name: "Features & Functionality", count: "12 questions" },
  { id: "pricing", name: "Pricing & Billing", count: "6 questions" },
];

export default function FaqCategoriesContent() {
  const [activeCategory, setActiveCategory] = useState("getting-started");

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Sidebar Categories */}
          <div className="lg:col-span-4 space-y-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between gap-3 rounded-2xl p-4 text-left transition-all ${
                    isActive
                      ? "bg-blue-50 border border-blue-200 text-blue-950 font-bold shadow-sm"
                      : "bg-slate-50/80 border border-slate-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isActive ? "bg-blue-600 text-white" : "bg-white text-slate-500"
                      }`}
                    >
                      {/* Icon placeholder or icon dynamic component */}
                      <span className="text-xs font-bold">#</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold">{cat.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{cat.count}</p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          {/* Right FAQs Accordion */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Getting Started</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Find answers to the most common questions about setting up your account.
            </p>
            {/* Accordion items go here */}
          </div>

        </div>
      </div>
    </section>
  );
}