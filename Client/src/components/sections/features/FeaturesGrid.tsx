"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import { defaultFeaturesContent, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["feature_grid"];
};

export default function FeaturesGrid({ content = defaultFeaturesContent.feature_grid }: Props) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFeatures =
    activeTab === "all"
      ? content.features
      : content.features.filter((feature) => feature.category === activeTab);

  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          {content.eyebrow ? (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {content.eyebrow}
              </span>
              <span className="h-px w-8 bg-salon-rule" />
            </div>
          ) : null}
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            {content.heading}
            {content.heading_accent ? (
              <span className="text-salon-accent"> {content.heading_accent}</span>
            ) : null}
          </h2>
        </div>

        {content.categories.length ? (
          <div className="mb-10 flex items-start gap-2 overflow-x-auto pb-2">
            {content.categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-salon-brand text-white shadow-[0_6px_16px_rgba(133,89,47,0.2)]"
                      : "border border-salon-card bg-white/70 text-salon-muted hover:bg-white hover:text-salon-ink"
                  }`}
                >
                  <CmsIcon name={cat.icon} className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredFeatures.map((feature, index) => (
            <article
              key={`${feature.title}-${index}`}
              className="group flex min-h-[220px] flex-col rounded-2xl border border-salon-card bg-white/80 p-5 shadow-[0_8px_30px_rgba(91,64,39,0.05)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_34px_rgba(91,64,39,0.1)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-salon-tile text-salon-brand-dark transition group-hover:bg-salon-brand group-hover:text-white">
                <CmsIcon name={feature.icon} className="h-6 w-6" />
              </span>

              <h3 className="mt-3 text-base font-semibold text-salon-ink">{feature.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-salon-muted">{feature.description}</p>

              <div className="mt-auto flex items-end justify-between pt-5">
                <Link
                  href={feature.href || "/request-demo"}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-salon-brand transition group-hover:gap-2.5"
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="font-display text-3xl font-light text-salon-gold-soft/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
