"use client";

import React from "react";
import { Rocket } from "lucide-react";

export default function ContactCtaBanner() {
  return (
    <section className="py-8 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-blue-950 p-8 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/30 text-blue-400">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">Ready to Transform Your Salon Business?</p>
              <h2 className="text-xl font-bold">Book a Demo Today</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-950 hover:bg-slate-100">
              Book a Demo &rarr;
            </button>
            <button className="rounded-xl border border-blue-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-900">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}