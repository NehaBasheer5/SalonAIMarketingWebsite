import type { Metadata } from "next";
import ContactFormSection from "@/components/sections/contact/ContactFormSection";
import ContactCtaBanner from "@/components/sections/contact/ContactCtaBanner";
import { getRequestDemoContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a Demo | Avenque SalonAI",
  description: "Request a demo of SalonAI and see how it can transform your salon operations.",
};

export default async function RequestDemoPage() {
  const { content, hidden } = await getRequestDemoContent();
  const hero = content.demo_hero;

  return (
    <main className="min-h-screen bg-salon-bg">
      {!hidden.has("demo_hero") ? (
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:pt-16">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {hero.eyebrow}
              </span>
            </div>
            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
              {hero.heading}{" "}
              {hero.heading_accent ? (
                <span className="block text-salon-accent">{hero.heading_accent}</span>
              ) : null}
            </h1>
            <p className="text-sm leading-relaxed text-salon-muted">{hero.subheading}</p>
          </div>
        </section>
      ) : null}
      {!hidden.has("contact_form") ? (
        <ContactFormSection {...content.contact_form} source="request-demo" />
      ) : null}
      {!hidden.has("cta_banner") ? <ContactCtaBanner {...content.cta_banner} /> : null}
    </main>
  );
}
