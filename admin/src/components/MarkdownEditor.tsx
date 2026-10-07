"use client";

import { useRef, useState, type ReactNode } from "react";
import { MEDIA_ACCEPT_ATTR } from "@/lib/media";

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  help?: string;
};

/**
 * Inline icon set. The admin app has no icon library dependency, so these few
 * glyphs are declared locally rather than pulling one in.
 */
const ICONS: Record<string, ReactNode> = {
  bold: <path d="M6 4h6a4 4 0 0 1 0 8H6zM6 12h7a4 4 0 0 1 0 8H6z" />,
  italic: (
    <>
      <path d="M19 4h-9M14 20H5M15 4L9 20" />
    </>
  ),
  heading: <path d="M6 4v16M18 4v16M6 12h12" />,
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  ordered: <path d="M10 6h10M10 12h10M10 18h10M4 6h1v4M4 10h2M4 14h2v4H4z" />,
  quote: <path d="M3 21c3 0 7-1 7-8V5H4v8h3c0 3-1 4-4 4zM14 21c3 0 7-1 7-8V5h-6v8h3c0 3-1 4-4 4z" />,
  link: <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />,
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.6-4.6a2 2 0 0 0-2.8 0L3 21" />
    </>
  ),
  video: (
    <>
      <path d="m22 8-6 4 6 4z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  eraser: <path d="M20 20H8l-4-4a2 2 0 0 1 0-2.8l9-9a2 2 0 0 1 2.8 0l7 7a2 2 0 0 1 0 2.8L14 22M7 9l8 8" />,
};

const TOOLS = [
  { name: "bold", label: "Bold" },
  { name: "italic", label: "Italic" },
  { name: "heading", label: "Heading" },
  { name: "list", label: "Bulleted list" },
  { name: "ordered", label: "Numbered list" },
  { name: "quote", label: "Quote" },
  { name: "link", label: "Link" },
] as const;

function ToolIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

/**
 * Article body editor.
 *
 * The body is stored as markdown. The toolbar wraps the current selection in
 * markdown syntax, and the two media buttons upload straight to the shared
 * media library and drop a `![alt](url)` tag at the caret. The Client renderer
 * turns that tag into an `<img>` or a `<video>` based on the file extension, so
 * an editor can mix text, images and videos in one article.
 */
export default function MarkdownEditor({
  label = "Article content",
  value,
  onChange,
  placeholder = "Write the article...",
  rows = 16,
  help,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");

  /** Replaces the current selection, or inserts a placeholder when nothing is selected. */
  function surround(before: string, after = before, fallback = "text") {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const inner = value.slice(start, end) || fallback;
    const next = `${value.slice(0, start)}${before}${inner}${after}${value.slice(end)}`;

    onChange(next);

    // Put the caret inside the wrapper so typing continues inline.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + inner.length);
    });
  }

  /** Prefixes the caret's line, used for headings, quotes and list items. */
  function prefixLine(prefix: string) {
    const el = textareaRef.current;
    if (!el) return;

    const caret = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", caret - 1) + 1;
    onChange(`${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret + prefix.length, caret + prefix.length);
    });
  }

  /** Inserts a block of its own, keeping it separated from surrounding text. */
  function insertBlock(text: string) {
    const el = textareaRef.current;
    if (!el) return;

    const caret = el.selectionStart;
    const leading = caret > 0 && value[caret - 1] !== "\n" ? "\n" : "";
    const block = `${leading}${text}\n`;
    onChange(`${value.slice(0, caret)}${block}${value.slice(caret)}`);

    requestAnimationFrame(() => {
      el.focus();
      const position = caret + block.length;
      el.setSelectionRange(position, position);
    });
  }

  async function upload(file: File | null) {
    if (!file) return;
    setError("");
    setUploading(file.name);

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

      // The renderer picks `<img>` or `<video>` from the extension, so both
      // kinds use the same markdown shape.
      insertBlock(`![${file.name}](${data.media.url})`);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  /**
   * Toolbar dispatch. Resolved inside the click handler so the caret ref is
   * only ever touched from an event callback.
   */
  function runTool(tool: string) {
    switch (tool) {
      case "bold":
        return surround("**");
      case "italic":
        return surround("_");
      case "heading":
        return prefixLine("## ");
      case "list":
        return prefixLine("- ");
      case "ordered":
        return prefixLine("1. ");
      case "quote":
        return prefixLine("> ");
      case "link":
        return surround("[", "](https://)", "link text");
      default:
        return undefined;
    }
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <label className="text-xs font-semibold text-slate-600">{label}</label>

      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-slate-200 bg-slate-50 p-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.name}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            onClick={() => runTool(tool.name)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-white hover:text-[#0D1140]"
          >
            <ToolIcon name={tool.name} />
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-[#0D1140]">
          <ToolIcon name="image" />
          {uploading ? "Uploading..." : "Image"}
          <input
            type="file"
            accept={MEDIA_ACCEPT_ATTR}
            className="hidden"
            disabled={Boolean(uploading)}
            onChange={(e) => upload(e.target.files?.[0] || null)}
          />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-[#0D1140]">
          <ToolIcon name="video" />
          {uploading ? "Uploading..." : "Video"}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/ogg"
            className="hidden"
            disabled={Boolean(uploading)}
            onChange={(e) => upload(e.target.files?.[0] || null)}
          />
        </label>

        <button
          type="button"
          title="Strip markdown characters"
          aria-label="Strip markdown characters"
          onClick={() => onChange(value.replace(/[*_`>#]/g, ""))}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-white hover:text-[#0D1140]"
        >
          <ToolIcon name="eraser" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-b-xl rounded-t border border-slate-200 px-3 py-2 font-mono text-xs leading-relaxed focus:border-[#0D1140] focus:outline-none"
      />

      <p className="text-[11px] text-slate-400">
        {help ??
          "Markdown supported. The Image and Video buttons upload into the media library and drop the file into the article at the cursor."}
      </p>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}