"use client";

import React from "react";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="bg-white py-12 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
              Building Intelligent <br />
              Solutions for <span className="text-[#8B5E34]">Modern <br />Salons</span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
              SalonAI is more than just software — it&apos;s our commitment to empower salon and beauty businesses with AI-powered tools that simplify operations, delight customers, and drive growth.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button className="rounded-xl bg-black px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm">
                Book a Demo
              </button>
              <button className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors">
                Our Story
              </button>
            </div>
          </div>

          {/* Right Side: Phone Mockup Image */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center">
              <Image
                src="assets/images/about-hero.png"
                alt="about-hero"
                width={600}
                height={450}
                className="w-full h-auto object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}