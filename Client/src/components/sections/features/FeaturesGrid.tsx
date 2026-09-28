"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, Users, UserCheck, Scissors, CreditCard, 
  Gift, Bell, BarChart3, Sparkles, Network, ShieldCheck, Puzzle,
  ArrowRight, LayoutGrid, Megaphone, Briefcase
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  href: string;
}

const categories = [
  { id: "all", label: "All Features", icon: LayoutGrid },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "customers", label: "Customers", icon: Users },
  { id: "staff", label: "Staff", icon: UserCheck },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "integrations", label: "Integrations", icon: Puzzle },
];

const featureList: Feature[] = [
  { id: "1", title: "Online Booking", description: "Let clients book appointments 24/7 with real-time availability and instant confirmation.", category: "bookings", icon: Calendar, href: "/features/booking" },
  { id: "2", title: "Customer Management", description: "Store customer profiles, history, preferences, notes and keep relationships stronger.", category: "customers", icon: Users, href: "/features/customers" },
  { id: "3", title: "Staff Management", description: "Manage staff roles, schedules, commissions and performance in one place.", category: "staff", icon: UserCheck, href: "/features/staff" },
  { id: "4", title: "Service Management", description: "Organize services, duration, pricing and resources effortlessly.", category: "business", icon: Scissors, href: "/features/services" },
  { id: "5", title: "Payments & Invoices", description: "Accept payments, generate invoices and manage refunds securely.", category: "business", icon: CreditCard, href: "/features/payments" },
  { id: "6", title: "Loyalty Programs", description: "Build customer loyalty with points, rewards, memberships and special offers.", category: "marketing", icon: Gift, href: "/features/loyalty" },
  { id: "7", title: "SMS & Email Notifications", description: "Send automated reminders, promotions and personalized messages.", category: "marketing", icon: Bell, href: "/features/notifications" },
  { id: "8", title: "Reports & Analytics", description: "Get real-time insights and detailed reports to grow your business.", category: "reports", icon: BarChart3, href: "/features/analytics" },
  { id: "9", title: "AI Insights", description: "AI-powered recommendations to optimize bookings, staff and services.", category: "reports", icon: Sparkles, href: "/features/ai" },
  { id: "10", title: "Multi-branch Management", description: "Manage multiple branches seamlessly from a single dashboard.", category: "business", icon: Network, href: "/features/multi-branch" },
  { id: "11", title: "Roles & Permissions", description: "Set custom roles and permissions to keep your data secure and organized.", category: "staff", icon: ShieldCheck, href: "/features/permissions" },
  { id: "12", title: "Integrations", description: "Connect with your favorite tools like accounting, marketing and payment gateways.", category: "integrations", icon: Puzzle, href: "/features/integrations" },
];

export default function FeaturesGrid() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFeatures = activeTab === "all" 
    ? featureList 
    : featureList.filter(f => f.category === activeTab);

  return (
    <section className="bg-slate-50/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Explore Our Powerful Features
          </h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 mb-12 gap-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-900 text-white shadow-md shadow-blue-900/10"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-all group-hover:gap-2.5"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}