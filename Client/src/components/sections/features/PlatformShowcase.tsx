"use client";

import React from "react";
import { motion } from "framer-motion";
import featuresOne from "@/assets/images/images/features1.jpg";
import featuresTwo from "@/assets/images/images/features2.jpg";
import featuresThree from "@/assets/images/images/StaffM.jpg";
import CmsImage from "@/components/ui/CmsImage";
import { defaultFeaturesContent, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["platform_showcase"];
};

export default function PlatformShowcase({
  content = defaultFeaturesContent.platform_showcase,
}: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="order-2 flex justify-center lg:order-1 lg:col-span-6">
            <div className="relative w-full max-w-2xl">
              {/* Top row - Two side cards */}
              <div className="grid grid-cols-3 gap-4">
                {/* Left card with rounded bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative aspect-[3/5] overflow-visible"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl rounded-b-[50%] bg-white shadow-[0_20px_50px_-15px_rgba(91,64,39,0.3)]">
                    <CmsImage
                      value={content.image_left}
                      fallback={featuresOne}
                      alt="SalonAI booking and scheduling"
                      fill
                      sizes="(max-width: 1024px) 30vw, 15vw"
                      className="object-cover"
                    />
                    {/* Fade out gradient at top */}
                    <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-salon-bg via-salon-bg/60 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Center card - With features3 image */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className="relative mt-20 aspect-[3/5] overflow-visible"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl rounded-t-[50%] bg-white shadow-[0_30px_70px_-20px_rgba(91,64,39,0.4)]">
                    <div className="relative z-0 h-full w-full">
                      <CmsImage
                        value={content.image_center}
                        fallback={featuresThree}
                        alt="SalonAI analytics dashboard"
                        fill
                        sizes="(max-width: 1024px) 30vw, 15vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                    {/* Fade out gradient at bottom - exactly like cards 1 & 3 */}
                    <div className="absolute inset-x-0 bottom-0 z-10 h-[40%] bg-gradient-to-t from-salon-bg via-salon-bg/60 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Right card with rounded bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className="relative aspect-[3/5] overflow-visible"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-3xl rounded-b-[50%] bg-white shadow-[0_20px_50px_-15px_rgba(91,64,39,0.3)]">
                    <CmsImage
                      value={content.image_right}
                      fallback={featuresTwo}
                      alt="SalonAI staff and customer management"
                      fill
                      sizes="(max-width: 1024px) 30vw, 15vw"
                      className="object-cover"
                    />
                    {/* Fade out gradient at top */}
                    <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-salon-bg via-salon-bg/60 to-transparent"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-black sm:text-4xl lg:text-5xl">
              {content.heading}
              {content.heading_accent ? (
                <span className="block">{content.heading_accent}</span>
              ) : null}
            </h2>

            {content.body ? (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-salon-gold">
                {content.body}
              </p>
            ) : null}

            {content.benefits.length ? (
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {content.benefits.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.07 }}
                  >
                    <span className="font-display text-xl font-light text-salon-gold-soft">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-salon-ink">{item.title}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-salon-muted">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
