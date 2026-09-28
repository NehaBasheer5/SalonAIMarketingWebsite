"use client";

import { FormEvent, useEffect, useState } from "react";

type Faq = {
  id?: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: number | boolean;
};

const empty: Faq = {
  question: "",
  answer: "",
  category: "General",
  sort_order: 0,
  is_published: true,
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [form, setForm] = useState<Faq>(empty);

  async function load() {
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setFaqs(data.faqs || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/faqs", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    load();
  }

  async function onDelete(id: number) {
    if (!confirm("Delete FAQ?")) return;
    await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">FAQs</h2>
        <p className="text-sm text-slate-600">Manage questions shown on the Client FAQ page.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <input
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          required
        />
        <textarea
          placeholder="Answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          rows={3}
          required
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white">
            {form.id ? "Update FAQ" : "Add FAQ"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{faq.question}</p>
                <p className="mt-1 text-sm text-slate-600">{faq.answer}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {faq.category} · order {faq.sort_order}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setForm(faq)} className="text-xs font-semibold text-[#0D1140]">
                  Edit
                </button>
                <button onClick={() => onDelete(faq.id!)} className="text-xs font-semibold text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
