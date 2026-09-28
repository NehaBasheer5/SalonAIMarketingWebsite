"use client";

import React from "react";
import { Search } from "lucide-react";

export default function FaqHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Text & Search */}
          <div className="lg:col-span-7">
            <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-900">
              Frequently Asked Questions
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Got Questions? <br />
              We’ve Got <span className="text-blue-950">Answers</span>
            </h1>
            <p className="mt-4 text-sm text-slate-600 sm:text-base max-w-lg">
              Find quick answers to the most common questions about SalonAI. Can't find what you're looking for? Feel free to contact our team.
            </p>

            {/* Search Input */}
            <div className="mt-8 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <Search className="ml-2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button className="rounded-lg bg-blue-950 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-900 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-indigo-100/60 to-purple-100/60 p-6 shadow-sm">
              <div className="rounded-2xl bg-white p-5 shadow-lg border border-slate-100/80 space-y-3">
                <div className="h-3 w-3/4 rounded bg-slate-100"></div>
                <div className="h-3 w-1/2 rounded bg-slate-100"></div>
                <div className="h-3 w-5/6 rounded bg-slate-100"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}