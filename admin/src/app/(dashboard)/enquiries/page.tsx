"use client";

import { useCallback, useEffect, useState } from "react";

type Status = "new" | "read" | "replied" | "archived";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  status: Status;
  notes: string | null;
  ip: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_TABS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

const BADGE: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-amber-100 text-amber-700",
  replied: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-500",
};

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0D1140]";

export default function EnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<Status | "all">("all");
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async (status: Status | "all") => {
    setLoading(true);
    const query = status === "all" ? "" : `?status=${status}`;
    const res = await fetch(`/api/enquiries${query}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.enquiries || []);
      setCounts(data.counts || {});
      setTotal(Number(data.total || 0));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  function open(item: Enquiry) {
    setOpenId(item.id);
    setNotes(item.notes || "");
    setError("");
    if (item.status === "new") setStatus(item.id, "read");
  }

  async function setStatus(id: number, status: Status) {
    await fetch("/api/enquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load(tab);
  }

  async function saveNotes(id: number) {
    const res = await fetch("/api/enquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notes }),
    });
    if (!res.ok) {
      setError("Could not save notes");
      return;
    }
    setError("");
    load(tab);
  }

  async function remove(id: number) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
    if (openId === id) setOpenId(null);
    load(tab);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0D1140]">Enquiries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Messages sent from the contact and demo forms.
          </p>
        </div>
        <button
          onClick={() => load(tab)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              tab === t.value ? "bg-[#0D1140] text-white" : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.label}
            {t.value !== "all" && counts[t.value] ? (
              <span className="ml-1.5 opacity-70">{counts[t.value]}</span>
            ) : null}
          </button>
        ))}
        <span className="self-center text-xs text-slate-400">{total} total</span>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No enquiries yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const expanded = openId === item.id;
            return (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white">
                <button
                  onClick={() => (expanded ? setOpenId(null) : open(item))}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left"
                >
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${BADGE[item.status]}`}>
                    {item.status}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {item.subject || "(no subject)"}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {item.name} · {item.email}
                      {item.phone ? ` · ${item.phone}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                    {item.source}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </button>

                {expanded ? (
                  <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                    <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {(["new", "read", "replied", "archived"] as Status[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(item.id, s)}
                          disabled={item.status === s}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            item.status === s
                              ? "bg-[#0D1140] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Mark {s}
                        </button>
                      ))}
                      <a
                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                          `Re: ${item.subject || "Your enquiry"}`
                        )}`}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Reply by email
                      </a>
                      <button
                        onClick={() => remove(item.id)}
                        className="ml-auto rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700">
                        Internal notes
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Only admins see these notes."
                        className={input}
                      />
                      <button
                        onClick={() => saveNotes(item.id)}
                        className="mt-2 rounded-lg bg-[#0D1140] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a1f5c]"
                      >
                        Save notes
                      </button>
                    </div>

                    {item.ip ? (
                      <p className="text-[11px] text-slate-400">Submitted from {item.ip}</p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}