"use client";

import React from "react";
import { MapPin } from "lucide-react";

export type LocationMapSectionProps = {
  heading: string;
  body: string;
  address: string;
  map_query: string;
  directions_label: string;
  directions_href: string;
};

export default function LocationMapSection({
  heading,
  body,
  address,
  map_query,
  directions_label,
  directions_href,
}: LocationMapSectionProps) {
  const query = encodeURIComponent(map_query || address || "Colombo");
  const src = `https://www.google.com/maps?q=${query}&output=embed`;

  return (
    <section className="w-full overflow-hidden bg-salon-soft py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white/80 shadow-sm lg:grid-cols-12">
          <div className="h-64 w-full lg:col-span-8 lg:h-auto lg:min-h-[380px]">
            <iframe
              title="Office Map"
              src={src}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="space-y-3 p-5 sm:p-6 lg:col-span-4 lg:p-8 lg:pt-24">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-salon-tile text-salon-brand-dark">
              <MapPin className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-2xl text-salon-ink">{heading || "Our Location"}</h3>
            {body ? (
              <p className="text-xs text-salon-muted">{body}</p>
            ) : (
              <p className="text-xs text-salon-muted">
                Visit us at our office, we&apos;d love to meet you!
              </p>
            )}
            {address ? (
              <p className="text-xs font-semibold text-salon-ink">{address}</p>
            ) : null}
            {directions_href ? (
              <a
                href={directions_href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center rounded-lg border border-salon-card bg-salon-tile px-3 py-1.5 text-xs font-semibold text-salon-brand-dark transition hover:bg-salon-shell"
              >
                {directions_label || "Get Directions"}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
