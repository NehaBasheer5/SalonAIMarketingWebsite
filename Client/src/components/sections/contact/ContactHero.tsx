"use client";

import type { IconName } from "@/lib/content";
import contactVideo from "@/assets/images/images/contact.mp4";

export type ContactHeroProps = {
  eyebrow?: string;
  heading: string;
  subheading: string;
  image_url?: string;
  image_alt?: string;
  quick_contacts: { icon: IconName; label: string; value: string }[];
};

export default function ContactHero({
  heading,
  subheading,
  image_url,
  image_alt,
}: ContactHeroProps) {
  return (
    <section className="relative min-h-[460px] w-full overflow-hidden bg-salon-bg lg:min-h-[min(420px,100svh)]">
      {/* Right side video */}
      <div className="relative h-[38vh] min-h-[280px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[52%]">
        <video
          src={contactVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover object-center pointer-events-none select-none"
        />
        <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-salon-bg to-transparent lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div
          className="flex flex-col items-center py-14 text-center lg:min-h-[360px] lg:items-center lg:pb-20 lg:pt-20 lg:w-[47%]"
        >
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <h1 className="text-center font-display text-6xl leading-[1.06] tracking-tight sm:text-7xl lg:text-[4.75rem]">
              <span className="bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                {heading}
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-salon-ink sm:text-lg">
              {subheading}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
