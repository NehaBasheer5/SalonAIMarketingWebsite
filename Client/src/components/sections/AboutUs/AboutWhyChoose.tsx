import React from "react";
import { defaultAboutContent, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["why_choose"];
};

export default function AboutWhyChoose({
  content = defaultAboutContent.why_choose,
}: Props) {
  if (!content.features.length) return null;

  return (
    <section className="w-full bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="mb-10 text-center font-display text-2xl font-bold tracking-tight text-salon-brand sm:text-3xl">
          {content.heading} <span className="italic text-salon-brand-dark">{content.heading_accent}</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 lg:grid-cols-5">
          {content.features.map((feature) => (
            <div key={feature.title} className="space-y-2 px-2">
              <h3 className="text-sm font-semibold text-salon-ink">{feature.title}</h3>
              <p className="text-[11px] leading-relaxed text-salon-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
