"use client";

import React from "react";
import { defaultAboutContent, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["mission_stats"];
};

export default function AboutMissionAndStats({
  content = defaultAboutContent.mission_stats,
}: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
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
            {content.heading} <span className="text-salon-accent">{content.heading_accent}</span>
          </h2>
          {content.subheading ? (
            <p className="mt-2 max-w-2xl text-sm text-salon-muted">{content.subheading}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex min-h-[200px] flex-col justify-center gap-3 rounded-2xl border border-salon-card bg-white/80 p-8 text-center shadow-sm">
            <h3 className="font-display text-2xl text-salon-ink">{content.mission_title}</h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-salon-muted">
              {content.mission_body}
            </p>
          </div>

          <div className="flex min-h-[200px] flex-col justify-center gap-3 rounded-2xl border border-salon-brand bg-salon-brand p-8 text-center text-white shadow-[0_10px_30px_rgba(133,89,47,0.18)]">
            <h3 className="font-display text-2xl text-white">{content.vision_title}</h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-white/85">
              {content.vision_body}
            </p>
          </div>
        </div>
      </div>

      {content.stats.length ? (
        <div className="mt-14 border-y border-salon-card bg-salon-shell-soft py-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-5">
              {content.stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="font-display text-2xl font-semibold tracking-tight text-salon-ink sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-medium text-salon-muted sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
