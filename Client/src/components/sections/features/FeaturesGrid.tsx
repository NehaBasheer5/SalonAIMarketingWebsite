"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import CmsIcon from "@/components/ui/CmsIcon";
import bookingImg from "@/assets/images/images/BookingM.jpg";
import staffImg from "@/assets/images/images/StaffM.jpg";
import customerImg from "@/assets/images/images/CustomerM.jpg";
import aiFeaturesImg from "@/assets/images/images/ai features.jpg";
import { defaultFeaturesContent, type FeaturesContent } from "@/lib/content";

type Props = {
  content?: FeaturesContent["feature_grid"];
};

const FEATURE_IMAGES: Record<string, StaticImageData> = {
  "Online Booking": bookingImg,
  "Booking Management": bookingImg,
  "Customer Management": customerImg,
  "Staff Management": staffImg,
  "Roles & Permissions": staffImg,
  "AI Insights": aiFeaturesImg,
  "AI Features": aiFeaturesImg,
};

const IMAGE_POOL = [bookingImg, customerImg, staffImg, aiFeaturesImg];

export default function FeaturesGrid({ content = defaultFeaturesContent.feature_grid }: Props) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFeatures =
    activeTab === "all"
      ? content.features
      : content.features.filter((feature) => feature.category === activeTab);

  return (
    <section className="w-full overflow-hidden bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
            {content.heading}
            {content.heading_accent ? <> {content.heading_accent}</> : null}
          </h2>
        </div>

        {content.categories.length ? (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {content.categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-salon-brand text-white shadow-[0_6px_16px_rgba(133,89,47,0.2)]"
                      : "border border-salon-card bg-white/70 text-salon-muted hover:bg-white hover:text-salon-ink"
                  }`}
                >
                  <CmsIcon name={cat.icon} className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredFeatures.map((feature, index) => {
            const image = FEATURE_IMAGES[feature.title] ?? IMAGE_POOL[index % IMAGE_POOL.length];
            return (
              <article
                key={`${feature.title}-${index}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(91,64,39,0.05)] transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(91,64,39,0.1)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={feature.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 pt-4">
                  <h3 className="text-base font-bold text-salon-ink">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-salon-muted">{feature.description}</p>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <Link
                      href={feature.href || "/request-demo"}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-salon-brand-dark transition hover:text-salon-brand"
                    >
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
