"use client";

import React, { useState } from "react";
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
import type { IconName } from "@/lib/content";
import CmsIcon from "@/components/ui/CmsIcon";

const ICONS: Record<IconName, any> = {
  Mail,
  Phone,
  MapPin,
} as const;

const SOCIALS = [Share2, Globe, Link2, AtSign, Play] as const;

const FIELD =
  "w-full rounded-xl border border-salon-card bg-white px-3 py-2.5 text-xs text-salon-ink placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none";
const LABEL = "mb-1 block text-xs font-semibold text-salon-ink";

export type ContactFormSectionProps = {
  heading: string;
  subheading: string;
  submit_label: string;
  success_message: string;
  privacy_note: string;
  details_heading: string;
  socials_heading: string;
  details: { icon: IconName; label: string; value: string }[];
  subjects: string[];
};

export default function ContactFormSection({
  heading,
  subheading,
  submit_label,
  success_message,
  privacy_note,
  details_heading,
  socials_heading,
  details,
  subjects,
}: ContactFormSectionProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}/api/public/enquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            source: "contact",
            website: formData.get("website"),
          }),
        }
      );
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not send your message. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Could not send your message. Please try again.");
      setStatus("error");
    }
  }

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
                <h2 className="font-display text-2xl leading-tight text-salon-ink">{heading}</h2>
                <p className="mt-1 text-xs text-salon-muted">{subheading}</p>
              </div>
            </div>

            {status === "success" ? (
              <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success_message}
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="hidden">
                  <label>
                    Website
                    <input type="text" name="website" autoComplete="off" tabIndex={-1} />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                      <input
                        name="name"
                        required
                        type="text"
                        placeholder="Enter your full name"
                        className={`${FIELD} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL}>Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                      <input
                        name="email"
                        required
                        type="email"
                        placeholder="Enter your email"
                        className={`${FIELD} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className={`${FIELD} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL}>Subject *</label>
                    <div className="relative">
                      <select name="subject" required className={`${FIELD} appearance-none pr-9`}>
                        <option value="">Select a subject</option>
                        {(subjects || []).map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
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
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us how we can help you..."
                      className={`${FIELD} resize-none pl-9`}
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-xs text-red-600">{error}</p>
                ) : null}

                <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="rounded-lg bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : submit_label || "Send Message →"}
                  </button>
                  <div className="flex items-center gap-1 text-[10px] text-salon-muted">
                    <Lock className="h-3 w-3" />
                    <span>{privacy_note}</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-salon-card bg-salon-shell-soft p-6 sm:p-8 lg:col-span-5">
            <div className="space-y-6">
              <h3 className="font-display text-2xl text-salon-ink">{details_heading}</h3>

              <div className="space-y-4">
                {(details || []).map((item, idx) => (
                  <div key={`${item.label}-${idx}`} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
                      <CmsIcon name={item.icon} className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-salon-ink">{item.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-salon-muted">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-salon-card pt-6">
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                {socials_heading}
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
