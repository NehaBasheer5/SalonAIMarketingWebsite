"use client";

import React from "react";
import { motion } from "framer-motion";
import { defaultAboutContent, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["mission_stats"];
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutMissionAndStats({
  content = defaultAboutContent.mission_stats,
}: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-display text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl"
          >
            {content.heading}{" "}
            <span>{content.heading_accent}</span>
          </motion.h2>
          {content.subheading ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="mt-4 max-w-2xl text-sm text-salon-muted"
            >
              {content.subheading}
            </motion.p>
          ) : null}
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="group relative flex h-full flex-col justify-center overflow-hidden rounded-3xl bg-white p-8 py-14 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl lg:p-10 lg:py-16"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-salon-brand/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="relative font-display text-2xl text-salon-ink">
              {content.mission_title}
            </h3>
              <p className="relative mt-3 text-lg leading-relaxed text-salon-muted">
              {content.mission_body}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="group relative flex h-full flex-col justify-center overflow-hidden rounded-3xl bg-white p-8 py-14 shadow-sm transition duration-500 hover:-translate-y-1.5 hover:shadow-xl lg:p-10 lg:py-16"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-salon-gold/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="relative font-display text-2xl text-salon-ink">
              {content.vision_title}
            </h3>
              <p className="relative mt-3 text-lg leading-relaxed text-salon-muted">
              {content.vision_body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
