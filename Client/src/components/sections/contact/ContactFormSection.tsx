"use client";

import React from "react";
import {
  AtSign,
  ChevronDown,
  Globe,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Send,
  Share2,
  User,
} from "lucide-react";

const SOCIALS = [Share2, Globe, Link2, AtSign, Play] as const;

const DETAILS = [
  { icon: Mail, label: "Email Us", value: "hello@avenque.com" },
  { icon: Phone, label: "Call Us", value: "+94 11 234 5678" },
  { icon: MapPin, label: "Visit Our Office", value: "No. 123, Innovation Drive, Colombo 00500" },
] as const;

const FIELD =
  "w-full rounded-xl border border-salon-card bg-white px-3 py-2.5 text-xs text-salon-ink placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none";
const LABEL = "mb-1 block text-xs font-semibold text-salon-ink";

export default function ContactFormSection() {
  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                <Send className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-display text-2xl leading-tight text-salon-ink">
                  Send Us a Message
                </h2>
                <p className="mt-1 text-xs text-salon-muted">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                    <input type="text" placeholder="Enter your full name" className={`${FIELD} pl-9`} />
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                    <input type="email" placeholder="Enter your email" className={`${FIELD} pl-9`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                    <input type="tel" placeholder="Enter your phone number" className={`${FIELD} pl-9`} />
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Subject *</label>
                  <div className="relative">
                    <select className={`${FIELD} appearance-none pr-9`}>
                      <option value="">Select a subject</option>
                      <option value="sales">Sales &amp; Pricing</option>
                      <option value="support">Technical Support</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                  </div>
                </div>
              </div>

              <div>
                <label className={LABEL}>Message *</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-salon-muted/60" />
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    className={`${FIELD} resize-none pl-9`}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="rounded-lg bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark"
                >
                  Send Message &rarr;
                </button>
                <div className="flex items-center gap-1 text-[10px] text-salon-muted">
                  <Lock className="h-3 w-3" />
                  <span>Your information is safe with us.</span>
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-salon-card bg-salon-shell-soft p-6 sm:p-8 lg:col-span-5">
            <div className="space-y-6">
              <h3 className="font-display text-2xl text-salon-ink">Contact Information</h3>

              <div className="space-y-4">
                {DETAILS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-salon-ink">{item.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-salon-muted">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-salon-card pt-6">
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {SOCIALS.map((Icon, index) => (
                  <span
                    key={index}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-salon-card bg-white text-salon-brand-dark transition hover:bg-salon-tile"
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
