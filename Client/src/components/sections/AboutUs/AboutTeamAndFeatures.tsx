"use client";

import React from "react";

const features = [
  { title: "Easy to Use", desc: "Simple, intuitive and built for salons of all sizes." },
  { title: "AI-Powered", desc: "Smart insights and automation to save time and grow faster." },
  { title: "Secure & Reliable", desc: "Enterprise-grade security to keep your data safe and protected." },
  { title: "Scalable", desc: "From single salons to multi-branch enterprises." },
  { title: "Always Improving", desc: "We listen, we innovate and we continuously make things better." },
];

export default function AboutTeamAndFeatures() {
  return (
    <section className="bg-white pt-12 pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            The Team Behind <br />SalonAI
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            We are a passionate team of innovators, designers, engineers, and dreamers working together to build technology that makes a real impact.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center justify-center">
          {[...Array(5)].map((_, i) => {
            const isCenter = i === 2;
            return (
              <div
                key={i}
                className={`flex flex-col items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 transition-all ${
                  isCenter ? "h-72 shadow-md bg-slate-200/60" : "h-56"
                }`}
              >
                {isCenter && (
                  <div className="mt-auto pb-4 text-center">
                    <p className="text-xs font-bold text-slate-900">Alex Johnson</p>
                    <p className="text-[10px] text-slate-500">Lead Software Engineer</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#8B5E34] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-10">
            Why Salons Choose SalonAI
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {features.map((feat, index) => (
              <div key={index} className="space-y-2 px-2">
                <h3 className="text-sm font-bold text-amber-50">{feat.title}</h3>
                <p className="text-[11px] text-amber-100/75 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}