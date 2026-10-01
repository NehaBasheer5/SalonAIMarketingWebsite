"use client";

import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function ContactCtaBanner() {
  return (
    <section className="w-full overflow-hidden bg-salon-soft pb-16 pt-2">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-salon-brand bg-salon-brand p-8 text-white shadow-[0_16px_40px_rgba(133,89,47,0.2)] sm:p-10 lg:flex-row">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
              <Rocket className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75">
                Ready to Transform Your Salon Business?
              </p>
              <h2 className="mt-1 font-display text-xl text-white sm:text-2xl">Book a Demo Today</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/request-demo"
              className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-salon-brand transition hover:bg-salon-chip"
            >
              Book a Demo &rarr;
            </Link>
            <Link
              href="/features"
              className="rounded-lg border border-white/45 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
