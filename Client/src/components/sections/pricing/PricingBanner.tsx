import React from "react";
import { Cloud, RefreshCw, Database, Smartphone, ShieldCheck } from "lucide-react";

const items = [
  { icon: Cloud, title: "Cloud Based", desc: "Secure & Reliable" },
  { icon: RefreshCw, title: "Automatic Updates", desc: "Always up to date" },
  { icon: Database, title: "Data Backup", desc: "Daily backups" },
  { icon: Smartphone, title: "Mobile Apps", desc: "iOS & Android" },
  { icon: ShieldCheck, title: "GDPR Compliant", desc: "Your data is safe" },
];

export default function PricingFeaturesBanner() {
  return (
    <section className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">All plans include</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <Icon className="h-5 w-5 text-blue-900 mb-2" />
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}