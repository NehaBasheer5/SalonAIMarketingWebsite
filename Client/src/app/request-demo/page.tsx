import type { Metadata } from "next";
import ContactFormSection from "@/components/sections/contact/ContactFormSection";
import ContactCtaBanner from "@/components/sections/contact/ContactCtaBanner";

export const metadata: Metadata = {
  title: "Book a Demo | Avenque SalonAI",
  description: "Request a demo of SalonAI and see how it can transform your salon operations.",
};

export default function RequestDemoPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-4">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Book a Demo
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            See SalonAI in action
          </h1>
          <p className="text-sm text-slate-600">
            Tell us a bit about your salon and we&apos;ll schedule a personalized walkthrough.
          </p>
        </div>
      </section>
      <ContactFormSection />
      <ContactCtaBanner />
    </main>
  );
}
