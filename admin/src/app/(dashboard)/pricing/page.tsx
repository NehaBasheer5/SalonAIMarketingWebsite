"use client";

import { FormEvent, useEffect, useState } from "react";

type Plan = {
  id?: number;
  name: string;
  price_monthly: number;
  price_yearly: number;
  description: string;
  features: string[];
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  cta_label: string;
  cta_href: string;
};

const empty: Plan = {
  name: "",
  price_monthly: 0,
  price_yearly: 0,
  description: "",
  features: [],
  is_featured: false,
  sort_order: 0,
  is_published: true,
  cta_label: "Get Started",
  cta_href: "/request-demo",
};

function normalize(plan: Record<string, unknown>): Plan {
  let features: string[] = [];
  const raw = plan.features_json ?? plan.features;
  if (Array.isArray(raw)) features = raw.map(String);
  else if (typeof raw === "string") {
    try {
      features = JSON.parse(raw);
    } catch {
      features = [];
    }
  }
  return {
    id: plan.id as number | undefined,
    name: String(plan.name || ""),
    price_monthly: Number(plan.price_monthly || 0),
    price_yearly: Number(plan.price_yearly || 0),
    description: String(plan.description || ""),
    features,
    is_featured: Boolean(plan.is_featured),
    sort_order: Number(plan.sort_order || 0),
    is_published: plan.is_published === 0 || plan.is_published === false ? false : true,
    cta_label: String(plan.cta_label || "Get Started"),
    cta_href: String(plan.cta_href || "/request-demo"),
  };
}

export default function PricingAdminPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState<Plan>(empty);
  const [featuresText, setFeaturesText] = useState("");

  async function load() {
    const res = await fetch("/api/pricing");
    const data = await res.json();
    setPlans((data.plans || []).map(normalize));
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      features: featuresText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    await fetch("/api/pricing", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm(empty);
    setFeaturesText("");
    load();
  }

  async function onDelete(id: number) {
    if (!confirm("Delete plan?")) return;
    await fetch(`/api/pricing?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Pricing plans</h2>
        <p className="text-sm text-slate-600">Manage plans shown on the Client pricing page.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <input
          placeholder="Plan name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <input
          type="number"
          placeholder="Monthly price"
          value={form.price_monthly}
          onChange={(e) => setForm({ ...form, price_monthly: Number(e.target.value) })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Yearly price"
          value={form.price_yearly}
          onChange={(e) => setForm({ ...form, price_yearly: Number(e.target.value) })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Sort order"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={2}
        />
        <textarea
          placeholder={"Features (one per line)\nOnline booking\nStaff schedule"}
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="sm:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={4}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Featured plan
        </label>
        <button type="submit" className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white">
          {form.id ? "Update plan" : "Add plan"}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="text-sm text-slate-600">
                  ${plan.price_monthly}/mo · ${plan.price_yearly}/yr
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setForm(plan);
                    setFeaturesText(plan.features.join("\n"));
                  }}
                  className="text-xs font-semibold text-[#0D1140]"
                >
                  Edit
                </button>
                <button onClick={() => onDelete(plan.id!)} className="text-xs font-semibold text-red-600">
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
