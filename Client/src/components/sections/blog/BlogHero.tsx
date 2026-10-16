"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import contactVideo from "@/assets/images/images/contact.mp4";
import {
  defaultBlogContent,
  resolveImageUrl,
  type BlogCategoryOption,
  type BlogContent,
} from "@/lib/content";

type Props = {
  content?: BlogContent["hero"];
  /**
   * Filter options resolved on the page from the CMS chip list and the published
   * posts. The blank-value "all" entry is skipped because the dropdown already
   * carries `content.search_label` as its default option.
   */
  categories?: BlogCategoryOption[];
};

/**
 * Blog intro with the search box.
 *
 * The search and category inputs are controlled by the grid below, so this
 * component is rendered by the client wrapper that owns that state.
 */
export default function BlogHero({ content = defaultBlogContent.hero, categories = [] }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const options = categories.filter((option) => option.value);
  const selectedOption = categories.find((option) => option.value === selected);
  const hasCmsMedia = Boolean(resolveImageUrl(content.image_url));

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const choose = (value: string) => {
    setSelected(value);
    setOpen(false);
    const select = document.getElementById("blog-category") as HTMLSelectElement | null;
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  return (
    <section className="relative flex min-h-[560px] w-full items-center bg-salon-bg lg:min-h-[min(560px,100svh)]">
      {hasCmsMedia ? (
        <CmsImage
          value={content.image_url}
          alt={content.image_alt}
          fill
          controls={false}
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
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
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none"
        />
      )}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center lg:py-28">
          <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
            {content.heading}
            {content.heading_accent ? (
              <span className="block text-salon-gold-soft">{content.heading_accent}</span>
            ) : null}
          </h1>

          {content.subheading ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {content.subheading}
            </p>
          ) : null}

          <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row">
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/70" />
              <input
                id="blog-search"
                type="search"
                placeholder={content.search_placeholder}
                className="w-full rounded-2xl border border-white/40 bg-white/95 py-3 pl-10 pr-4 text-sm text-salon-ink shadow-lg backdrop-blur placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none"
              />
            </div>

            <div ref={wrapperRef} className="relative w-full sm:w-1/3">
              {/* Keep the native select so BlogCategories' event wiring still works. */}
              <select
                id="blog-category"
                defaultValue=""
                aria-label={content.search_label}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              >
                <option value="">{content.search_label}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/40 bg-white/95 px-4 py-3 text-left text-sm font-medium text-salon-ink shadow-lg backdrop-blur transition hover:border-salon-gold-soft hover:shadow-xl focus:border-salon-brand focus:outline-none focus:ring-2 focus:ring-salon-gold/40"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={`truncate ${selectedOption ? "text-salon-ink" : "text-salon-muted/70"}`}>
                    {selectedOption?.label ?? content.search_label}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-salon-muted/70 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {/* Backdrop that closes the panel on outside click / mobile scroll. */}
              {open ? (
                <div
                  className="fixed inset-0 z-20 sm:hidden"
                  onClick={() => setOpen(false)}
                  aria-hidden="true"
                />
              ) : null}

              <div
                role="listbox"
                aria-label={content.search_label}
                className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-2xl border border-salon-border/60 bg-white/95 shadow-2xl shadow-black/15 backdrop-blur-xl transition-all duration-200 ease-out ${
                  open
                    ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
                }`}
              >
                <ul className="max-h-64 overflow-y-auto p-1.5">
                  {options.map((option) => {
                    const active = selected === option.value;

                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => choose(option.value)}
                          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            active
                              ? "bg-salon-brand text-white"
                              : "text-salon-ink hover:bg-salon-chip/80"
                          }`}
                        >
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">{option.label}</span>
                          </span>

                          {active ? <Check className="h-4 w-4 shrink-0 text-white" /> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {selected ? (
                  <div className="border-t border-salon-border/50 p-1.5">
                    <button
                      type="button"
                      onClick={() => choose("")}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-salon-muted transition hover:bg-salon-chip/80 hover:text-salon-ink"
                    >
                      Clear filter
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
