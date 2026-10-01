"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { images } from "@/assets";

const FAQS = [
  {
    q: "Can I change my plan later?",
    a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes! We offer a 14-day free trial on all plans with no credit card required.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 30-day money-back guarantee if you are not satisfied with our platform.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use enterprise-grade encryption and daily automated backups.",
  },
  {
    q: "Can I manage multiple branches?",
    a: "Yes, multi-branch management is supported on our Pro and Enterprise plans.",
  },
] as const;

export default function PricingFaqCta() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                FAQ
              </span>
            </div>
            <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
              Frequently Asked <span className="text-salon-accent">Questions</span>
            </h2>

            <div className="mt-6 space-y-3">
              {FAQS.map((faq, index) => {
                const open = openIdx === index;
                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-salon-card bg-white/80"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-salon-tile text-[11px] font-bold text-salon-brand">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-semibold text-salon-ink">{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-salon-brand transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open ? (
                      <p className="border-t border-salon-card px-4 py-3 text-xs leading-relaxed text-salon-muted">
                        {faq.a}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <Link
                href="/faq"
                className="text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
              >
                View All FAQs &rarr;
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-salon-brand bg-salon-brand p-8 text-white shadow-[0_16px_40px_rgba(133,89,47,0.2)]">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-9 bg-white/40" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/75">
                    Get Started
                  </span>
                </div>

                <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
                  Ready to Transform <span className="italic text-white/85">Your Salon?</span>
                </h3>
                <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/80">
                  Join thousands of salon owners who are streamlining their operations with SalonAI.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/request-demo"
                    className="rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-salon-brand transition hover:bg-salon-chip"
                  >
                    Book a Demo &rarr;
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-lg border border-white/45 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>

              <div className="mt-6 hidden sm:block">
                <Image
                  src={images.dashboardMockup}
                  alt="SalonAI Dashboard Laptop View"
                  width={400}
                  height={250}
                  className="h-auto w-full rounded-lg object-contain opacity-95"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
