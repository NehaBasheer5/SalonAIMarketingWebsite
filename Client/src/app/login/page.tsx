import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Avenque SalonAI",
  description: "Sign in to your SalonAI account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-salon-bg">
      <section className="mx-auto flex max-w-md flex-col items-center gap-5 px-6 py-24 text-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-salon-rule" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
            Login
          </span>
          <span className="h-px w-8 bg-salon-rule" />
        </div>

        <h1 className="font-display text-4xl tracking-tight text-salon-ink sm:text-5xl">
          Welcome <span className="text-salon-accent">Back</span>
        </h1>
        <p className="text-sm leading-relaxed text-salon-muted">
          Product login will connect here once SalonAI authentication is wired up. For now, contact
          us to get access.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="rounded-lg bg-salon-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-salon-brand-dark"
          >
            Contact Us
          </Link>
          <Link
            href="/request-demo"
            className="rounded-lg border border-salon-brand px-6 py-3 text-sm font-semibold text-salon-brand transition hover:bg-salon-tile/40"
          >
            Book a Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
