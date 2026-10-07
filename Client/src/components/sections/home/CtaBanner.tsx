"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Scissors, Star, TrendingUp } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, fallbackImages, resolveImageUrl, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["cta_banner"];
};

export default function CtaBanner({ content = defaultHomeContent.cta_banner }: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-9 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              {content.eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-salon-ink sm:text-4xl lg:text-[2.8rem]">
            {content.heading}
            {content.heading_accent ? (
              <span className="text-salon-accent"> {content.heading_accent}</span>
            ) : null}
          </h2>

          {content.subheading ? (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-salon-muted">
              {content.subheading}
            </p>
          ) : null}

          {content.features.length ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {content.features.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                    <CmsIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-salon-ink">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-salon-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {(content.cta_label || content.secondary_cta_label) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {content.cta_label ? (
                <Link
                  href={content.cta_href || "/request-demo"}
                  className="inline-flex items-center gap-2 rounded-lg bg-salon-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-salon-brand-dark"
                >
                  {content.cta_label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              {content.secondary_cta_label ? (
                <Link
                  href={content.secondary_cta_href || "/contact"}
                  className="inline-flex items-center rounded-lg border border-salon-brand px-6 py-3 text-sm font-semibold text-salon-brand transition hover:bg-salon-tile/50"
                >
                  {content.secondary_cta_label}
                </Link>
              ) : null}
            </div>
          )}

          {(content.avatars.length || content.trust_text) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {content.avatars.length ? (
                <div className="flex -space-x-2">
                  {content.avatars.map((src, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${src}-${index}`}
                      src={resolveImageUrl(src)}
                      alt=""
                      className="h-8 w-8 rounded-full border-2 border-salon-bg object-cover"
                    />
                  ))}
                </div>
              ) : null}
              {content.trust_text ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex text-salon-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-salon-muted">{content.trust_text}</span>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl lg:max-w-none">
            <CmsImage
              value={content.image_url}
              fallback={fallbackImages.cta_banner}
              alt={content.image_alt}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
              priority
            />

            {content.stat_value ? (
              <div className="absolute left-4 top-6 hidden w-44 rounded-xl bg-white/95 p-3 shadow-lg sm:block">
                <div className="mb-1 flex items-center gap-2 text-salon-brand">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-[10px] font-semibold text-salon-muted">
                    {content.stat_label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-display text-2xl font-semibold text-salon-ink">
                    {content.stat_value}
                  </span>
                  {content.stat_delta ? (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      {content.stat_delta}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}

            {content.stat_note_title ? (
              <div className="absolute bottom-6 left-4 right-4 rounded-xl bg-salon-soft/95 p-4 shadow-lg backdrop-blur-sm sm:left-auto sm:right-4 sm:w-56">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-salon-brand text-white">
                    <Scissors className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-salon-ink">{content.stat_note_title}</p>
                    {content.stat_note_body ? (
                      <p className="mt-1 text-[11px] leading-relaxed text-salon-muted">
                        {content.stat_note_body}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
