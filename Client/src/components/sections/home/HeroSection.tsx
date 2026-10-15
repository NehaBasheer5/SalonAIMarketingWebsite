"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultHomeContent, type HomeContent } from "@/lib/content";

type Props = {
  content?: HomeContent["hero"];
};

export default function HeroSection({ content = defaultHomeContent.hero }: Props) {
  const highlights = content.highlights ?? [];
  const loop = highlights.length ? [...highlights, ...highlights, ...highlights, ...highlights] : [];
  const marqueeItems = [...loop, ...loop];

  // Bumping this key remounts the media and the copy, so the video and the
  // timed intro replay on every load — including browser back/forward restores.
  const [replayKey, setReplayKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const wasVisible = useRef(true);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setReplayKey((key) => key + 1);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // The hero intro (video + copy) only plays while the hero is on screen. When
  // the hero scrolls out the video pauses; when it returns, the whole intro
  // replays together so the video and text never fall out of sync.
  useEffect(() => {
    const host = sectionRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!wasVisible.current) setReplayKey((key) => key + 1);
          wasVisible.current = true;
        } else {
          wasVisible.current = false;
          host.querySelector("video")?.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-salon-bg"
    >
      {/* The uploaded image or video fills the full hero background. */}
      <motion.div
        key={`media-${replayKey}`}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <motion.div
          initial={false}
          animate={{ x: [0, 28, 0] }}
          transition={{ delay: 6.62, duration: 1.2, ease: "easeInOut" }}
          className="absolute -inset-x-8 inset-y-0"
        >
          <CmsImage
            value={content.image_url}
            alt={content.image_alt}
            fill
            priority
            controls={false}
            loop={false}
            className="h-full w-full object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center justify-items-start px-5 pb-10 pt-24 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24 lg:pt-28">
        {/* Copy overlays the full-bleed hero background. */}
        <div className="flex flex-col items-start justify-center text-left">
          <motion.div
            key={`copy-${replayKey}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 9 }}
            className="-mt-3 w-full max-w-2xl"
          >
            <h1 className="font-hero text-4xl font-bold leading-[1.08] tracking-tight text-salon-ink [text-shadow:0_1px_2px_rgba(252,250,247,0.95),0_2px_14px_rgba(252,250,247,0.85)] md:text-[44px] lg:text-[56px] desktop:text-[64px]">
              {content.heading}
              {content.heading_accent ? (
                <span className="block text-salon-gold">{content.heading_accent}</span>
              ) : null}
            </h1>
          </motion.div>

          {content.subheading ? (
            <motion.p
              key={`sub-${replayKey}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 9 }}
               className="mt-4 max-w-xl font-sans text-[19px] font-normal leading-relaxed text-black [text-shadow:0_1px_2px_rgba(252,250,247,0.95),0_1px_10px_rgba(252,250,247,0.85)]"
            >
              {content.subheading}
            </motion.p>
          ) : null}

          {(content.cta_label || content.secondary_cta_label) && (
            <motion.div
              key={`cta-${replayKey}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 9 }}
              className="mt-7 flex flex-wrap items-center justify-start gap-3"
            >
              {content.cta_label ? (
                <Link
                  href={content.cta_href || "/request-demo"}
                  className="inline-flex items-center gap-2 rounded-lg bg-salon-ink px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black"
                >
                  {content.cta_label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}

              {content.secondary_cta_label ? (
                <Link
                  href={content.secondary_cta_href || "#"}
                  className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-salon-ink transition hover:text-salon-gold"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-salon-border bg-white shadow-sm">
                    <Play className="h-3.5 w-3.5 fill-salon-ink" />
                  </span>
                  <span className="text-left leading-tight">
                    {content.secondary_cta_label}
                    {content.secondary_cta_sub ? (
                      <span className="block text-xs font-medium text-salon-muted">
                        {content.secondary_cta_sub}
                      </span>
                    ) : null}
                  </span>
                </Link>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {/* Highlights scroll right-to-left as a single line along the base of the hero. */}
      {marqueeItems.length ? (
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
          <div className="flex overflow-hidden py-5">
            <div className="animate-marquee flex shrink-0 items-center">
              {marqueeItems.map((item, index) => (
                <span key={`${item.title}-${index}`} className="flex items-center whitespace-nowrap px-6 text-sm">
                  <span className="font-semibold text-salon-ink">{item.title}</span>
                  <span className="ml-3 text-salon-muted">{item.desc}</span>
                  <span className="ml-6 h-1.5 w-1.5 rounded-full bg-salon-gold" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
