"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function BlogCtaBanner() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-salon-brand bg-salon-brand p-8 text-white shadow-[0_16px_40px_rgba(133,89,47,0.2)] sm:p-10 lg:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
              <Sparkles className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-display text-xl text-white sm:text-2xl">
                Ready to Take Your Salon to the Next Level?
              </h2>
              <p className="mt-1 text-xs text-white/80">
                Join thousands of salon owners who are growing their business with SalonAI.
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link
              href="/request-demo"
              className="flex-1 rounded-lg bg-white px-5 py-2.5 text-center text-xs font-semibold text-salon-brand transition hover:bg-salon-chip sm:flex-none"
            >
              Book a Demo &rarr;
            </Link>
            <Link
              href="/contact"
              className="flex-1 rounded-lg border border-white/45 px-5 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-white/10 sm:flex-none"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
