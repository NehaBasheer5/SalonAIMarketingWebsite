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
    <section className="relative w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {eyebrow}
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
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
                    <CmsIcon
                    name={item.icon}
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-salon-muted">{item.label}</p>
                    <p className="truncate text-xs font-semibold text-salon-ink">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:col-span-5">
            {image_url ? (
              <div className="relative w-full max-w-md">
                <CmsImage
                  value={image_url}
                  alt={image_alt || "Contact hero"}
                  width={500}
                  height={400}
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
