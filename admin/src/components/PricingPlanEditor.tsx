"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionField, { type FieldValue } from "@/components/SectionField";
import { iconField, type FieldSpec } from "@/lib/sectionSpecs";

/** A package as returned by `GET /api/pricing`. */
type Plan = {
  id: number;
  name: string;
  icon?: string;
  monthly: string;
  annual: string;
  billed?: string;
  billedMonthly?: string;
  desc?: string;
  description?: string;
  features: string[];
  image_url?: string;
  image_alt?: string;
  featured: boolean;
  badge?: string;
  cta: string;
  cta_href: string;
  is_published?: boolean;
};

/** Unsaved package, so a new one can be drafted before it gets an id. */
type DraftPlan = Omit<Plan, "id"> & { id?: number };

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400";

/**
 * Fields for one package. These mirror the `pricing_plans` columns and the
 * `PricingPlan` shape the marketing site renders.
 */
const PLAN_FIELDS: FieldSpec[] = [
  iconField(),
  { kind: "text", key: "name", label: "Plan name" },
  { kind: "text", key: "monthly", label: "Monthly price", help: "Text, e.g. $49 or Custom." },
  { kind: "text", key: "annual", label: "Annual price", help: "Price per month when billed annually." },
  { kind: "text", key: "billed", label: "Billed text (annual)" },
  { kind: "text", key: "billedMonthly", label: "Billed text (monthly)" },
  { kind: "textarea", key: "desc", label: "Short description", rows: 2 },
  { kind: "string-list", key: "features", label: "Features", itemLabel: "Feature" },
  { kind: "image", key: "image_url", label: "Plan image or video", full: true },
  { kind: "text", key: "image_alt", label: "Plan media alt text", full: true },
  { kind: "toggle", key: "featured", label: "Featured plan" },
  { kind: "text", key: "badge", label: "Badge", help: "Shown on the featured plan, e.g. Most Popular." },
  { kind: "text", key: "cta", label: "CTA label" },
  { kind: "url", key: "cta_href", label: "CTA href" },
];

function emptyPlan(): DraftPlan {
  return {
    name: "",
    monthly: "",
    annual: "",
    billed: "",
    billedMonthly: "",
    desc: "",
    description: "",
    features: [],
    image_url: "",
    image_alt: "",
    featured: false,
    badge: "",
    cta: "Get Started",
    cta_href: "/request-demo",
    is_published: true,
  };
}

/**
 * Manager for the pricing packages shown on the pricing page and the home
 * teaser, backed by the `pricing_plans` table.
 *
 * Page copy (hero, comparison table, banner, FAQ) is edited separately under
 * Pages -> Pricing, so this screen only deals with the packages themselves.
 */
export default function PricingPlanEditor() {
  const router = useRouter();

  const [plans, setPlans] = useState<DraftPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<number | "new" | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/pricing");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { plans: Plan[] };
      setPlans(data.plans);
    } catch {
      setError("Could not load the pricing packages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function patch(id: number | "new", key: string, value: FieldValue) {
    setPlans((prev) =>
      prev.map((plan) =>
        (plan.id ?? "new") === id ? ({ ...plan, [key]: value } as DraftPlan) : plan
      )
    );
  }

  function addPlan() {
    const draft = { ...emptyPlan(), id: undefined };
    setPlans((prev) => [...prev, draft]);
    setOpenId("new");
    setMessage("");
  }

  function removeDraft() {
    setPlans((prev) => prev.filter((plan) => plan.id !== undefined));
    setOpenId(null);
  }

  function move(index: number, direction: -1 | 1) {
    setPlans((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      // Saved top to bottom, sending the row index so the order sticks. Each
      // package is saved on its own so one bad row cannot block the rest.
      const results = await Promise.all(
        plans.map(async (plan, index) => {
          const res = await fetch("/api/pricing", {
            method: plan.id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...plan, sort_order: index + 1 }),
          });
          return { ok: res.ok, body: await res.json().catch(() => ({})) };
        })
      );

      const failed = results.find((r) => !r.ok);
      if (failed) {
        setError(failed.body?.error || "Could not save the pricing packages.");
        return;
      }

      setMessage("Pricing packages saved. The marketing site is already showing them.");
      await load();
      router.refresh();
    } catch {
      setError("Could not save the pricing packages.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(plan: DraftPlan) {
    if (plan.id === undefined) {
      removeDraft();
      return;
    }
    if (!window.confirm(`Delete the "${plan.name}" package? This cannot be undone.`)) return;

    setSaving(true);
    setError("");
    const res = await fetch(`/api/pricing?id=${plan.id}`, { method: "DELETE" }).catch(() => null);
    setSaving(false);

    if (!res || !res.ok) {
      setError("Could not delete that package.");
      return;
    }
    await load();
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading pricing packages...</p>;
  }

  const published = plans.filter((plan) => plan.is_published !== false).length;

  return (
    <form onSubmit={onSave} className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pricing packages</h1>
          <p className="mt-1 text-sm text-slate-500">
            These cards appear on the pricing page and in the home page teaser, in the order
            listed. {published} of {plans.length} published.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addPlan}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Add package
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save all"}
          </button>
        </div>
      </div>

      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {plans.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No packages yet. Use &quot;Add package&quot; to create the first one.
        </p>
      ) : null}

      <ul className="space-y-3">
        {plans.map((plan, index) => {
          const key = plan.id ?? "new";
          const isOpen = openId === key;
          const isNew = plan.id === undefined;

          return (
            <li key={key} className="rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="w-6 text-xs font-semibold text-slate-400">{index + 1}</span>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : key)}
                  className="flex-1 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {plan.name || "Untitled package"}
                  </span>
                  <span className="ml-2 text-xs text-slate-500">
                    {plan.monthly || "-"} / {plan.annual || "-"}
                    {plan.featured ? " - featured" : ""}
                    {isNew ? " - not saved yet" : ""}
                    {plan.is_published === false ? " - hidden" : ""}
                  </span>
                </button>

                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={plan.is_published !== false}
                    onChange={(e) => patch(key, "is_published", e.target.checked)}
                  />
                  Published
                </label>

                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === plans.length - 1}
                  aria-label="Move down"
                  className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(plan)}
                  className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-600"
                >
                  Delete
                </button>
              </div>

              {isOpen ? (
                <div className="grid gap-4 border-t border-slate-100 px-4 py-4 sm:grid-cols-2">
                  {PLAN_FIELDS.map((spec) => (
                    <div key={spec.key} className={spec.full ? "sm:col-span-2" : ""}>
                      <SectionField
                        spec={spec}
                        value={(plan as Record<string, FieldValue>)[spec.key]}
                        onChange={(next) => patch(key, spec.key, next)}
                        nested
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">
                      Description (alt)
                      <textarea
                        value={plan.description ?? ""}
                        onChange={(e) => patch(key, "description", e.target.value)}
                        rows={2}
                        className={inputClass}
                      />
                    </label>
                  </div>

                  {isNew ? (
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={removeDraft}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        Cancel this package
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </form>
  );
}
