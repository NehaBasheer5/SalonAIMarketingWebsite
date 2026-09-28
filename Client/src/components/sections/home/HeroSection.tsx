"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Play,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { images } from "@/assets";

const highlights = [
  {
    icon: CalendarDays,
    title: "Easy Booking",
    desc: "24/7 online appointments.",
  },
  {
    icon: Users,
    title: "Manage Staff",
    desc: "Save time, work smarter.",
  },
  {
    icon: Sparkles,
    title: "Grow Revenue",
    desc: "Insights & reports.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    desc: "Your data is safe.",
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[680px] w-full overflow-hidden bg-salon-bg lg:h-[min(760px,100svh)]">
      {/* On desktop the photo starts at the navbar and fills the right half. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
        className="relative mt-20 h-[52vh] min-h-[380px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-[52%]"
      >
        <Image
          src={images.heroImg}
          alt="SalonAI mobile app mockups in a modern salon"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 52vw"
        />
        <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-salon-bg to-transparent lg:block" />
        <p className="absolute right-[7%] top-[13%] hidden rotate-[-8deg] font-display text-2xl italic leading-tight text-salon-ink/80 xl:block">
          More Beauty
          <br />
          Happier People
          <span className="mt-1 block text-center text-3xl font-normal">♡</span>
        </p>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex py-12 lg:min-h-[590px] lg:w-[47%] lg:items-center lg:pb-32 lg:pt-24"
        >
          <div className="w-full max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#f1e9df] px-3 py-2 text-[11px] font-semibold text-[#2d2925] shadow-[inset_0_0_0_1px_rgba(166,139,103,0.08)]">
              <Scissors className="h-3.5 w-3.5 text-[#9b7a53]" strokeWidth={1.8} />
              <span>All-in-One Salon Management App</span>
            </div>

            <h1 className="mt-6 font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl lg:text-[4rem]">
              Empower Your{" "}
              <span className="block text-salon-gold">Salon Business</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-salon-muted sm:text-[1.05rem]">
              Simplify bookings, manage staff, delight your customers and grow your salon with
              SalonAI — built for modern beauty businesses.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/request-demo"
                className="inline-flex items-center gap-2 rounded-lg bg-salon-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#watch-video"
                className="inline-flex items-center gap-3 text-sm font-semibold text-salon-ink transition hover:text-salon-gold"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-salon-border bg-white shadow-sm">
                  <Play className="h-4 w-4 fill-salon-ink" />
                </span>
                <span className="leading-tight">
                  Watch Video
                  <span className="block text-xs font-medium text-salon-muted">See how it works</span>
                </span>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-salon-border/80 pt-8 sm:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.title} className="min-w-0 text-center">
                  <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#f1e9de] text-salon-ink">
                    <item.icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <p className="text-xs font-semibold text-salon-ink">{item.title}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-salon-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
