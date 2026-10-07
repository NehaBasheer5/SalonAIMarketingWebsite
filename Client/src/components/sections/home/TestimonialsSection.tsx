"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { defaultHomeContent, resolveImageUrl, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["testimonials"];
};

export default function TestimonialsSection({
  content = defaultHomeContent.testimonials,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = content.items;

  return (
    <section
      id="testimonials"
      className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {content.eyebrow}
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl"
            >
              {content.heading}
              {content.heading_accent ? (
                <span className="text-salon-accent"> {content.heading_accent}</span>
              ) : null}
            </h2>
            {content.subheading ? (
              <p className="mt-2 max-w-lg text-sm text-salon-muted">{content.subheading}</p>
            ) : null}
          </div>
          {content.cta_label ? (
            <Link
              href={content.cta_href || "/#testimonials"}
              className="text-sm font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              {content.cta_label}
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="flex min-h-[250px] flex-col rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-salon-tile font-display text-xl text-salon-brand">
                  &ldquo;
                </span>
                <div className="flex text-salon-accent">
                  {Array.from({ length: Math.max(0, Math.min(5, item.rating || 0)) }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-salon-muted">{item.content}</p>

              <div className="mt-5 flex items-center gap-3 border-t border-salon-card pt-4">
                {item.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveImageUrl(item.avatar_url)}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-salon-ink">{item.name}</p>
                  <p className="text-xs text-salon-muted">
                    {[item.role, item.salon].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {items.length > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => setActiveIndex((i) => (i === 0 ? items.length - 1 : i - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-salon-card bg-white text-salon-brand"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {items.map((item, i) => (
                <button
                  key={`${item.name}-dot-${i}`}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    activeIndex === i ? "bg-salon-brand" : "bg-salon-card"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => setActiveIndex((i) => (i === items.length - 1 ? 0 : i + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-salon-card bg-white text-salon-brand"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
