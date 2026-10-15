"use client";

import React from "react";
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
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
            {content.heading} <span>{content.heading_accent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-5">
          {content.milestones.map((item, index) => (
            <div
              key={item.title}
              className="flex min-h-[260px] flex-col items-start gap-3 rounded-2xl bg-white p-6 text-left shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <p className="font-display text-2xl font-light text-salon-gold-soft/70">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-sm font-semibold text-salon-ink">{item.title}</h3>
              <p className="text-lg leading-relaxed text-salon-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
