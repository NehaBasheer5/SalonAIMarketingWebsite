"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { images } from "@/assets";

const faqs = [
  { q: "Can I change my plan later?", a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your dashboard." },
  { q: "Is there a free trial available?", a: "Yes! We offer a 14-day free trial on all plans with no credit card required." },
  { q: "Do you offer refunds?", a: "We offer a 30-day money-back guarantee if you are not satisfied with our platform." },
  { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and daily automated backups." },
  { q: "Can I manage multiple branches?", a: "Yes, multi-branch management is supported on our Pro and Enterprise plans." },
];

export default function PricingFaqCta() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* FAQ Accordion */}
          <div className="lg:col-span-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${openIdx === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openIdx === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/faq" className="text-xs font-bold text-blue-900 hover:underline">
                View All FAQs &rarr;
              </Link>
            </div>
          </div>

          {/* Right Banner CTA */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl bg-blue-950 p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-extrabold leading-tight">
                  Ready to Transform Your Salon Business?
                </h3>
                <p className="mt-3 text-xs text-blue-200 max-w-sm">
                  Join thousands of salon owners who are streamlining their operations with SalonAI.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/request-demo" className="rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-blue-950 hover:bg-blue-50">
                    Book a Demo &rarr;
                  </Link>
                  <Link href="/contact" className="rounded-lg border border-blue-400/40 bg-blue-900/50 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-900">
                    Contact Sales
                  </Link>
                </div>
              </div>

              <div className="mt-6 hidden sm:block">
                <Image
                  src={images.dashboardMockup}
                  alt="SalonAI Dashboard Laptop View"
                  width={400}
                  height={250}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}