import React from "react";
import { Check, Minus, Users, Calendar, UserCheck, BarChart2, Sparkles, Gift, Network, ShieldCheck, Puzzle, Headphones, GraduationCap, ShieldAlert } from "lucide-react";

const rows = [
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
];

export default function PricingComparison() {
  const renderCell = (val: boolean | string) => {
    if (typeof val === "boolean") {
      return val ? <Check className="mx-auto h-4 w-4 text-blue-900" /> : <Minus className="mx-auto h-4 w-4 text-slate-300" />;
    }
    return <span className="text-xs font-semibold text-slate-800">{val}</span>;
  };

  return (
    <section className="bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Compare All Plans</h2>
          
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-sm font-bold text-slate-900 w-1/3">Features</th>
                <th className="pb-4 text-center text-sm font-bold text-slate-900">Starter</th>
                <th className="pb-4 text-center text-sm font-bold text-slate-900 bg-blue-50/50 rounded-t-xl">Growth</th>
                <th className="pb-4 text-center text-sm font-bold text-slate-900">Pro</th>
                <th className="pb-4 text-center text-sm font-bold text-slate-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => {
                const Icon = row.icon;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <Icon className="h-4 w-4 text-blue-900" />
                      {row.name}
                    </td>
                    <td className="py-3.5 text-center">{renderCell(row.starter)}</td>
                    <td className="py-3.5 text-center bg-blue-50/50">{renderCell(row.growth)}</td>
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