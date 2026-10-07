"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { Check, Mail } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import { defaultBlogContent, type BlogContent, type BlogPost } from "@/lib/content";

type Props = {
  newsletter?: BlogContent["newsletter"];
  popular?: BlogContent["popular"];
  popularPosts: BlogPost[];
};

export default function BlogNewsletterAndPopular({
  newsletter = defaultBlogContent.newsletter,
  popular = defaultBlogContent.popular,
  popularPosts,
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  /**
   * Subscriptions go through the same public enquiry endpoint as the contact
   * form, tagged `newsletter`, so they land in the admin Enquiries list rather
   * than being dropped on the floor.
   */
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const res = await fetch(`${adminOrigin()}/api/public/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Please check the email address and try again.");
        return;
      }

      setState("done");
      setMessage(newsletter.success_message);
      setEmail("");
    } catch {
      setState("error");
      setMessage("Could not subscribe. Please try again.");
    }
  }

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-salon-card bg-salon-shell-soft p-6 sm:p-8 lg:col-span-7">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-salon-tile text-salon-brand-dark">
                <Mail className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-display text-2xl leading-tight text-salon-ink">
                  {newsletter.heading}
                </h3>
                {newsletter.subheading ? (
                  <p className="mt-2 text-xs leading-relaxed text-salon-muted">
                    {newsletter.subheading}
                  </p>
                ) : null}
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.email_placeholder}
                aria-label={newsletter.email_placeholder}
                className="w-full rounded-xl border border-salon-card bg-white px-4 py-2.5 text-xs text-salon-ink placeholder:text-salon-muted/60 focus:border-salon-brand focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === "sending" || state === "done"}
                className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-salon-brand px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-salon-brand-dark disabled:opacity-60 sm:w-auto"
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : null}
                {state === "sending"
                  ? "Subscribing..."
                  : state === "done"
                    ? "Subscribed"
                    : newsletter.submit_label}
              </button>
            </form>

            {message ? (
              <p
                className={`text-xs ${
                  state === "error" ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {message}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm lg:col-span-5">
            <h3 className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              {popular.heading}
            </h3>
            {popular.subheading ? (
              <p className="mt-1 text-[11px] text-salon-muted">{popular.subheading}</p>
            ) : null}

            <div className="mt-4 space-y-4">
              {popularPosts.length ? (
                popularPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-3 border-b border-salon-card pb-3 last:border-none last:pb-0"
                  >
                    <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-salon-tile">
                      <CmsImage
                        value={post.cover_video || post.cover_image}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0">
                      <h4 className="line-clamp-2 text-xs font-semibold text-salon-ink transition hover:text-salon-brand">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <p className="mt-1 text-[10px] text-salon-muted">
                        {post.date_label}
                        {post.read_time ? ` • ${post.read_time}` : ""}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-salon-muted">{popular.empty_message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Uploads live on the Admin origin, which is the only place with an API route. */
function adminOrigin(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001").replace(/\/$/, "");
}