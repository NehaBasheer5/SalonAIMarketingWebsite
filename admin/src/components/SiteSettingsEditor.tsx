"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import MediaPickerField from "@/components/MediaPickerField";
import {
  defaultSiteSettings,
  normalizeSiteSettings,
  type NavItem,
  type SiteSettings,
} from "@/lib/siteSettings";

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400";

const labelClass = "text-xs font-semibold text-slate-600";

/** One editable link row in the navigation list. */
function emptyNavItem(): NavItem {
  return { label: "", href: "/", is_visible: true };
}

/**
 * Admin -> Settings.
 *
 * Manages the site-wide navbar: the logo (or brand wordmark), the navigation
 * links and the header action buttons. Everything is saved as a single object
 * and served to the marketing site via `/api/public/settings`.
 */
export default function SiteSettingsEditor() {
  const router = useRouter();

  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { settings: unknown };
      setSettings(normalizeSiteSettings(data.settings));
    } catch {
      setError("Could not load the site settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function patch<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setMessage("");
  }

  function patchNav(index: number, changes: Partial<NavItem>) {
    setSettings((prev) => ({
      ...prev,
      nav_items: prev.nav_items.map((item, i) =>
        i === index ? { ...item, ...changes } : item
      ),
    }));
    setMessage("");
  }

  function addNavItem() {
    setSettings((prev) => ({ ...prev, nav_items: [...prev.nav_items, emptyNavItem()] }));
    setMessage("");
  }

  function removeNavItem(index: number) {
    setSettings((prev) => ({
      ...prev,
      nav_items: prev.nav_items.filter((_, i) => i !== index),
    }));
    setMessage("");
  }

  function moveNavItem(index: number, direction: -1 | 1) {
    setSettings((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.nav_items.length) return prev;
      const next = [...prev.nav_items];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, nav_items: next };
    });
    setMessage("");
  }

  async function onSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save the settings.");
        return;
      }
      setSettings(normalizeSiteSettings(data.settings));
      setMessage("Settings saved. The marketing site is already using them.");
      router.refresh();
    } catch {
      setError("Could not save the settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading settings...</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Site settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Control the logo, navigation links and header buttons shown across the
            marketing site. Changes go live on the next page load.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
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

      {/* Brand & logo */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Logo &amp; brand</h2>
        <p className="mt-1 text-xs text-slate-500">
          Upload a logo to replace the text wordmark. Leave it empty to keep the
          brand name below.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MediaPickerField
            label="Navbar logo"
            value={settings.logo_url}
            onChange={(url) => patch("logo_url", url)}
            imageOnly
            compact
          />
          <label className={labelClass}>
            Logo alt text
            <input
              type="text"
              value={settings.logo_alt}
              onChange={(e) => patch("logo_alt", e.target.value)}
              placeholder="SalonAI"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Brand name
            <input
              type="text"
              value={settings.brand_name}
              onChange={(e) => patch("brand_name", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Brand accent
            <input
              type="text"
              value={settings.brand_accent}
              onChange={(e) => patch("brand_accent", e.target.value)}
              placeholder="AI"
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Tagline
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => patch("tagline", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      {/* Navigation */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Navigation links</h2>
            <p className="mt-1 text-xs text-slate-500">
              Shown in the order listed. Untick a link to hide it without deleting it.
            </p>
          </div>
          <button
            type="button"
            onClick={addNavItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Add link
          </button>
        </div>

        {settings.nav_items.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
            No navigation links. Use &quot;Add link&quot; to create the first one.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {settings.nav_items.map((item, index) => (
              <li
                key={index}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3"
              >
                <label className={`${labelClass} min-w-[10rem] flex-1`}>
                  Label
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => patchNav(index, { label: e.target.value })}
                    placeholder="Features"
                    className={inputClass}
                  />
                </label>
                <label className={`${labelClass} min-w-[12rem] flex-1`}>
                  Link
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => patchNav(index, { href: e.target.value })}
                    placeholder="/features"
                    className={inputClass}
                  />
                </label>

                <label className="flex items-center gap-1.5 pb-2 text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={item.is_visible}
                    onChange={(e) => patchNav(index, { is_visible: e.target.checked })}
                  />
                  Visible
                </label>

                <div className="flex items-center gap-1 pb-1">
                  <button
                    type="button"
                    onClick={() => moveNavItem(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="rounded border border-slate-300 bg-white p-1.5 text-slate-600 disabled:opacity-40"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavItem(index, 1)}
                    disabled={index === settings.nav_items.length - 1}
                    aria-label="Move down"
                    className="rounded border border-slate-300 bg-white p-1.5 text-slate-600 disabled:opacity-40"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNavItem(index)}
                    aria-label="Remove link"
                    className="rounded border border-rose-300 bg-white p-1.5 text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Header actions */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Header buttons</h2>
        <p className="mt-1 text-xs text-slate-500">
          The two buttons on the right of the navbar. Leave a label empty to hide
          that button.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Secondary label
            <input
              type="text"
              value={settings.secondary_label}
              onChange={(e) => patch("secondary_label", e.target.value)}
              placeholder="Login"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Secondary link
            <input
              type="text"
              value={settings.secondary_href}
              onChange={(e) => patch("secondary_href", e.target.value)}
              placeholder="/login"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Primary label
            <input
              type="text"
              value={settings.cta_label}
              onChange={(e) => patch("cta_label", e.target.value)}
              placeholder="Get Started"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Primary link
            <input
              type="text"
              value={settings.cta_href}
              onChange={(e) => patch("cta_href", e.target.value)}
              placeholder="/request-demo"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
