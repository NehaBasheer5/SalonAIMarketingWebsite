"use client";

import React from "react";
import Image from "next/image";
import { Clock, Globe, Shield, Zap, Smile, RefreshCw } from "lucide-react";
import { images } from "@/assets";

const benefits = [
  { icon: Clock, title: "Save Time", desc: "Automate tasks and focus on what matters most." },
  { icon: Globe, title: "Work from Anywhere", desc: "Access your salon data anytime, anywhere, on any device." },
  { icon: Shield, title: "Increase Revenue", desc: "Boost sales with smart insights and customer retention." },
  { icon: Zap, title: "Scalable Solution", desc: "From single salons to large enterprises, we grow with you." },
  { icon: Smile, title: "Delight Customers", desc: "Provide exceptional service and experience every time." },
  { icon: RefreshCw, title: "Always Improving", desc: "We listen, we innovate and bring new features regularly." },
];

export default function PlatformShowcase() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Laptop and Mobile Graphic */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src={images.dashboardMockup}
                alt="SalonAI Laptop and Mobile App Interface"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Core Values / Features */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
              A Powerful Platform Designed for <span className="text-blue-900">Your Success</span>
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              SalonAI is more than just software. It’s a complete management solution that helps you save time, improve customer experience and grow your salon.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}