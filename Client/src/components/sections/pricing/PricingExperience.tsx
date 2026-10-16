"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import CmsImage from "@/components/ui/CmsImage";
import type { PricingPlan } from "@/lib/content";

export type PricingExperienceProps = {
  hero: {
    heading: string;
    heading_accent?: string;
    subheading: string;
    monthly_label?: string;
    annual_label?: string;
    per_month_suffix?: string;
  };
  plans: PricingPlan[];
  /** Message for the case where no packages are published. */
  emptyMessage?: string;
  /** `hero` and `pricing_cards` are separate CMS sections, so each can be hidden on its own. */
  showHero?: boolean;
  showPlans?: boolean;
};

/**
 * Client wrapper for the pricing page: the CMS hero copy plus the package grid.
 *
 * The package data arrives from the CMS, but the monthly/annual toggle is
 * interactive, so this piece owns the billing cycle state and renders both the
 * toggle and the package cards itself.
 */
export default function PricingExperience({
  hero,
  plans,
  emptyMessage,
  showHero = true,
  showPlans = true,
}: PricingExperienceProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const isAnnual = billingCycle === "annual";
  const suffix = hero.per_month_suffix ?? "/month";

  const cycleOptions: { key: "monthly" | "annual"; label: string }[] = [
    { key: "monthly", label: hero.monthly_label ?? "Monthly" },
    { key: "annual", label: hero.annual_label ?? "Annual" },
  ];

  return (
    <>
      {showHero ? (
        <>
          <section className="w-full overflow-hidden bg-salon-bg pt-14 lg:pt-16">
            <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
              <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
                {hero.heading}
                {hero.heading_accent ? (
                  <span className="block text-salon-gold-soft">{hero.heading_accent}</span>
                ) : null}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-salon-muted sm:text-base">
                {hero.subheading}
              </p>
            </div>
          </section>
        </>
      ) : null}

      {showPlans ? (
        <>
          {/* The toggle belongs with the packages rather than the hero, so
              hiding the hero copy never takes the price control with it. */}
          <section className="w-full overflow-hidden bg-salon-bg pt-10 lg:pt-12">
            <div className="flex justify-center">
              <div className="inline-flex rounded-full border border-salon-card bg-salon-shell-soft p-1.5">
                {cycleOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setBillingCycle(option.key)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
                      billingCycle === option.key
                        ? "bg-salon-brand text-white shadow-[0_6px_16px_rgba(133,89,47,0.22)]"
                        : "text-salon-muted hover:text-salon-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
              {plans.length === 0 ? (
                <p className="text-center text-sm text-salon-muted">
                  {emptyMessage || "Pricing packages are coming soon."}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {plans.map((plan, index) => {
                    const price = isAnnual ? plan.annual : plan.monthly;
                    const note = isAnnual ? plan.billed : plan.billedMonthly;
                    const description = plan.desc || plan.description || "";

                    return (
                      <motion.article
                        key={plan.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className={`group relative flex min-h-[340px] flex-col rounded-3xl p-6 transition-all duration-300 ease-out will-change-transform ${
                          plan.featured
                            ? "bg-gradient-to-b from-white to-salon-shell shadow-[0_18px_45px_rgba(133,89,47,0.16)] hover:-translate-y-2 hover:scale-[1.05] hover:shadow-[0_28px_60px_rgba(133,89,47,0.28)]"
                            : "bg-white shadow-[0_8px_24px_rgba(91,64,39,0.06)] hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_22px_50px_rgba(91,64,39,0.16)]"
                        }`}
                      >
                        {plan.featured ? (
                          <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-salon-brand to-salon-gold px-3.5 py-1 text-[12px] font-bold uppercase tracking-wide text-white shadow-md shadow-salon-brand/30">
                            {plan.badge || "Most Popular"}
                          </span>
                        ) : null}

                        {plan.image_url ? (
                          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-salon-tile/40">
                            <CmsImage
                              value={plan.image_url}
                              alt={plan.image_alt || `${plan.name} plan`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </div>
                        ) : null}

                        <h3 className="text-base font-semibold text-salon-ink">{plan.name}</h3>
                        <div className="mt-3 flex items-baseline gap-1.5">
                          <span className="font-display text-4xl font-bold tracking-tight text-salon-ink">
                            {price}
                          </span>
                          {price && price !== "Custom" && suffix ? (
                            <span className="text-xs text-salon-muted">{suffix}</span>
                          ) : null}
                        </div>
                        {description ? (
                          <p className="mt-3 text-xs leading-relaxed text-salon-muted">{description}</p>
                        ) : null}
                        {note ? (
                          <p className="mt-1 text-[13px] text-salon-muted/80">{note}</p>
                        ) : null}

                        {(plan.features || []).length ? (
                          <ul className="mt-6 space-y-3">
                            {(plan.features || []).map((feature) => (
                              <li key={feature} className="flex items-center gap-2.5 text-xs text-salon-ink">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand">
                                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        <Link
                          href={plan.href || plan.cta_href || "/request-demo"}
                          className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-semibold transition duration-300 ${
                            plan.featured
                              ? "bg-gradient-to-r from-salon-brand to-salon-brand-dark text-white shadow-md shadow-salon-brand/25 hover:shadow-lg hover:shadow-salon-brand/35"
                              : "border border-salon-brand text-salon-brand hover:bg-salon-brand hover:text-white"
                          }`}
                        >
                          {plan.cta || plan.cta_label || "Get Started"}
                        </Link>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}
