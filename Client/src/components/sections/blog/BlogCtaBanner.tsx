"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function BlogCtaBanner() {
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-blue-950 p-8 sm:p-10 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/30 text-blue-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ready to Take Your Salon to the Next Level?</h2>
              <p className="text-xs text-blue-200 mt-1">
                Join thousands of salon owners who are growing their business with SalonAI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-950 hover:bg-slate-100 transition-colors">
              Book a Demo &rarr;
            </button>
            <button className="flex-1 sm:flex-none rounded-xl border border-blue-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-900 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}