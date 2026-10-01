import React from "react";
import CmsIcon from "@/components/ui/CmsIcon";
import { defaultFeaturesContent, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["stats_bar"];
};

export default function StatsBar({ content = defaultFeaturesContent.stats_bar }: Props) {
  if (!content.stats.length) return null;

  return (
    <section className="border-y border-salon-card bg-salon-shell-soft py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`grid grid-cols-2 gap-6 ${
            content.stats.length >= 5 ? "md:grid-cols-5" : "md:grid-cols-3"
          }`}
        >
          {content.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                <CmsIcon name={stat.icon} className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-semibold text-salon-ink">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium text-salon-muted">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
