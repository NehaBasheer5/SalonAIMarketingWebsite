"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { images } from "@/assets";

const AppStoreBadge = () => (
  <a
    href="#"
    aria-label="Download on the App Store"
    className="inline-flex h-11 min-w-[132px] items-center gap-2.5 rounded-[7px] bg-black px-3 text-white transition hover:bg-[#171717]"
  >
    <svg className="h-6 w-6 shrink-0 fill-current" viewBox="0 0 384 512" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-92.1zM260.6 85.2c16.3-20.2 27.6-48.5 24.3-77.2-24.3 1-54.1 16.3-71.5 36.7-15.3 17.6-28.7 46.4-24.8 74.4 27.2 2.1 55.4-13.7 72-33.9z" />
    </svg>
    <div className="flex flex-col text-left leading-none">
      <span className="text-[9px] font-normal text-white">Download on the</span>
      <span className="mt-0.5 text-[15px] font-medium tracking-tight">App Store</span>
    </div>
  </a>
);

const GooglePlayBadge = () => (
  <a
    href="#"
    aria-label="Get it on Google Play"
    className="inline-flex h-11 min-w-[142px] items-center gap-2.5 rounded-[7px] bg-black px-3 text-white transition hover:bg-[#171717]"
  >
    <svg className="h-6 w-6 shrink-0" viewBox="0 0 512 512" aria-hidden>
      <path fill="#00d7fe" d="M35.6 26.4c-6.1 7.3-9.6 17.7-9.6 30.9v397.4c0 13.2 3.5 23.6 9.6 30.9L39 489l222.6-230.5v-5L39 23z" />
      <path fill="#ffce00" d="m335.8 335.3-74.2-76.8v-5l74.3-76.9 3.5 2 88 50c25.1 14.3 25.1 37.6 0 51.9l-88 50z" />
      <path fill="#ff3a44" d="m339.4 330.6-77.8-80.6L35.6 485.6c9.6 11.4 25.4 12.8 43.2 2.7z" />
      <path fill="#00f076" d="M339.4 178.6 78.8 30.7C61 20.6 45.2 22 35.6 33.4L261.6 269z" />
    </svg>
    <div className="flex flex-col text-left leading-none">
      <span className="text-[9px] uppercase tracking-wide text-white">Get it on</span>
      <span className="mt-0.5 text-[15px] font-medium tracking-tight">Google Play</span>
    </div>
  </a>
);

export default function MobileAppShowcase() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg">
      <div className="relative min-h-[440px] lg:min-h-[520px]">
        <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[54%]">
          <Image
            src={images.apps2}
            alt="SalonAI mobile apps for owners and customers"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 54vw"
          />
          <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-salon-bg via-salon-bg/55 to-transparent lg:block" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 px-5 py-12 sm:px-8 lg:flex lg:min-h-[520px] lg:w-[47%] lg:items-center lg:py-10 lg:pl-[6vw] lg:pr-8"
        >
          <div className="w-full max-w-md">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-12 bg-[#a98a65]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
                Mobile App
              </span>
            </div>

            <h2 className="font-display text-4xl leading-[1.02] tracking-tight text-salon-ink sm:text-5xl lg:text-[3rem]">
              On the Go,
              <span className="block text-[#91663f]">Always in Control</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-salon-muted">
              Manage your salon anytime, anywhere with our beautiful mobile apps for you and your
              customers.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
