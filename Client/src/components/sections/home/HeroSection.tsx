"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Scissors } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, fallbackImages, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["hero"];
};

export default function HeroSection({ content = defaultHomeContent.hero }: Props) {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden bg-salon-bg lg:h-[min(760px,100svh)]">
      {/* On desktop the photo starts at the navbar and fills the right half. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
        className="relative mt-20 h-[52vh] min-h-[380px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-[52%]"
      >
        <CmsImage
          value={content.image_url}
          fallback={fallbackImages.hero}
          alt={content.image_alt}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 52vw"
        />
        <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-salon-bg to-transparent lg:block" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex py-12 lg:min-h-[590px] lg:w-[47%] lg:items-center lg:pb-32 lg:pt-24"
        >
          <div className="w-full max-w-xl">
            {content.eyebrow ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-salon-chip px-3 py-2 text-[11px] font-semibold text-salon-ink shadow-[inset_0_0_0_1px_rgba(166,139,103,0.08)]">
                <Scissors className="h-3.5 w-3.5 text-salon-brand" strokeWidth={1.8} />
                <span>{content.eyebrow}</span>
              </div>
            ) : null}

            <h1 className="mt-6 font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl lg:text-[4rem]">
              {content.heading}
              {content.heading_accent ? (
                <span className="block text-salon-gold">{content.heading_accent}</span>
              ) : null}
            </h1>

            {content.subheading ? (
              <p className="mt-5 max-w-md text-base leading-relaxed text-salon-muted sm:text-[1.05rem]">
                {content.subheading}
              </p>
            ) : null}

            {(content.cta_label || content.secondary_cta_label) && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {content.cta_label ? (
                  <Link
                    href={content.cta_href || "/request-demo"}
                    className="inline-flex items-center gap-2 rounded-lg bg-salon-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {content.cta_label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}

                {content.secondary_cta_label ? (
                  <Link
                    href={content.secondary_cta_href || "#"}
                    className="inline-flex items-center gap-3 text-sm font-semibold text-salon-ink transition hover:text-salon-gold"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-salon-border bg-white shadow-sm">
                      <Play className="h-4 w-4 fill-salon-ink" />
                    </span>
                    <span className="leading-tight">
                      {content.secondary_cta_label}
                      {content.secondary_cta_sub ? (
                        <span className="block text-xs font-medium text-salon-muted">
                          {content.secondary_cta_sub}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                ) : null}
              </div>
            )}

            {content.highlights.length ? (
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-salon-border/80 pt-8 sm:grid-cols-4">
                {content.highlights.map((item) => (
                  <div key={item.title} className="min-w-0 text-center">
                    <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-salon-chip text-salon-ink">
                      <CmsIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    <p className="text-xs font-semibold text-salon-ink">{item.title}</p>
                    <p className="mt-0.5 text-[10px] leading-snug text-salon-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
