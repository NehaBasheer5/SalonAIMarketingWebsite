"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, fallbackImages, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["product_preview"];
};

export default function ProductPreview({ content = defaultHomeContent.product_preview }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg">
      <div className="relative min-h-[440px] lg:min-h-[520px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="relative h-[340px] w-full overflow-hidden sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[58%]"
        >
          <CmsImage
            value={content.image_url}
            fallback={fallbackImages.product_preview}
            alt={content.image_alt}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-salon-bg via-salon-bg/65 to-transparent lg:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 px-5 py-12 sm:px-8 lg:flex lg:min-h-[520px] lg:w-[43%] lg:items-center lg:py-10 lg:pl-[6vw] lg:pr-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {content.eyebrow}
              </span>
            </div>

            <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-salon-ink sm:text-4xl lg:text-[2.7rem]">
              {content.heading}
              {content.heading_accent ? (
                <span className="block text-salon-accent">{content.heading_accent}</span>
              ) : null}
            </h2>

            {content.subheading ? (
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-salon-muted">
                {content.subheading}
              </p>
            ) : null}

            {content.points.length ? (
              <ul className="mt-6 space-y-3.5">
                {content.points.map((item) => (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                      <CmsIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-salon-ink">{item.title}</p>
                      <p className="mt-0.5 text-[11px] text-salon-muted">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {content.cta_label ? (
              <Link
                href={content.cta_href || "/request-demo"}
                className="mt-6 inline-flex items-center gap-8 rounded-lg bg-salon-brand px-6 py-3 text-xs font-semibold text-white transition hover:bg-salon-brand-dark"
              >
                {content.cta_label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
