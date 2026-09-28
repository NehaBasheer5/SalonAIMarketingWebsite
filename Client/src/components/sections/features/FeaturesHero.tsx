"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Cpu, ShieldCheck, Cloud } from "lucide-react";
import { images } from "@/assets";

export default function FeaturesHero() {
  return (
    <section className="bg-white pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column Text */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
              Everything You Need to Run Your Salon, <span className="text-blue-900">All in One Place</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              SalonAI comes with all the tools you need to manage your salon efficiently, delight your clients, and grow your business faster than ever.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/request-demo"
                className="rounded-xl bg-blue-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-800"
              >
                Book a Demo
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
              >
                Our Story
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-slate-700" />
                <span className="text-xs font-semibold text-slate-800">Easy to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-slate-700" />
                <span className="text-xs font-semibold text-slate-800">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
                <span className="text-xs font-semibold text-slate-800">Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-slate-700" />
                <span className="text-xs font-semibold text-slate-800">Cloud Based</span>
              </div>
            </div>
          </div>

          {/* Right Column Visual Graphic */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-xl">
              <Image
                src={images.dashboardFeatures}
                alt="SalonAI Dashboard Interface"
                width={700}
                height={450}
                className="w-full rounded-lg object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}