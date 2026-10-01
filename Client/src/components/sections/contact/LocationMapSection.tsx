"use client";

import React from "react";
import { MapPin } from "lucide-react";

export default function LocationMapSection() {
  return (
    <section className="w-full overflow-hidden bg-salon-soft py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-salon-card bg-white/80 p-4 shadow-sm sm:p-6 lg:grid-cols-12">
          <div className="h-64 w-full overflow-hidden rounded-2xl bg-salon-tile lg:col-span-8">
            <iframe
              title="Office Map"
              src="https://maps.google.com/maps?q=Colombo%20Sri%20Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full rounded-2xl border-0"
              loading="lazy"
            />
          </div>

          <div className="space-y-3 px-2 lg:col-span-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
              <MapPin className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-2xl text-salon-ink">Our Location</h3>
            <p className="text-xs text-salon-muted">
              Visit us at our office, we&apos;d love to meet you!
            </p>
            <p className="text-xs font-semibold text-salon-ink">
              No. 123, Innovation Drive, Colombo 00500, Sri Lanka
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg border border-salon-brand px-4 py-2 text-xs font-semibold text-salon-brand transition hover:bg-salon-tile/40"
            >
              Get Directions &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
