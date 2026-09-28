"use client";

import React from "react";
import { Mail, Phone, Clock } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Get in Touch
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Let’s Build a Better <br className="hidden sm:inline" />
              Salon Business <span className="text-blue-900">Together</span>
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500">
              Have a question, need support, or want to learn more about SalonAI? We're here to help. Reach out to us and our team will get back to you as soon as possible.
            </p>

            {/* 3 Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">Email Us</p>
                  <p className="text-xs font-semibold text-slate-800">hello@avenque.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">Call Us</p>
                  <p className="text-xs font-semibold text-slate-800">+94 11 234 5678</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400">Working Hours</p>
                  <p className="text-[10px] font-semibold text-slate-800">Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-blue-50/60 p-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-200 flex items-center justify-center text-xs text-slate-400">
                [ Support Rep Hero Image ]
              </div>
              <div className="absolute -top-3 left-2 rounded-2xl bg-white px-4 py-2 shadow-lg border border-slate-100">
                <p className="text-[10px] font-bold text-blue-950">We're here</p>
                <p className="text-[10px] font-bold text-blue-950">to help!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}