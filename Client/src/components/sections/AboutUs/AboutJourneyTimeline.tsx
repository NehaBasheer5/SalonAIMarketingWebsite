"use client";

import React from "react";
import CmsIcon from "@/components/ui/CmsIcon";
import { defaultAboutContent, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["journey"];
};

export default function AboutJourneyTimeline({
  content = defaultAboutContent.journey,
}: Props) {
  if (!content.milestones.length) return null;

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
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
        </div>

        <div className="relative">
          <div className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-salon-rule/40 md:block" />
          <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
            {content.milestones.map((item, index) => (
              <div key={item.title} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-salon-brand text-white shadow-[0_6px_18px_rgba(133,89,47,0.22)]">
                  <CmsIcon name={item.icon} className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <p className="font-display text-[10px] font-light text-salon-gold-soft/70">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="text-sm font-semibold text-salon-ink">{item.title}</h3>
                <p className="text-[11px] leading-relaxed text-salon-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
