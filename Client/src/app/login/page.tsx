import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Avenque SalonAI",
  description: "Sign in to your SalonAI account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex max-w-md flex-col gap-6 px-6 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Login</h1>
        <p className="text-sm text-slate-600">
          Product login will connect here once SalonAI authentication is wired up.
          For now, contact us to get access.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="rounded-lg bg-[#0D1140] px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Contact Us
          </Link>
          <Link
            href="/request-demo"
            className="rounded-lg border border-[#0D1140] px-6 py-3 text-sm font-semibold text-[#0D1140] hover:bg-slate-50"
          >
            Book a Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
