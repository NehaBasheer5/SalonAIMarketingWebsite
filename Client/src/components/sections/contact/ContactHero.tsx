"use client";

import React from "react";
import { Clock, Mail, Phone } from "lucide-react";

const CONTACTS = [
  { icon: Mail, label: "Email Us", value: "hello@avenque.com" },
  { icon: Phone, label: "Call Us", value: "+94 11 234 5678" },
  { icon: Clock, label: "Working Hours", value: "Mon - Fri: 9:00 AM - 6:00 PM" },
] as const;

export default function ContactHero() {
  return (
    <section className="relative w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                Get in Touch
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.06] tracking-tight text-salon-ink sm:text-6xl">
              Let&apos;s Build a Better
              <span className="block text-salon-accent">Salon Business Together</span>
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-salon-muted">
              Have a question, need support, or want to learn more about SalonAI? We&apos;re here to
              help. Reach out to us and our team will get back to you as soon as possible.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {CONTACTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-salon-card bg-white/80 p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-salon-muted">{item.label}</p>
                      <p className="truncate text-xs font-semibold text-salon-ink">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md rounded-3xl bg-salon-tile/60 p-6">
              <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-salon-shell text-xs text-salon-brand-dark">
                [ Support Rep Hero Image ]
              </div>
              <div className="absolute -top-3 left-2 rounded-2xl border border-salon-card bg-white px-4 py-2 shadow-lg">
                <p className="font-display text-sm leading-tight text-salon-brand">
                  We&apos;re here to help!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
