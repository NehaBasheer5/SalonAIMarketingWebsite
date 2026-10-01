import React from "react";
import {
  BarChart2,
  Calendar,
  Check,
  GraduationCap,
  Gift,
  Headphones,
  Minus,
  Network,
  Puzzle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

const ROWS = [
  { name: "Staff Users", icon: Users, starter: "Up to 2", growth: "Up to 10", pro: "Unlimited", enterprise: "Unlimited" },
  { name: "Bookings & Appointments", icon: Calendar, starter: true, growth: true, pro: true, enterprise: true },
  { name: "Customer Management", icon: UserCheck, starter: true, growth: true, pro: true, enterprise: true },
  { name: "Reports & Analytics", icon: BarChart2, starter: "Basic", growth: "Advanced", pro: "Advanced", enterprise: "Advanced + Custom" },
  { name: "AI Insights", icon: Sparkles, starter: false, growth: true, pro: true, enterprise: true },
  { name: "Loyalty Programs", icon: Gift, starter: false, growth: true, pro: true, enterprise: true },
  { name: "Multi-branch Management", icon: Network, starter: false, growth: false, pro: true, enterprise: true },
  { name: "Custom Roles & Permissions", icon: ShieldCheck, starter: false, growth: false, pro: true, enterprise: true },
  { name: "Custom Integrations", icon: Puzzle, starter: false, growth: false, pro: false, enterprise: true },
  { name: "Priority Support", icon: Headphones, starter: "Email", growth: "Priority", pro: "24/7 Priority", enterprise: "Dedicated" },
  { name: "Onboarding & Training", icon: GraduationCap, starter: false, growth: false, pro: false, enterprise: true },
  { name: "SLA & Uptime Guarantee", icon: ShieldAlert, starter: false, growth: false, pro: false, enterprise: true },
] as const;

export default function PricingComparison() {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="mx-auto h-4 w-4 text-salon-brand" strokeWidth={2.5} />
      ) : (
        <Minus className="mx-auto h-4 w-4 text-salon-card" />
      );
    }
    return <span className="text-xs font-semibold text-salon-ink">{value}</span>;
  };

  return (
    <section className="w-full overflow-hidden bg-salon-bg pb-14 lg:pb-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-salon-rule" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
              Compare
            </span>
            <span className="h-px w-8 bg-salon-rule" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl">
            Compare <span className="text-salon-accent">All Plans</span>
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-salon-card bg-white/80 p-6 shadow-sm">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr className="border-b border-salon-card">
                <th className="pb-4 text-sm font-semibold text-salon-ink w-1/3">Features</th>
                <th className="pb-4 text-center text-sm font-semibold text-salon-ink">Starter</th>
                <th className="rounded-t-xl bg-salon-shell/70 pb-4 text-center text-sm font-semibold text-salon-brand">
                  Growth
                </th>
                <th className="pb-4 text-center text-sm font-semibold text-salon-ink">Pro</th>
                <th className="pb-4 text-center text-sm font-semibold text-salon-ink">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-card/70">
              {ROWS.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.name} className="transition hover:bg-salon-shell-soft/60">
                    <td className="flex items-center gap-2.5 py-3.5 text-xs font-semibold text-salon-ink">
                      <Icon className="h-4 w-4 text-salon-brand" strokeWidth={1.8} />
                      {row.name}
                    </td>
                    <td className="py-3.5 text-center">{renderCell(row.starter)}</td>
                    <td className="bg-salon-shell/70 py-3.5 text-center">{renderCell(row.growth)}</td>
                    <td className="py-3.5 text-center">{renderCell(row.pro)}</td>
                    <td className="py-3.5 text-center">{renderCell(row.enterprise)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
