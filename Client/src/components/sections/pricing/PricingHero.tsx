"use client";

import React from "react";

export type PricingHeroProps = {
  eyebrow?: string;
  heading: string;
  heading_accent?: string;
  subheading: string;
  billingCycle?: "monthly" | "annual";
  setBillingCycle?: (cycle: "monthly" | "annual") => void;
};

export default function PricingHero({
  eyebrow = "Pricing",
  heading,
  heading_accent,
  subheading,
  billingCycle,
  setBillingCycle,
}: PricingHeroProps) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg pt-14 lg:pt-16">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
          {heading}
          {heading_accent ? <span className="block text-salon-gold-soft">{heading_accent}</span> : null}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[19px] leading-relaxed text-salon-muted">
          {subheading}
        </p>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-salon-card bg-salon-shell-soft p-1.5">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-salon-brand text-white shadow-[0_6px_16px_rgba(133,89,47,0.22)]"
                  : "text-salon-muted hover:text-salon-ink"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                billingCycle === "annual"
                  ? "bg-salon-brand text-white shadow-[0_6px_16px_rgba(133,89,47,0.22)]"
                  : "text-salon-muted hover:text-salon-ink"
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
