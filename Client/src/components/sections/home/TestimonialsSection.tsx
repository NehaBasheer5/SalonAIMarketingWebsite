"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { defaultHomeContent, resolveImageUrl, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["testimonials"];
};

export default function TestimonialsSection({
  content = defaultHomeContent.testimonials,
}: Props) {
  const items = content.items;

  return (
    <section
      id="testimonials"
      className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl"
            >
              {content.heading}
              {content.heading_accent ? (
                <span className="block bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                  {content.heading_accent}
                </span>
              ) : null}
            </h2>
            {content.subheading ? (
               <p className="mt-2 max-w-lg text-[19px] text-salon-muted">{content.subheading}</p>
            ) : null}
          </div>
        </div>

        <div className="relative -mx-5 overflow-hidden px-5 sm:-mx-8 sm:px-8">
          <div className="flex w-max animate-marquee gap-4" style={{ animationDuration: "16s" }}>
            {[...items, ...items].map((item, index) => (
              <motion.article
                key={`${item.name}-${index}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group relative flex min-h-[220px] w-[min(85vw,360px)] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="relative w-28 shrink-0 overflow-hidden bg-salon-tile/40 sm:w-32">
                  {item.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(item.avatar_url)}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-5xl text-salon-brand/30">
                      {item.name?.[0] ?? "S"}
                    </div>
                  )}
                </div>

                <div className="relative -ml-8 flex flex-1 flex-col rounded-l-3xl border-l border-white/60 bg-white/70 p-6 pl-12 backdrop-blur-md">
                  <div className="mb-3 flex text-salon-accent">
                    {Array.from({ length: Math.max(0, Math.min(5, item.rating || 0)) }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-salon-muted">{item.content}</p>

                  <div className="mt-5 flex items-center gap-3 border-t border-salon-card/70 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-salon-ink">{item.name}</p>
                      <p className="text-xs text-salon-muted">
                        {[item.role, item.salon].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-salon-bg to-transparent sm:w-8" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-salon-bg to-transparent sm:w-8" />
        </div>
      </div>
    </section>
  );
}
