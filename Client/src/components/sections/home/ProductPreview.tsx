"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, fallbackImages, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["product_preview"];
};

export default function ProductPreview({ content = defaultHomeContent.product_preview }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg">
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-8 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24 lg:pb-16 lg:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mb-8 max-w-2xl"
        >
          <h2 className="font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
            {content.heading}
            {content.heading_accent ? (
              <span className="block bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                {content.heading_accent}
              </span>
            ) : null}
          </h2>

          {content.subheading ? (
            <p className="mt-6 max-w-xl text-[19px] leading-relaxed text-salon-muted">
              {content.subheading}
            </p>
          ) : null}

          {content.cta_label ? (
            <Link
              href={content.cta_href || "/request-demo"}
              className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-salon-brand to-salon-brand-dark px-7 py-3 text-xs font-semibold text-white shadow-lg shadow-salon-brand/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-salon-brand/35"
            >
              <ArrowRight className="h-4 w-4 animate-nudge" />
              {content.cta_label}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </Link>
          ) : null}
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-x-2 gap-y-8 lg:grid-cols-[1fr_minmax(0,620px)_1fr]">
          <div className="space-y-8">
            {content.points.slice(0, 2).map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.15 }}
                className="border-b border-salon-border/70 pb-5 lg:text-right"
              >
                <span className="font-display text-4xl font-light text-salon-gold-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-base font-bold text-salon-ink">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-salon-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto h-[340px] w-full max-w-[620px] overflow-hidden sm:h-[440px] lg:h-[540px]"
          >
            <CmsImage
              value={content.image_url}
              fallback={fallbackImages.product_preview}
              alt={content.image_alt}
              fill
              priority
              className="object-contain object-center"
              sizes="(min-width: 1024px) 620px, 100vw"
            />
          </motion.div>

          <div className="space-y-8">
            {content.points.slice(2).map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.45 + index * 0.15 }}
                className="border-b border-salon-border/70 pb-5"
              >
                <span className="font-display text-4xl font-light text-salon-gold-soft">
                  {String(index + 3).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-base font-bold text-salon-ink">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-salon-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}