"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChartColumnIncreasing,
  Scissors,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { images } from "@/assets";

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Easy Setup",
    desc: "Get started in minutes.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    desc: "Real help when you need it.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Grow Faster",
    desc: "Insights that drive bookings.",
  },
] as const;

export default function CtaBanner() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-9 bg-[#a98a65]" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
              Get Started
            </span>
          </div>

          <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-salon-ink sm:text-4xl lg:text-[2.8rem]">
            Ready to Transform{" "}
            <span className="text-[#91663f]">Your Salon Business?</span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-salon-muted">
            Join 10,000+ salon owners who are saving time, increasing bookings and growing their
            business with SalonAI.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe2d4] text-[#6f4929]">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-salon-ink">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-salon-muted">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-2 rounded-lg bg-[#85592f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6f4929]"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg border border-[#85592f] px-6 py-3 text-sm font-semibold text-[#85592f] transition hover:bg-[#efe2d4]/50"
            >
              Contact Sales
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
              ].map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-salon-bg object-cover"
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex text-[#91663f]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-salon-muted">
                Trusted by 10,000+ salon owners worldwide
              </span>
            </div>
          </div>
        </motion.div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl lg:max-w-none">
            <Image
              src={images.contact}
              alt="Salon professional at work"
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
              priority
            />

            {/* Floating stats inspired by the screenshot */}
            <div className="absolute left-4 top-6 hidden w-44 rounded-xl bg-white/95 p-3 shadow-lg sm:block">
              <div className="mb-1 flex items-center gap-2 text-[#85592f]">
                <CalendarDays className="h-4 w-4" />
                <span className="text-[10px] font-semibold text-salon-muted">Bookings This Month</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-display text-2xl font-semibold text-salon-ink">1,248</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  +12.5%
                </span>
              </div>
            </div>

            <div className="absolute bottom-6 left-4 right-4 rounded-xl bg-[#f5efe7]/95 p-4 shadow-lg backdrop-blur-sm sm:left-auto sm:right-4 sm:w-56">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#85592f] text-white">
                  <Scissors className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-salon-ink">More Time For What You Love</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-salon-muted">
                    Spend less time on admin and more time with your clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
