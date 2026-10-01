"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MEDIA_ACCEPT_ATTR, formatBytes, isVideoMime, maxBytesFor } from "@/lib/media";

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
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data.media || []);
  }

  useEffect(() => {
    load();
  }, []);

  function pick(next: File | null) {
    setMessage("");
    setError("");
    if (!next) {
      setFile(null);
      return;
    }
    const max = maxBytesFor(next.type);
    if (next.size > max) {
      setError(`${isVideoMime(next.type) ? "Video" : "Image"} is larger than ${Math.round(max / 1024 / 1024)} MB`);
      return;
    }
    setFile(next);
  }

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("alt_text", alt);
    const res = await fetch("/api/media", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) {
      setMessage("Upload successful.");
      setFile(null);
      setAlt("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } else {
      setError(data.error || "Upload failed");
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setMessage(`Copied: ${url}`);
  }

  const preview = file && isVideoMime(file.type);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0D1140]">Media library</h2>
        <p className="text-sm text-slate-600">
          Upload images and videos for page sections and blog covers.
        </p>
      </div>

      <form onSubmit={onUpload} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div>
          <label className="text-xs font-semibold text-slate-600">File</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files?.[0] || null);
            }}
            className={`mt-1 flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center transition ${
              dragging
                ? "border-[#0D1140] bg-slate-100"
                : "border-slate-300 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden>
              +
            </span>
            <span className="text-xs font-semibold text-slate-600">Click to upload</span>
            <span className="text-[11px] text-slate-400">
              or drag and drop an image or video here. Images up to 5 MB, videos up to 100 MB.
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={MEDIA_ACCEPT_ATTR}
            onChange={(e) => pick(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-50">
                {preview ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {formatBytes(file.size)} &middot; {file.type || "unknown type"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Alt text</label>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!file || busy}
          className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {isVideoMime(item.mime_type) ? (
              <video
                src={item.url}
                className="h-40 w-full bg-slate-900 object-cover"
                controls
                muted
                playsInline
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.url}
                alt={item.alt_text || item.original_name}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-medium">{item.original_name}</p>
              <p className="truncate text-xs text-slate-500">
                {formatBytes(item.size_bytes)} &middot; {item.mime_type}
              </p>
              <p className="truncate text-xs text-slate-400">{item.url}</p>
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
