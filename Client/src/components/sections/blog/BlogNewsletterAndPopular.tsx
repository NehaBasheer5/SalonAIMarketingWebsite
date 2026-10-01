"use client";

import React from "react";
import { Mail } from "lucide-react";

const POPULAR_POSTS = [
  { id: 1, title: "How to Increase Salon Revenue Without Adding More Clients", date: "Apr 28, 2024", readTime: "5 min read" },
  { id: 2, title: "5 Customer Retention Strategies Every Salon Should Use", date: "Apr 25, 2024", readTime: "4 min read" },
  { id: 3, title: "Understanding Salon Analytics: Metrics That Matter", date: "Apr 22, 2024", readTime: "6 min read" },
] as const;

export default function BlogNewsletterAndPopular() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-salon-card bg-salon-shell-soft p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-salon-tile text-salon-brand-dark">
                <Mail className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-display text-2xl leading-tight text-salon-ink">
                  Stay Updated with the Latest Insights
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-salon-muted">
                  Subscribe to our newsletter and get the latest tips, trends, and product updates
                  straight to your inbox.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col items-center gap-2 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-salon-card bg-white px-4 py-2.5 text-xs text-salon-ink placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none"
              />
              <button
                type="submit"
                className="w-full shrink-0 rounded-xl bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm lg:col-span-5">
            <h3 className="mb-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              Popular Posts
            </h3>

            <div className="space-y-4">
              {POPULAR_POSTS.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 border-b border-salon-card pb-3 last:border-none last:pb-0"
                >
                  <span className="flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-salon-tile text-[10px] text-salon-brand-dark">
                    [Thumb]
                  </span>
                  <div>
                    <h4 className="line-clamp-2 cursor-pointer text-xs font-semibold text-salon-ink transition hover:text-salon-brand">
                      {post.title}
                    </h4>
                    <p className="mt-1 text-[10px] text-salon-muted">
                      {post.date} • {post.readTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
