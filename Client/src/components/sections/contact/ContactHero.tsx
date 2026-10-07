"use client";

import CmsImage from "@/components/ui/CmsImage";
import CmsIcon from "@/components/ui/CmsIcon";
import type { IconName } from "@/lib/content";

export type ContactHeroProps = {
  eyebrow?: string;
  heading: string;
  subheading: string;
  image_url?: string;
  image_alt?: string;
  quick_contacts: { icon: IconName; label: string; value: string }[];
};

export default function ContactHero({
  eyebrow = "Get in Touch",
  heading,
  subheading,
  image_url,
  image_alt,
  quick_contacts,
}: ContactHeroProps) {
  return (
    <section className="relative min-h-[560px] w-full overflow-hidden bg-salon-bg lg:min-h-[min(480px,100svh)]">
      {/* On desktop the photo fills the right half, same as the home hero. */}
      {image_url ? (
        <div className="relative h-[35vh] min-h-[260px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[52%]">
          <CmsImage
            value={image_url}
            alt={image_alt || "Contact hero"}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 52vw"
          />
          <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-salon-bg to-transparent lg:block" />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`flex py-12 lg:min-h-[400px] lg:items-center lg:pb-20 lg:pt-16 ${
            image_url ? "lg:w-[47%]" : "lg:w-3/4"
          }`}
        >
          <div className="w-full max-w-xl space-y-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {eyebrow}
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl lg:text-[4rem]">
              {heading}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-salon-muted">{subheading}</p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {quick_contacts.map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex items-center gap-3 rounded-2xl border border-salon-card bg-white/80 p-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                    <CmsIcon name={item.icon} className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-salon-muted">{item.label}</p>
                    <p className="truncate text-xs font-semibold text-salon-ink">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
