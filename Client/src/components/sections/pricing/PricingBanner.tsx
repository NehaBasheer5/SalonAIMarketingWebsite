import React from "react";
import { Cloud, Database, RefreshCw, ShieldCheck, Smartphone } from "lucide-react";

const ITEMS = [
  { icon: Cloud, title: "Cloud Based", desc: "Secure & Reliable" },
  { icon: RefreshCw, title: "Automatic Updates", desc: "Always up to date" },
  { icon: Database, title: "Data Backup", desc: "Daily backups" },
  { icon: Smartphone, title: "Mobile Apps", desc: "iOS & Android" },
  { icon: ShieldCheck, title: "GDPR Compliant", desc: "Your data is safe" },
] as const;

export default function PricingFeaturesBanner() {
  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-14 lg:pb-16">
      <div className="w-full">
        <div className="border-y border-salon-card bg-salon-shell-soft p-6 text-center">
          <h3 className="mb-6 text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
            All plans include
          </h3>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-5 sm:gap-10">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col items-center">
                  <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-salon-tile text-salon-brand-dark">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-semibold text-salon-ink">{item.title}</span>
                  <span className="mt-0.5 text-[11px] text-salon-muted">{item.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
