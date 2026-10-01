"use client";

import { useRef, useState } from "react";
import { MEDIA_ACCEPT_ATTR, isVideoPath } from "@/lib/media";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** Renders a smaller square thumbnail, for avatars and other inline media. */
  compact?: boolean;
  /** Avatars and icons only make sense as images, so hide video in the file dialog. */
  imageOnly?: boolean;
};

const IMAGE_ACCEPT_ATTR =
  "image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml";

export default function MediaPickerField({
  label = "Media",
  value,
  onChange,
  compact = false,
  imageOnly = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File | null) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt_text", file.name);
      const res = await fetch("/api/media", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange(data.media.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const accept = imageOnly ? IMAGE_ACCEPT_ATTR : MEDIA_ACCEPT_ATTR;
  const kind = imageOnly ? "an image" : "an image or a video";
  const isVideo = !imageOnly && isVideoPath(value);

  const dropZoneClass = [
    "flex cursor-pointer flex-col items-center justify-center gap-1 text-center transition",
    compact ? "rounded-xl border border-dashed px-3 py-4" : "rounded-xl border border-dashed px-4 py-8",
    dragging ? "border-[#0D1140] bg-slate-100" : "border-slate-300 bg-slate-50 hover:bg-slate-100",
  ].join(" ");

  const preview = (
    <div
      className={`overflow-hidden border border-slate-200 bg-slate-50 ${
        compact ? "h-16 w-16 shrink-0 rounded-lg" : "h-48 w-full rounded-xl"
      }`}
    >
      {isVideo ? (
        <video src={value} className="h-full w-full object-cover" muted playsInline />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={value} alt="" className="h-full w-full object-cover" />
      )}
    </div>
  );

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg bg-[#0D1140] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {uploading
          ? "Uploading..."
          : value
            ? compact
              ? "Replace"
              : "Change"
            : `Upload ${compact ? "" : "media"}`}
      </button>
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Remove
        </button>
      ) : null}
    </div>
  );

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      className="hidden"
      onChange={(e) => upload(e.target.files?.[0] || null)}
    />
  );

  const emptyState = (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        upload(e.dataTransfer.files?.[0] || null);
      }}
      className={dropZoneClass}
    >
      <span className="text-2xl leading-none" aria-hidden>
        +
      </span>
      <span className="text-xs font-semibold text-slate-600">
        {uploading ? "Uploading..." : "Click to upload"}
      </span>
      <span className="text-[11px] text-slate-400">or drag and drop {kind} here</span>
    </button>
  );

  const meta = (
    <p className="truncate text-[11px] text-slate-400">
      {isVideo ? "Video: " : ""}
      {value}
    </p>
  );

  return (
    <div className={compact ? "space-y-1" : "sm:col-span-2 space-y-2"}>
      <label className="text-xs font-semibold text-slate-600">{label}</label>

      {value ? (
        compact ? (
          <div className="flex items-center gap-3">
            {preview}
            <div className="min-w-0 flex-1 space-y-2">
              {actions}
              {meta}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {preview}
            {actions}
            {meta}
          </div>
        )
      ) : (
        emptyState
      )}

      {fileInput}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
