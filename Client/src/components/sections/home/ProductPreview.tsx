"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChartColumnIncreasing,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { images } from "@/assets";

const POINTS = [
  {
    icon: CalendarDays,
    title: "Easy Navigation",
    desc: "A clean and intuitive interface for everyone.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    desc: "Stay in sync with bookings, staff and customers.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Advanced Analytics",
    desc: "Track performance and grow with clear insights.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Cloud Based",
    desc: "Your salon data stays protected and accessible.",
  },
] as const;

export default function ProductPreview() {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg">
      <div className="relative min-h-[440px] lg:min-h-[520px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className="relative h-[340px] w-full overflow-hidden sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[58%]"
        >
          <Image
            src={images.salons}
            alt="Modern salon interior"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-salon-bg via-salon-bg/65 to-transparent lg:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 px-5 py-12 sm:px-8 lg:flex lg:min-h-[520px] lg:w-[43%] lg:items-center lg:py-10 lg:pl-[6vw] lg:pr-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a98a65]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
                Platform
              </span>
            </div>

            <h2 className="font-display text-3xl leading-[1.08] tracking-tight text-salon-ink sm:text-4xl lg:text-[2.7rem]">
              A Powerful Platform{" "}
              <span className="block text-[#91663f]">Designed for Salons</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-salon-muted">
              SalonAI brings all your business operations together in one beautiful and
              intelligent platform.
            </p>

            <ul className="mt-6 space-y-3.5">
              {POINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efe2d4] text-[#6f4929]">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-salon-ink">{item.title}</p>
                      <p className="mt-0.5 text-[11px] text-salon-muted">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/request-demo"
              className="mt-6 inline-flex items-center gap-8 rounded-lg bg-[#85592f] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#6f4929]"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
