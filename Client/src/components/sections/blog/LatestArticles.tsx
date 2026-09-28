"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
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
];

export default function LatestArticles() {
  return (
    <section className="py-8 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Latest Articles</h2>
          <Link href="#" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:text-blue-700">
            View All Articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((item) => (
            <div key={item.id} className="group flex flex-col rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-[16/10] bg-slate-200 flex items-center justify-center text-xs text-slate-400">
                [ Card Image ]
                <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-blue-900 backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>

              <div className="p-5 flex flex-1 flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-slate-300" />
                    <span className="font-semibold text-slate-700">{item.author}</span>
                  </div>
                  <span>{item.date} • {item.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}