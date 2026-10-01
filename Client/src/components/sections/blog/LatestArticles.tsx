"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    id: 1,
    tag: "Management",
    title: "10 Ways to Improve Salon Efficiency and Save Time",
    desc: "Streamline your daily operations and reduce no-shows with these proven strategies.",
    author: "Michael Brown",
    date: "May 10, 2024",
    readTime: "4 min read",
  },
  {
    id: 2,
    tag: "Marketing",
    title: "Salon Marketing Ideas That Actually Bring in More Clients",
    desc: "Creative and affordable marketing ideas to help you attract and retain more customers.",
    author: "Emily Roberts",
    date: "May 8, 2024",
    readTime: "6 min read",
  },
  {
    id: 3,
    tag: "Technology",
    title: "The Benefits of Online Booking for Salons",
    desc: "Why online booking is a game-changer for salon owners and their customers.",
    author: "David Wilson",
    date: "May 5, 2024",
    readTime: "5 min read",
  },
] as const;

export default function LatestArticles() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-salon-rule" />
            <h2 className="font-display text-2xl tracking-tight text-salon-ink sm:text-3xl">
              Latest <span className="text-salon-accent">Articles</span>
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
          >
            View All Articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ARTICLES.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-salon-card bg-white/80 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_34px_rgba(91,64,39,0.1)]"
            >
              <div className="relative flex aspect-[16/10] items-center justify-center bg-salon-tile text-xs text-salon-brand-dark">
                [ Card Image ]
                <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-salon-brand backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div>
                  <h3 className="line-clamp-2 text-sm font-semibold text-salon-ink transition group-hover:text-salon-brand">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-salon-muted">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-salon-card pt-3 text-[10px] text-salon-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-salon-tile" />
                    <span className="font-semibold text-salon-ink">{item.author}</span>
                  </div>
                  <span>
                    {item.date} • {item.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
