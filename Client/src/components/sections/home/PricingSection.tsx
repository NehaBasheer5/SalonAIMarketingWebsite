"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["pricing"];
};

export default function PricingSection({ content = defaultHomeContent.pricing }: Props) {
  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
              {content.heading}
              {content.heading_accent ? (
                <span className="block bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                  {content.heading_accent}
                </span>
              ) : null}
            </h2>
            {content.subheading ? (
               <p className="mt-2 max-w-xl text-[19px] text-salon-muted">{content.subheading}</p>
            ) : null}
          </div>
          {content.cta_label ? (
            <Link
              href={content.cta_href || "/pricing"}
              className="group relative inline-flex items-center gap-2 text-sm font-semibold text-salon-brand transition hover:text-salon-brand-dark"
            >
              <span>{content.cta_label.replace(/\s*→\s*$/, "")}</span>
              <ArrowRight className="h-4 w-4 animate-nudge transition-transform group-hover:translate-x-1" />
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-salon-brand to-salon-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.plans.map((plan, index) => (
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
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-xs text-salon-muted">{plan.period}</span>
                ) : null}
              </div>
              {plan.description ? (
                <p className="mt-3 text-xs leading-relaxed text-salon-muted">{plan.description}</p>
              ) : null}

              {plan.features.length ? (
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-xs text-salon-ink">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand">
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
                  className={`mt-auto inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-semibold transition duration-300 ${
                    plan.featured
                      ? "bg-gradient-to-r from-salon-brand to-salon-brand-dark text-white shadow-md shadow-salon-brand/25 hover:shadow-lg hover:shadow-salon-brand/35"
                      : "border border-salon-brand text-salon-brand hover:bg-salon-brand hover:text-white"
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
