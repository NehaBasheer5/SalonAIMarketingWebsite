"use client";

import React, { useState } from "react";
import { LayoutGrid, Briefcase, Megaphone, Cpu, Smile, Rocket } from "lucide-react";

const categories = [
  { id: "all", name: "All Posts", count: "24 Articles", icon: LayoutGrid },
  { id: "management", name: "Management", count: "6 Articles", icon: Briefcase },
  { id: "marketing", name: "Marketing", count: "5 Articles", icon: Megaphone },
  { id: "technology", name: "Technology", count: "6 Articles", icon: Cpu },
  { id: "customer-experience", name: "Customer Experience", count: "4 Articles", icon: Smile },
  { id: "product-updates", name: "Product Updates", count: "3 Articles", icon: Rocket },
];

export default function BlogCategories() {
  const [active, setActive] = useState("all");

  return (
    <section className="py-6 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-base font-bold text-slate-900 mb-4">Categories</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                  isActive
                    ? "bg-blue-50 border border-blue-200/80 shadow-sm"
                    : "bg-slate-50/80 border border-slate-100 hover:bg-slate-100/70"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isActive ? "bg-blue-600 text-white" : "bg-white text-slate-500 shadow-sm"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${isActive ? "text-blue-950" : "text-slate-800"}`}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{cat.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}