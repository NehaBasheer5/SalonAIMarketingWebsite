"use client";

import React from "react";
import { Search } from "lucide-react";
import contactVideo from "@/assets/images/images/contact.mp4";

type Props = {
  content?: {
    eyebrow?: string;
    heading?: string;
    heading_accent?: string;
    subheading?: string;
    search_placeholder?: string;
    search_label?: string;
    image_url?: string;
    image_alt?: string;
  };
};

export default function FaqHero({ content }: Props) {
  const heading = content?.heading || "Got Questions?";
  const headingAccent = content?.heading_accent || "We've Got Answers";
  const subheading =
    content?.subheading ||
    "Find quick answers to the most common questions about SalonAI. Can't find what you're looking for? Feel free to contact our team.";
  const searchPlaceholder = content?.search_placeholder || "Search for answers...";
  const searchLabel = content?.search_label || "Search";

  return (
    <section className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-salon-bg lg:min-h-[min(560px,100svh)]">
      <video
        src={contactVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center py-20 text-center lg:py-28">
          <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
            {heading}
            <span className="block text-salon-gold-soft">{headingAccent}</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            {subheading}
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-white/40 bg-white/95 p-1.5 pl-5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] backdrop-blur transition focus-within:border-salon-brand focus-within:ring-4 focus-within:ring-white/30"
          >
            <Search className="h-5 w-5 shrink-0 text-salon-muted/70" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full bg-transparent py-2 text-sm text-salon-ink outline-none placeholder:text-salon-muted/60 sm:text-base"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-r from-salon-brand to-salon-brand-dark px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-salon-brand/30 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {searchLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
