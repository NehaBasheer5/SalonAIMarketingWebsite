"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import type { PricingPlan } from "@/lib/content";

export type PricingExperienceProps = {
  hero: {
    eyebrow?: string;
    heading: string;
    heading_accent?: string;
    subheading: string;
    monthly_label?: string;
    annual_label?: string;
    per_month_suffix?: string;
    image_url?: string;
    image_alt?: string;
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
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-salon-rule" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                  {hero.eyebrow || "Pricing"}
                </span>
                <span className="h-px w-8 bg-salon-rule" />
              </div>

              <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
                {hero.heading}
                {hero.heading_accent ? (
                  <span className="block text-salon-accent">{hero.heading_accent}</span>
                ) : null}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-salon-muted sm:text-base">
                {hero.subheading}
              </p>
            </div>
          </section>

          {hero.image_url ? (
            <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-salon-card bg-salon-shell-soft">
                <CmsImage
                  value={hero.image_url}
                  alt={hero.image_alt || "SalonAI pricing"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              </div>
            </div>
          ) : null}
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
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              {plans.length === 0 ? (
                <p className="text-center text-sm text-salon-muted">
                  {emptyMessage || "Pricing packages are coming soon."}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {plans.map((plan) => {
                    const price = isAnnual ? plan.annual : plan.monthly;
                    const note = isAnnual ? plan.billed : plan.billedMonthly;
                    const description = plan.desc || plan.description || "";

                    return (
                      <article
                        key={plan.name}
                        className={`relative flex min-h-[340px] flex-col rounded-2xl border p-5 ${
                          plan.featured
                            ? "border-salon-brand bg-salon-shell shadow-[0_10px_30px_rgba(133,89,47,0.14)]"
                            : "border-salon-card bg-white/80"
                        }`}
                      >
                        {plan.featured ? (
                          <span className="absolute -top-3 left-5 rounded-full bg-salon-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                            {plan.badge || "Most Popular"}
                          </span>
                        ) : null}

                        {plan.image_url ? (
                          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-salon-tile/40">
                            <CmsImage
                              value={plan.image_url}
                              alt={plan.image_alt || `${plan.name} plan`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </div>
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                            <CmsIcon name={plan.icon} className="h-5 w-5" strokeWidth={1.8} />
                          </span>
                        )}

                        <h3 className="mt-4 text-base font-semibold text-salon-ink">{plan.name}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-salon-muted">
                          {description}
                        </p>

                        <div className="mt-5 flex items-baseline gap-1">
                          <span className="font-display text-3xl font-semibold text-salon-ink">
                            {price}
                          </span>
                          {price && price !== "Custom" && suffix ? (
                            <span className="text-xs text-salon-muted">{suffix}</span>
                          ) : null}
                        </div>
                        {note ? (
                          <p className="mt-1 text-[11px] text-salon-muted/80">{note}</p>
                        ) : null}

                        <ul className="mt-5 space-y-2.5">
                          {(plan.features || []).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-xs text-salon-ink">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand">
                                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                              </span>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={plan.href || plan.cta_href || "/request-demo"}
                          className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                            plan.featured
                              ? "bg-salon-brand text-white hover:bg-salon-brand-dark"
                              : "border border-salon-brand text-salon-brand hover:bg-salon-tile/40"
                          }`}
                        >
                          {plan.cta || plan.cta_label || "Get Started"}
                        </Link>
                      </article>
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
