"use client";

import React from "react";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          
          {/* Left Text & Search */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Our Blog
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Insights That Help <br />
              Your Salon <span className="text-blue-900">Grow</span>
            </h1>

            <p className="max-w-xl text-xs sm:text-sm text-slate-500 leading-relaxed">
              Expert tips, industry trends, and product updates to help you run a smarter, more profitable salon business.
            </p>

            {/* Search Inputs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative w-full sm:w-2/3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="relative w-full sm:w-1/3">
                <select className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none">
                  <option>All Categories</option>
                  <option>Management</option>
                  <option>Marketing</option>
                  <option>Technology</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Featured Article Card */}
          <div className="lg:col-span-6">
            <div className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 bg-slate-200">
                  [ Featured Article Image ]
                </div>
              </div>

              <div className="p-6 space-y-3">
                <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                  Featured Article
                </span>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  How AI is Transforming Salon Management in 2024
                </h2>

                <p className="text-xs text-slate-500 line-clamp-2">
                  Discover how artificial intelligence is helping salon owners save time, increase revenue, and delight customers.
                </p>

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-300" />
                    <span className="font-medium text-slate-700">By Sarah Johnson</span>
                    <span>•</span>
                    <span>May 12, 2024</span>
                  </div>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}