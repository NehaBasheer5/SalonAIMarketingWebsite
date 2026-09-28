import React from "react";
import { Users, Smile, CalendarCheck, TrendingUp, Headset } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Salons Worldwide" },
  { icon: Smile, value: "500K+", label: "Happy Customers" },
  { icon: CalendarCheck, value: "1M+", label: "Appointments Managed" },
  { icon: TrendingUp, value: "95%", label: "Customer Satisfaction" },
  { icon: Headset, value: "24/7", label: "Customer Support" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/60 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
                <span className="mt-1 text-xs font-medium text-slate-500">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}