/**
 * Shared media helpers so the admin uploader, the media library and the
 * section editor all agree on what counts as an image, a video, and how big
 * each is allowed to get. Client components import this too, so it must stay
 * free of server-only dependencies.
 */

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 100 * 1024 * 1024;

/** Value for an `<input type="file" accept="...">`. */
export const MEDIA_ACCEPT_ATTR =
  "image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml,video/mp4,video/webm,video/quicktime,video/ogg";

/** Mime -> on disk extension. Nothing outside this map is ever stored. */
export const EXT_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
};

export const ALLOWED_KINDS = "an image (PNG, JPEG, WebP, GIF, AVIF, SVG) or a video (MP4, WebM, MOV, OGV)";

const EXT_TO_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(EXT_BY_MIME).map(([mime, ext]) => [ext, mime])
);

const GENERIC_MIMES = new Set(["", "application/octet-stream", "binary/octet-stream"]);

/**
 * Resolves the mime to store and the extension to write.
 *
 * Browsers send a real `video/*` type for the formats we allow, but some
 * clients (and older Safari for `.mov`) send a generic binary type instead, so
 * fall back to the filename extension. Anything outside the allow-list is
 * rejected either way, so this never widens what can be stored.
 */
export function resolveMediaType(
  mime: string | null | undefined,
  filename: string
): { mime: string; ext: string } | null {
  const normalized = (mime ?? "").toLowerCase().split(";")[0].trim();

  if (EXT_BY_MIME[normalized]) {
    return { mime: normalized, ext: EXT_BY_MIME[normalized] };
  }

  if (GENERIC_MIMES.has(normalized)) {
    // Only the basename matters, and only ever to look up an allow-listed ext.
    const base = filename.split(/[\\/]/).pop() ?? "";
    const dot = base.lastIndexOf(".");
    if (dot === -1) return null;
    const ext = base.slice(dot).toLowerCase();
    const resolved = EXT_TO_MIME[ext];
    if (!resolved) return null;
    return { mime: resolved, ext };
  }

  return null;
}

export function isVideoMime(mime: string | null | undefined): boolean {
  return typeof mime === "string" && mime.toLowerCase().startsWith("video/");
}

export function maxBytesFor(mime: string): number {
  return isVideoMime(mime) ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES;
}

const VIDEO_EXT_PATH = /\.(mp4|webm|mov|ogv)$/i;

/** Guesses from the stored url, for values that were saved before we stored the mime. */
export function isVideoPath(url: string | null | undefined): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0];
  return VIDEO_EXT_PATH.test(clean);
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}
