"use client";

import React from "react";
import Link from "next/link";
import { Headphones } from "lucide-react";

export default function FaqSupportCta() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-salon-brand bg-salon-brand p-8 text-white shadow-[0_16px_40px_rgba(133,89,47,0.2)] sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
                <Headphones className="h-6 w-6" strokeWidth={1.8} />
              </span>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75">
                Still have questions?
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Our Support Team is Here to{" "}
                <span className="italic text-white/85">Help</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                Can&apos;t find the answer you&apos;re looking for? Get in touch with our friendly
                support team and we&apos;ll be happy to assist you.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-salon-brand transition hover:bg-salon-chip"
                >
                  Contact Support &rarr;
                </Link>
                <Link
                  href="/request-demo"
                  className="rounded-lg border border-white/45 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
