import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Avenque SalonAI",
  description:
    "Learn about Avenque SalonAI — the AI-powered platform helping salons manage bookings, staff, and growth.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            About Avenque
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Built for modern salon businesses
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            SalonAI by Avenque helps salon owners streamline bookings, staff scheduling,
            customer relationships, and day-to-day operations from one intelligent platform.
          </p>
          <p className="text-base leading-relaxed text-slate-600">
            Our mission is simple: give every salon the tools to save time, delight clients,
            and grow with confidence — whether you run a single location or a multi-branch brand.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/request-demo"
              className="rounded-lg bg-[#0D1140] px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Book a Demo
            </Link>
            <Link
              href="/features"
              className="rounded-lg border border-[#0D1140] px-6 py-3 text-sm font-semibold text-[#0D1140] hover:bg-slate-50"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
