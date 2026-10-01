"use client";

import React from "react";
import { Search } from "lucide-react";

export default function FaqHero() {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                FAQ
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
              Got Questions?
              <span className="block text-salon-accent">We&apos;ve Got Answers</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-salon-muted">
              Find quick answers to the most common questions about SalonAI. Can&apos;t find what
              you&apos;re looking for? Feel free to contact our team.
            </p>

            <div className="mt-8 flex max-w-md items-center gap-2 rounded-xl border border-salon-card bg-white/80 p-2 shadow-sm">
              <Search className="ml-2 h-5 w-5 text-salon-muted/60" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full bg-transparent text-sm text-salon-ink outline-none placeholder:text-salon-muted/60"
              />
              <button
                type="button"
                className="rounded-lg bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark"
              >
                Search
              </button>
            </div>
          </div>

          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md rounded-3xl bg-salon-tile/60 p-6">
              <div className="space-y-3 rounded-2xl border border-salon-card bg-white p-5 shadow-lg">
                <div className="h-3 w-3/4 rounded bg-salon-shell" />
                <div className="h-3 w-1/2 rounded bg-salon-shell" />
                <div className="h-3 w-5/6 rounded bg-salon-shell" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
