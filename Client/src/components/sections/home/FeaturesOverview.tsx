"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Cpu,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Booking Management",
    description: "Manage appointments, schedule and walk-ins effortlessly.",
  },
  {
    icon: UsersRound,
    title: "Staff Management",
    description: "Organize staff, roles, commissions and performance.",
  },
  {
    icon: UserRoundCog,
    title: "Customer Management",
    description: "Keep customer profiles, history, notes and preferences.",
  },
  {
    icon: Cpu,
    title: "AI Features",
    description: "Manage appointments with AI-powered workflows effortlessly.",
  },
] as const;

export default function FeaturesOverview() {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-6 grid items-end gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a98a65]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
                Features
              </span>
            </div>
            <h2 className="font-display text-3xl leading-[1.03] tracking-tight text-salon-ink sm:text-4xl lg:text-[2.7rem]">
              Everything You Need to
              <span className="block italic text-[#91663f]">Run Your Salon Smarter</span>
            </h2>
          </div>

          <div className="flex flex-col gap-5 pb-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-xs leading-relaxed text-salon-muted">
              Powerful tools to manage your salon, save time and deliver a better experience —
              all in one place.
            </p>
            <Link
              href="/features"
              className="inline-flex w-fit shrink-0 items-center gap-5 rounded-full border border-[#d9caba] bg-white/70 py-1.5 pl-5 pr-1.5 text-xs font-semibold text-[#60472f] transition hover:bg-white"
            >
              See more
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#85592f] text-white">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl border border-white/90 bg-white/80 p-5 shadow-[0_8px_30px_rgba(91,64,39,0.05)] backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe2d4] text-[#6f4929]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <h3 className="mt-3 text-base font-bold text-salon-ink">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-salon-muted">
                  {feature.description}
                </p>

                <div className="mt-auto flex items-end justify-between pt-5">
                  <Link
                    href="/features"
                    aria-label={`Learn more about ${feature.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#85592f] text-white transition group-hover:translate-x-1"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="font-display text-3xl font-light text-[#cdbda9]/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="pointer-events-none absolute -bottom-14 -right-12 h-28 w-40 rotate-[-18deg] rounded-[50%] border border-[#dbcdbd]/35" />
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-px w-9 bg-[#a98a65]" />
          <span className="text-[8px] font-medium uppercase tracking-[0.24em] text-[#8a725d]">
            Beauty Meets Technology
          </span>
        </div>
      </div>
    </section>
  );
}
