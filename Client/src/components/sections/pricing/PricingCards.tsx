"use client";

import React from "react";
import Link from "next/link";
import { Building2, Check, Crown, Send, TrendingUp } from "lucide-react";

interface PricingCardsProps {
  billingCycle?: "monthly" | "annual";
  plans?: any[];
}

const PLANS = [
  {
    name: "Starter",
    icon: Send,
    monthly: "$25",
    annual: "$19",
    billed: "Billed annually $228",
    billedMonthly: "Billed monthly",
    desc: "Perfect for small salons just getting started.",
    features: [
      "Up to 2 Staff",
      "Booking Management",
      "Customer Management",
      "Email Support",
    ],
    featured: false,
    cta: "Get Started",
    href: "/request-demo",
  },
  {
    name: "Growth",
    icon: TrendingUp,
    monthly: "$49",
    annual: "$39",
    billed: "Billed annually $468",
    billedMonthly: "Billed monthly",
    desc: "Great for growing salons and beauty businesses.",
    features: [
      "Up to 10 Staff",
      "Everything in Starter",
      "Advanced Reports",
      "Loyalty Programs",
      "SMS & Email Notifications",
      "Priority Support",
    ],
    featured: true,
    cta: "Get Started",
    href: "/request-demo",
  },
  {
    name: "Pro",
    icon: Crown,
    monthly: "$89",
    annual: "$69",
    billed: "Billed annually $828",
    billedMonthly: "Billed monthly",
    desc: "For large salons & multi-branch businesses.",
    features: [
      "Unlimited Staff",
      "Everything in Growth",
      "Multi-branch Management",
      "Custom Roles & Permissions",
      "24/7 Priority Support",
      "AI Insights & Analytics",
    ],
    featured: false,
    cta: "Get Started",
    href: "/request-demo",
  },
  {
    name: "Enterprise",
    icon: Building2,
    monthly: "Custom",
    annual: "Custom",
    billed: "Let's build the best plan for your business.",
    billedMonthly: "Let's build the best plan for your business.",
    desc: "For large enterprises with custom requirements.",
    features: [
      "Everything in Pro",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Onboarding & Training",
      "SLA & Uptime Guarantee",
      "Custom Development",
    ],
    featured: false,
    cta: "Contact Sales",
    href: "/contact",
  },
] as const;

export default function PricingCards({ billingCycle }: PricingCardsProps) {
  const isAnnual = billingCycle === "annual";

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annual : plan.monthly;
            const note = isAnnual ? plan.billed : plan.billedMonthly;

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
                    Most Popular
                  </span>
                ) : null}

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>

                <h3 className="mt-4 text-base font-semibold text-salon-ink">{plan.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-salon-muted">{plan.desc}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-salon-ink">
                    {price}
                  </span>
                  {price !== "Custom" ? (
                    <span className="text-xs text-salon-muted">/month</span>
                  ) : null}
                </div>
                <p className="mt-1 text-[11px] text-salon-muted/80">{note}</p>

                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs text-salon-ink"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                    plan.featured
                      ? "bg-salon-brand text-white hover:bg-salon-brand-dark"
                      : "border border-salon-brand text-salon-brand hover:bg-salon-tile/40"
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
