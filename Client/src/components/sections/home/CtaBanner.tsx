"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import homeCtaVideo from "@/assets/images/images/home-cta.mp4";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, resolveImageUrl, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["cta_banner"];
};

export default function CtaBanner({ content = defaultHomeContent.cta_banner }: Props) {
  const chips = content.features.map((item) => item.title);
  const mediaUrl = resolveImageUrl(content.image_url);

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            {content.eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-wider text-salon-muted">
                {content.eyebrow}
              </p>
            ) : null}

            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
              {content.heading}
              {content.heading_accent ? (
                <span className="block bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                  {content.heading_accent}
                </span>
              ) : null}
            </h2>

            {content.subheading ? (
               <p className="mt-4 max-w-xl text-[19px] leading-relaxed text-salon-muted">
                {content.subheading}
              </p>
            ) : null}

            {chips.length ? (
              <ul className="mt-8 flex w-fit flex-col border-t border-salon-card">
                {chips.map((chip) => (
                  <li
                    key={chip}
                    className="border-b border-salon-card py-3 text-sm font-medium text-salon-ink"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            ) : null}

            {content.cta_label ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8"
              >
                <Link
                  href={content.cta_href || "/request-demo"}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-salon-brand to-salon-brand-dark px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-salon-brand/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-salon-brand/35"
                >
                  {content.cta_label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : null}
          </motion.div>

          {/* Right — video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto h-[320px] w-full max-w-2xl translate-y-8 sm:h-[390px] lg:-ml-8 lg:mr-0 lg:h-[480px] lg:translate-y-20"
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-3xl"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {mediaUrl ? (
                <CmsImage
                  value={content.image_url}
                  alt={content.image_alt}
                  fill
                  controls={false}
                  loop
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : (
                <video
                  src={homeCtaVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={content.image_alt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
