"use client";

import { FormEvent, useEffect, useState } from "react";

type MediaItem = {
  id: number;
  url: string;
  original_name: string;
  alt_text: string | null;
  mime_type: string;
  size_bytes: number;
};

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data.media || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("alt_text", alt);
    const res = await fetch("/api/media", { method: "POST", body: form });
    if (res.ok) {
      setMessage("Upload successful.");
      setFile(null);
      setAlt("");
      load();
    } else {
      const data = await res.json();
      setMessage(data.error || "Upload failed");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setMessage(`Copied: ${url}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Media library</h2>
        <p className="text-sm text-slate-600">Upload images for page sections and blog covers.</p>
      </div>

      <form onSubmit={onUpload} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <label className="text-xs font-semibold text-slate-600">Image file</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Alt text</label>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white">
          Upload
        </button>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt_text || item.original_name} className="h-40 w-full object-cover" />
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium">{item.original_name}</p>
              <p className="truncate text-xs text-slate-500">{item.url}</p>
              <div className="flex gap-3">
                <button onClick={() => copyUrl(item.url)} className="text-xs font-semibold text-[#0D1140]">
                  Copy URL
                </button>
                <button onClick={() => onDelete(item.id)} className="text-xs font-semibold text-red-600">
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
