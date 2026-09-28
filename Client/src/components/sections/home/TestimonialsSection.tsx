"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Testimonial } from "../../../types/testimonials";

const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Owner",
    salonName: "Looks Salon",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    content:
      "SalonAI has completely transformed the way we manage our salon. Booking, staff, customers — everything is now so easy and automated.",
  },
  {
    id: "2",
    name: "Ananya Patel",
    role: "Founder",
    salonName: "Glow & Shine Studio",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    content:
      "Our no-shows dropped by 40% in the first month! The automated reminders alone have been a total game-changer for us.",
  },
  {
    id: "3",
    name: "Rohan Kapoor",
    role: "Managing Director",
    salonName: "Urban Cut Barbers",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    content:
      "Managing staff commission and inventory used to take hours every weekend. Now SalonAI handles accounting in real-time.",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="testimonials"
      className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a98a65]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#7f6448]">
                Testimonials
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl"
            >
              Loved by <span className="text-[#91663f]">Salon Owners</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm text-salon-muted">
              Real stories from salon owners who are growing their business with SalonAI.
            </p>
          </div>
          <Link
            href="/#testimonials"
            className="text-sm font-semibold text-[#85592f] underline-offset-4 hover:underline"
          >
            View All Testimonials →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="flex min-h-[250px] flex-col rounded-2xl border border-[#eadfce] bg-white/80 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#efe2d4] font-display text-xl text-[#85592f]">
                  “
                </span>
                <div className="flex text-[#91663f]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-salon-muted">{item.content}</p>

              <div className="mt-5 flex items-center gap-3 border-t border-[#eadfce] pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-salon-ink">{item.name}</p>
                  <p className="text-xs text-salon-muted">
                    {item.role}, {item.salonName}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={() =>
              setActiveIndex((i) => (i === 0 ? testimonialsData.length - 1 : i - 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#85592f]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {testimonialsData.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-2 w-2 rounded-full ${
                  activeIndex === i ? "bg-[#85592f]" : "bg-[#dbcbb8]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={() =>
              setActiveIndex((i) => (i === testimonialsData.length - 1 ? 0 : i + 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#85592f]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
