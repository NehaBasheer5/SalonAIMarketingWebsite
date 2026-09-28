import React from "react";
import Link from "next/link";
import Image from "next/image";
import { images } from "@/assets";

export default function FeaturesCta() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-blue-950 px-6 py-12 sm:px-12 sm:py-16 text-white shadow-xl">
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            
            <div className="lg:col-span-8">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to Experience All Features?
              </h2>
              <p className="mt-3 text-base text-blue-200 max-w-xl">
                Join thousands of salon owners who are running their business smarter with SalonAI.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/request-demo"
                  className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-950 transition-all hover:bg-blue-50"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border border-blue-400/40 bg-blue-900/40 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-800/50"
                >
                  Contact Sales
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <Image
                src={images.dashboardFeatures}
                alt="SalonAI Dashboard"
                width={300}
                height={200}
                className="w-auto h-auto object-contain"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}