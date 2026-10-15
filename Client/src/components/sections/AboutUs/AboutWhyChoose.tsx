import React from "react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultAboutContent, fallbackImages, type AboutContent } from "@/lib/content";

type Props = {
  content?: AboutContent["why_choose"];
};

export default function AboutWhyChoose({
  content = defaultAboutContent.why_choose,
}: Props) {
  if (!content.features.length) return null;

  return (
    <section className="w-full bg-salon-bg py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: title, explanation and features */}
          <div className="text-left">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
              {content.heading}{" "}
              <span className="italic text-black">{content.heading_accent}</span>
            </h2>
            {content.subheading ? (
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-salon-muted">
                {content.subheading}
              </p>
            ) : null}

            <div className="mt-10 space-y-4">
              {content.features.map((feature, index) => (
                <div key={feature.title} className="group relative pb-4">
                  {index !== content.features.length - 1 ? (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-salon-card" />
                  ) : null}
                  <span className="absolute inset-x-0 bottom-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-salon-brand to-salon-gold transition-all duration-500 ease-out group-hover:w-full" />

                  <div className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                    <h3 className="text-base font-semibold text-salon-ink transition-colors duration-300 group-hover:text-salon-brand">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-lg leading-relaxed text-salon-muted transition-colors duration-300 group-hover:text-salon-ink/80">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <CmsImage
              value={content.image_url}
              fallback={fallbackImages.about_why}
              alt="SalonAI platform"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
