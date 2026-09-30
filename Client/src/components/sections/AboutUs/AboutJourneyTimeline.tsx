"use client";

import React from "react";
import { Sparkles, Rocket, BarChart2, Globe, Star } from "lucide-react";

const milestones = [
  { icon: Sparkles, title: "The Beginning", desc: "SalonAI was founded with a vision to modernize salon operations with technology and innovation." },
  { icon: Rocket, title: "Early Growth", desc: "We launched our platform and onboarded our first 1,000+ salons, improving bookings and operations." },
  { icon: BarChart2, title: "Expanding Features", desc: "AI features, analytics, loyalty programs, and mobile apps were introduced to empower salons even more." },
  { icon: Globe, title: "Global Reach", desc: "We reached 10,000+ salons worldwide and continue to grow our global community every day." },
  { icon: Star, title: "What's Next", desc: "We're building the future of salon management with smarter AI, more integrations, and limitless possibilities." },
];

export default function AboutJourneyTimeline() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-16">
          Our Journey
        </h2>

        <div className="relative">
          <div className="hidden md:block absolute top-7 left-[8%] right-[8%] h-0.5 bg-[#8B5E34]/30 -z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
            {milestones.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8B5E34] text-white shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 pt-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}