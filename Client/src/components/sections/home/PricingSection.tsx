"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { defaultHomeContent, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["pricing"];
};

export default function PricingSection({ content = defaultHomeContent.pricing }: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {content.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
              {content.heading}
              {content.heading_accent ? (
                <span className="text-salon-accent"> {content.heading_accent}</span>
              ) : null}
            </h2>
          </div>
          {content.cta_label ? (
            <Link
              href={content.cta_href || "/pricing"}
              className="text-sm font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              {content.cta_label}
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex min-h-[300px] flex-col rounded-2xl border p-5 ${
                plan.featured
                  ? "border-salon-brand bg-salon-shell shadow-[0_10px_30px_rgba(133,89,47,0.12)]"
                  : "border-salon-card bg-salon-shell-soft/70"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-5 rounded-full bg-salon-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {plan.badge || "Most Popular"}
                </span>
              ) : null}

              <h3 className="text-base font-semibold text-salon-ink">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-salon-ink">
                  {plan.price}
                </span>
                {plan.period ? <span className="text-xs text-salon-muted">{plan.period}</span> : null}
              </div>
              {plan.description ? (
                <p className="mt-2 text-xs leading-relaxed text-salon-muted">{plan.description}</p>
              ) : null}

              {plan.features.length ? (
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-salon-ink">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-salon-tile text-salon-brand">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}

              {plan.cta_label ? (
                <Link
                  href={plan.cta_href || "/request-demo"}
                  className={`mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                    plan.featured
                      ? "bg-salon-brand text-white hover:bg-salon-brand-dark"
                      : "border border-salon-brand text-salon-brand hover:bg-white"
                  }`}
                >
                  {plan.cta_label}
                </Link>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
