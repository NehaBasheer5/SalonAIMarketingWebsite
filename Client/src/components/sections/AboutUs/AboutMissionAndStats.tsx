"use client";

import React from "react";

const stats = [
  { value: "10,000+", label: "Salons Worldwide" },
  { value: "500K+", label: "Happy Customers" },
  { value: "1M+", label: "Appointments Managed" },
  { value: "95%", label: "Customer Satisfaction" },
  { value: "24/7", label: "Customer Support" },
];

export default function AboutMissionAndStats() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Mission, Vision &amp; Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            We are driven by a purpose to transform the beauty and wellness industry through innovation and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm flex flex-col justify-center space-y-3 min-h-[200px]">
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              To simplify salon management and empower businesses with AI-driven tools that enhance productivity, improve customer experience, and drive growth.
            </p>
          </div>

          <div className="rounded-2xl bg-[#8B5E34] p-8 text-center text-white shadow-md flex flex-col justify-center space-y-3 min-h-[200px]">
            <h3 className="text-lg font-bold text-white">Our Vision</h3>
            <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed max-w-md mx-auto">
              To be the leading intelligent salon management platform, powering every salon to achieve excellence and scale effortlessly.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#8B5E34] py-10 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-amber-100/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}