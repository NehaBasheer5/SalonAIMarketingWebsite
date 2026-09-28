"use client";

import React from "react";
import { MapPin } from "lucide-react";

export default function LocationMapSection() {
  return (
    <section className="py-6 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm">
          
          <div className="lg:col-span-8 h-64 w-full overflow-hidden rounded-2xl bg-blue-50">
            <iframe
              title="Office Map"
              src="https://maps.google.com/maps?q=Colombo%20Sri%20Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full border-0 rounded-2xl"
              loading="lazy"
            />
          </div>

          <div className="lg:col-span-4 space-y-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Location</h3>
            <p className="text-xs text-slate-500">Visit us at our office, we'd love to meet you!</p>
            <p className="text-xs font-semibold text-slate-800">No. 123, Innovation Drive, Colombo 00500, Sri Lanka</p>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-block rounded-xl border border-blue-900 px-4 py-2 text-xs font-semibold text-blue-900 hover:bg-blue-50">
              Get Directions &rarr;
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}