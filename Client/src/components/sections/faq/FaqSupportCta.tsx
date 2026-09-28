"use client";

import React from "react";
import Link from "next/link";
import { Headphones } from "lucide-react";

export default function FaqSupportCta() {
  return (
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-blue-950 p-8 text-white sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900/60 border border-blue-800 text-blue-300 mb-6">
                <Headphones className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-blue-300">Still have questions?</p>
              <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                Our Support Team is Here to <span className="text-blue-400">Help</span>
              </h2>
              <p className="mt-2 text-xs text-blue-200 max-w-md">
                Can't find the answer you're looking for? Get in touch with our friendly support team and we'll be happy to assist you.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-950 hover:bg-blue-50 transition-colors"
                >
                  Contact Support &rarr;
                </Link>
                <Link
                  href="/request-demo"
                  className="rounded-xl border border-blue-700 bg-blue-900/40 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-900 transition-colors"
                >
                  Book a Demo
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}