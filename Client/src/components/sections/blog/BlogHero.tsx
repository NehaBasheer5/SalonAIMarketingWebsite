"use client";

import React from "react";
import { ChevronDown, Search } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                Our Blog
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
              Insights That Help
              <span className="block text-salon-accent">Your Salon Grow</span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-salon-muted">
              Expert tips, industry trends, and product updates to help you run a smarter, more
              profitable salon business.
            </p>

            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <div className="relative w-full sm:w-2/3">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full rounded-2xl border border-salon-card bg-white/70 py-2.5 pl-10 pr-4 text-xs text-salon-ink placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none"
                />
              </div>

              <div className="relative w-full sm:w-1/3">
                <select className="w-full appearance-none rounded-2xl border border-salon-card bg-white/70 px-4 py-2.5 text-xs font-medium text-salon-ink focus:border-salon-brand focus:outline-none">
                  <option>All Categories</option>
                  <option>Management</option>
                  <option>Marketing</option>
                  <option>Technology</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <article className="group overflow-hidden rounded-2xl border border-salon-card bg-white/80 shadow-sm transition hover:bg-white">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-salon-shell">
                <div className="flex h-full w-full items-center justify-center bg-salon-tile text-xs text-salon-brand-dark">
                  [ Featured Article Image ]
                </div>
              </div>

              <div className="space-y-3 p-6">
                <span className="inline-block rounded-md bg-salon-tile px-2.5 py-1 text-[10px] font-semibold text-salon-brand-dark">
                  Featured Article
                </span>

                <h2 className="font-display text-2xl leading-tight text-salon-ink transition group-hover:text-salon-brand">
                  How AI is Transforming Salon Management in 2024
                </h2>

                <p className="line-clamp-2 text-xs leading-relaxed text-salon-muted">
                  Discover how artificial intelligence is helping salon owners save time, increase
                  revenue, and delight customers.
                </p>

                <div className="flex items-center justify-between border-t border-salon-card pt-4 text-[11px] text-salon-muted">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-salon-tile" />
                    <span className="font-medium text-salon-ink">By Sarah Johnson</span>
                    <span>•</span>
                    <span>May 12, 2024</span>
                  </div>
                  <span>5 min read</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
