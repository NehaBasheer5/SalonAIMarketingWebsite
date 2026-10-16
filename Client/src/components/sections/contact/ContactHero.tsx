"use client";

import CmsImage from "@/components/ui/CmsImage";
import { resolveImageUrl } from "@/lib/content";
import contactVideo from "@/assets/images/images/contact.mp4";

export type ContactHeroProps = {
  heading: string;
  subheading: string;
  image_url?: string;
  image_alt?: string;
};

export default function ContactHero({
  heading,
  subheading,
  image_url,
  image_alt,
}: ContactHeroProps) {
  const hasCmsMedia = Boolean(resolveImageUrl(image_url));

  return (
    <section className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-salon-bg lg:min-h-[min(560px,100svh)]">
      <div className="absolute inset-0 h-full w-full">
        {hasCmsMedia ? (
          <CmsImage
            value={image_url}
            alt={image_alt ?? ""}
            fill
            controls={false}
            className="h-full w-full object-cover object-center pointer-events-none select-none"
            sizes="100vw"
            priority
          />
        ) : (
          <video
            src={contactVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-center pointer-events-none select-none"
          />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 text-center sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <h1 className="text-center font-display text-5xl leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[4.75rem]">
            {heading}
          </h1>

          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-white/85 sm:text-lg">
            {subheading}
          </p>
        </div>
      </div>
    </section>
  );
}
