"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AtSign,
  Check,
  ChevronDown,
  Globe,
  Link2,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  Play,
  Send,
  Share2,
  User,
} from "lucide-react";
import type { IconName } from "@/lib/content";

const SOCIALS = [Share2, Globe, Link2, AtSign, Play] as const;

const FIELD =
  "w-full rounded-xl border border-salon-card bg-white px-3 py-2.5 text-xs text-salon-ink placeholder:text-salon-muted/60 transition focus:border-salon-brand focus:outline-none focus:ring-2 focus:ring-salon-brand/15";
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
  name_label?: string;
  name_placeholder?: string;
  email_label?: string;
  email_placeholder?: string;
  phone_label?: string;
  phone_placeholder?: string;
  subject_label?: string;
  subject_placeholder?: string;
  message_label?: string;
  message_placeholder?: string;
  /** Enquiry source stored in the admin database. Defaults to "contact". */
  source?: string;
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
  name_label = "Full Name *",
  name_placeholder = "Enter your full name",
  email_label = "Email Address *",
  email_placeholder = "Enter your email",
  phone_label = "Phone Number",
  phone_placeholder = "Enter your phone number",
  subject_label = "Subject *",
  subject_placeholder = "Select a subject",
  message_label = "Message *",
  message_placeholder = "Tell us how we can help you...",
  source = "contact",
}: ContactFormSectionProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!subjectRef.current?.contains(e.target as Node)) setSubjectOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

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
            source,
            website: formData.get("website"),
          }),
        }
      );
      if (res.ok) {
        setStatus("success");
        form.reset();
        setSubject("");
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
    <section className="w-full overflow-hidden bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_-24px_rgba(91,64,39,0.28)] sm:p-8 lg:col-span-7">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-salon-brand to-salon-gold text-white shadow-sm shadow-salon-brand/25">
                <Send className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-display text-3xl leading-tight text-salon-ink sm:text-4xl lg:text-5xl">{heading}</h2>
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
                    <label className={LABEL}>{name_label}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                      <input
                        name="name"
                        required
                        type="text"
                        placeholder={name_placeholder}
                        className={`${FIELD} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL}>{email_label}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                      <input
                        name="email"
                        required
                        type="email"
                        placeholder={email_placeholder}
                        className={`${FIELD} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>{phone_label}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-salon-muted/60" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder={phone_placeholder}
                        className={`${FIELD} pl-9`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={LABEL}>{subject_label}</label>
                    <div ref={subjectRef} className="relative">
                      {/* Kept for form validation + submission; the visible control below is a custom listbox. */}
                      <select
                        name="subject"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <option value="">{subject_placeholder}</option>
                        {(subjects || []).map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => setSubjectOpen((v) => !v)}
                        aria-haspopup="listbox"
                        aria-expanded={subjectOpen}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-salon-card bg-white py-2.5 pl-3 pr-3 text-left text-xs transition focus:border-salon-brand focus:outline-none focus:ring-2 focus:ring-salon-brand/15 ${
                          subject ? "text-salon-ink" : "text-salon-muted/60"
                        }`}
                      >
                        <span className="truncate">{subject || subject_placeholder}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-salon-muted/60 transition-transform duration-300 ${
                            subjectOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {subjectOpen ? (
                        <div
                          className="fixed inset-0 z-20 sm:hidden"
                          onClick={() => setSubjectOpen(false)}
                          aria-hidden="true"
                        />
                      ) : null}

                      <div
                        role="listbox"
                        aria-label={subject_label}
                        className={`absolute left-0 right-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-xl border border-salon-border/60 bg-white shadow-2xl shadow-black/15 transition-all duration-200 ease-out ${
                          subjectOpen
                            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                            : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
                        }`}
                      >
                        <ul className="max-h-56 overflow-y-auto p-1.5">
                          {(subjects || []).map((s, i) => {
                            const active = subject === s;
                            return (
                              <li key={i}>
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={active}
                                  onClick={() => {
                                    setSubject(s);
                                    setSubjectOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                                    active
                                      ? "bg-salon-brand text-white"
                                      : "text-salon-ink hover:bg-salon-chip/80"
                                  }`}
                                >
                                  <span className="truncate">{s}</span>
                                  {active ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={LABEL}>{message_label}</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-salon-muted/60" />
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder={message_placeholder}
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
                    className="rounded-full bg-gradient-to-r from-salon-brand to-salon-brand-dark px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-salon-brand/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : submit_label || "Send Message →"}
                  </button>
                  <div className="flex items-center gap-1 text-[12px] text-salon-muted">
                    <Lock className="h-3 w-3" />
                    <span>{privacy_note}</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-salon-brand-dark via-salon-brand to-salon-deep p-6 text-white shadow-[0_24px_60px_-24px_rgba(91,64,39,0.55)] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-salon-gold/20 blur-2xl"
              />

              <div className="relative space-y-6">
                <h3 className="font-display text-2xl text-white">{details_heading}</h3>

                <div className="space-y-4">
                  {(details || []).map((item, idx) => (
                    <div key={`${item.label}-${idx}`}>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-base leading-relaxed text-white/70">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-6 border-t border-white/20 pt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                  {socials_heading}
                </p>
                <div className="flex items-center gap-2">
                  {SOCIALS.map((Icon, index) => (
                    <span
                      key={index}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white transition hover:bg-white/25"
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
