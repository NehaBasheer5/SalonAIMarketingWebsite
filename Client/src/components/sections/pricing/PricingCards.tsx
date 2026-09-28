"use client";

import React from "react";
import Link from "next/link";
import { Send, TrendingUp, Crown, Building2, CheckCircle2 } from "lucide-react";

interface PricingCardsProps {
  billingCycle: "monthly" | "annual";
}

export default function PricingCards({ billingCycle }: PricingCardsProps) {
  const isAnnual = billingCycle === "annual";

  return (
    <section className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Starter */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Send className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Starter</h3>
              <p className="mt-1 text-xs text-slate-500">Perfect for small salons just getting started.</p>
              
              <div className="mt-6">
                <span className="text-3xl font-extrabold text-slate-900">{isAnnual ? "$19" : "$25"}</span>
                <span className="text-xs text-slate-500"> /month</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{isAnnual ? "Billed annually $228" : "Billed monthly"}</p>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Up to 2 Staff</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Booking Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Customer Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Email Support</li>
              </ul>
            </div>

            <Link href="/request-demo" className="mt-8 block rounded-lg border border-slate-300 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Get Started
            </Link>
          </div>

          {/* Growth (Most Popular) */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-blue-950 bg-white p-6 shadow-md">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-950 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              MOST POPULAR
            </div>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Growth</h3>
              <p className="mt-1 text-xs text-slate-500">Great for growing salons and beauty businesses.</p>
              
              <div className="mt-6">
                <span className="text-3xl font-extrabold text-slate-900">{isAnnual ? "$39" : "$49"}</span>
                <span className="text-xs text-slate-500"> /month</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{isAnnual ? "Billed annually $468" : "Billed monthly"}</p>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Up to 10 Staff</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Advanced Reports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Loyalty Programs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> SMS & Email Notifications</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Priority Support</li>
              </ul>
            </div>

            <Link href="/request-demo" className="mt-8 block rounded-lg bg-blue-950 py-2.5 text-center text-xs font-semibold text-white shadow hover:bg-blue-900">
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Crown className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Pro</h3>
              <p className="mt-1 text-xs text-slate-500">For large salons & multi-branch businesses.</p>
              
              <div className="mt-6">
                <span className="text-3xl font-extrabold text-slate-900">{isAnnual ? "$69" : "$89"}</span>
                <span className="text-xs text-slate-500"> /month</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{isAnnual ? "Billed annually $828" : "Billed monthly"}</p>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Unlimited Staff</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Everything in Growth</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Multi-branch Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Custom Roles & Permissions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> 24/7 Priority Support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> AI Insights & Analytics</li>
              </ul>
            </div>

            <Link href="/request-demo" className="mt-8 block rounded-lg border border-slate-300 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Get Started
            </Link>
          </div>

          {/* Enterprise */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Enterprise</h3>
              <p className="mt-1 text-xs text-slate-500">For large enterprises with custom requirements.</p>
              
              <div className="mt-6">
                <span className="text-2xl font-extrabold text-slate-900">Custom</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Let's build the best plan for your business.</p>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Dedicated Account Manager</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Custom Integrations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Onboarding & Training</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> SLA & Uptime Guarantee</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Custom Development</li>
              </ul>
            </div>

            <Link href="/contact" className="mt-8 block rounded-lg border border-slate-300 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">
              Contact Sales
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}