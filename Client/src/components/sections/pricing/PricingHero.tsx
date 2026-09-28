"use client";

import React from "react";

interface PricingHeroProps {
  billingCycle: "monthly" | "annual";
  setBillingCycle: (cycle: "monthly" | "annual") => void;
}

export default function PricingHero({ billingCycle, setBillingCycle }: PricingHeroProps) {
  return (
    <section className="bg-white pt-12 pb-8 text-center">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Simple, Transparent <span className="text-blue-900">Pricing</span>
        </h1>
        <p className="mt-4 text-slate-600 text-sm sm:text-base">
          Choose the perfect plan for your salon. Upgrade, downgrade or cancel anytime.
        </p>

        {/* Toggle Switch */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1.5 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billingCycle === "annual"
                  ? "bg-blue-950 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
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