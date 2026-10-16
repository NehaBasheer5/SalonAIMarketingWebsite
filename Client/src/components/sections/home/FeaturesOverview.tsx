"use client";

import Link from "next/link";
import { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import bookingImg from "@/assets/images/images/BookingM.jpg";
import staffImg from "@/assets/images/images/StaffM.jpg";
import customerImg from "@/assets/images/images/CustomerM.jpg";
import aiFeaturesImg from "@/assets/images/images/ai features.jpg";
import { defaultHomeContent, resolveImageUrl, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["features_overview"];
};

const FEATURE_IMAGES: Record<string, StaticImageData> = {
  "Booking Management": bookingImg,
  "Staff Management": staffImg,
  "Customer Management": customerImg,
  "AI Features": aiFeaturesImg,
};

export default function FeaturesOverview({ content = defaultHomeContent.features_overview }: Props) {
  const features = content.features;
  const count = features.length;
  const [tick, setTick] = useState(0);

  // Keep the cards in place and cycle the content they show — no sliding/movement.
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="relative w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8">
          <div>
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
          </div>
        </div>

        {content.cta_label ? (
          <div className="mb-6 flex justify-end">
            <Link
              href={content.cta_href || "/features"}
              className="group relative inline-flex items-center gap-2 pb-1.5 text-xs font-bold uppercase tracking-widest text-salon-brand-dark transition hover:text-salon-brand"
            >
              {content.cta_label}
              <ArrowRight className="h-4 w-4 animate-nudge" />
              <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-salon-brand to-salon-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((_, slot) => {
            const feature = features[(slot + tick) % count];
            const fallback = FEATURE_IMAGES[feature.title];
            const cardHref = feature.slug
              ? `/features/${feature.slug}`
              : content.cta_href || "/features";
            return (
              <article
                key={slot}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(91,64,39,0.05)]"
              >
                <div
                  key={tick}
                  className="animate-fade-swap flex h-full flex-col"
                  style={{ animationDelay: `${slot * 0.08}s` }}
                >
                  {resolveImageUrl(feature.image_url) || fallback ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <CmsImage
                        value={feature.image_url}
                        fallback={fallback}
                        alt={feature.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-5 pt-4">
                    <h3 className="text-base font-bold text-salon-ink">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-salon-muted">
                      {feature.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <Link
                        href={cardHref}
                        aria-label={`Learn more about ${feature.title}`}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-salon-brand-dark transition hover:text-salon-brand"
                      >
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
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
