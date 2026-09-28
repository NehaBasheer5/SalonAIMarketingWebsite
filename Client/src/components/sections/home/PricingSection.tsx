"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    desc: "Perfect for small salons getting started.",
    features: ["Up to 2 Staff", "Basic Features", "Email Support"],
    featured: false,
  },
  {
    name: "Growth",
    price: "$39",
    period: "/month",
    desc: "Great for growing salons.",
    features: ["Up to 10 Staff", "Advanced Features", "Priority Support"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$69",
    period: "/month",
    desc: "For large salons & multi-branches.",
    features: ["Unlimited Staff", "All Features", "24/7 Support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large enterprises.",
    features: ["Custom Solutions", "Dedicated Support", "Onboarding & Training"],
    featured: false,
  },
] as const;

export default function PricingSection() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a98a65]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
                Pricing
              </span>
            </div>
            <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
              Simple, <span className="text-[#91663f]">Transparent Pricing</span>
            </h2>
          </div>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-[#85592f] underline-offset-4 hover:underline"
          >
            View Full Pricing →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex min-h-[300px] flex-col rounded-2xl border p-5 ${
                plan.featured
                  ? "border-[#85592f] bg-[#f3ebe2] shadow-[0_10px_30px_rgba(133,89,47,0.12)]"
                  : "border-[#eadfce] bg-[#f8f1ea]/70"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-5 rounded-full bg-[#85592f] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              ) : null}

              <h3 className="text-base font-semibold text-salon-ink">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-salon-ink">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-xs text-salon-muted">{plan.period}</span>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-salon-muted">{plan.desc}</p>

              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-salon-ink">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#efe2d4] text-[#85592f]">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
                className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                  plan.featured
                    ? "bg-[#85592f] text-white hover:bg-[#6f4929]"
                    : "border border-[#85592f] text-[#85592f] hover:bg-white"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
