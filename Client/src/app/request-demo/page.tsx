import type { Metadata } from "next";
import ContactFormSection from "@/components/sections/contact/ContactFormSection";
import ContactCtaBanner from "@/components/sections/contact/ContactCtaBanner";

export const metadata: Metadata = {
  title: "Book a Demo | Avenque SalonAI",
  description: "Request a demo of SalonAI and see how it can transform your salon operations.",
};

export default function RequestDemoPage() {
  return (
    <main className="min-h-screen bg-salon-bg">
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:pt-16">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              Book a Demo
            </span>
          </div>
          <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
            See SalonAI <span className="block text-salon-accent">in Action</span>
          </h1>
          <p className="text-sm leading-relaxed text-salon-muted">
            Tell us a bit about your salon and we&apos;ll schedule a personalized walkthrough.
          </p>
        </div>
      </section>
      <ContactFormSection />
      <ContactCtaBanner />
    </main>
  );
}
