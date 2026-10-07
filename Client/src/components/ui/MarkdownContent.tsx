import type { ReactNode } from "react";
import CmsImage from "@/components/ui/CmsImage";
import { isVideoPath, resolveImageUrl } from "@/lib/content";

/**
 * Minimal markdown renderer for blog article bodies.
 *
 * Article text is authored in the Admin app and stored as markdown. Rather than
 * add a markdown dependency, this covers the subset the editor's toolbar can
 * produce: headings, bold, italic, inline code, links, images, videos,
 * blockquotes, bulleted and numbered lists, and horizontal rules.
 *
 * `![alt](url)` renders as a `<video>` when the url points at a video file, so
 * an editor can mix images and videos in one article through the same syntax.
 * Nothing is injected as raw HTML, so CMS content cannot inject markup.
 */

type Block =
  | { kind: "heading"; level: 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "media"; url: string; alt: string; video: boolean }
  | { kind: "rule" };

const MEDIA_PATTERN = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const HEADING_PATTERN = /^(#{2,4})\s+(.*)$/;
const UNORDERED_PATTERN = /^[-*]\s+(.*)$/;
const ORDERED_PATTERN = /^\d+\.\s+(.*)$/;

export function parseMarkdown(source: string): Block[] {
  const lines = (source ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let quote: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
      paragraph = [];
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ kind: "quote", text: quote.join("\n") });
      quote = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ kind: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushList();
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flushAll();
      blocks.push({ kind: "rule" });
      continue;
    }

    // Standalone media tag on its own line becomes a full width block.
    const media = MEDIA_PATTERN.exec(trimmed);
    if (media) {
      flushAll();
      blocks.push({
        kind: "media",
        alt: media[1] || "",
        url: media[2],
        video: isVideoPath(media[2]),
      });
      continue;
    }

    const heading = HEADING_PATTERN.exec(trimmed);
    if (heading) {
      flushAll();
      const level = Math.min(heading[1].length, 4) as 2 | 3 | 4;
      blocks.push({ kind: "heading", level, text: heading[2] });
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      flushList();
      quote.push(trimmed.replace(/^>\s?/, ""));
      continue;
    }

    const unordered = UNORDERED_PATTERN.exec(trimmed);
    if (unordered) {
      flushParagraph();
      flushQuote();
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(unordered[1]);
      continue;
    }

    const ordered = ORDERED_PATTERN.exec(trimmed);
    if (ordered) {
      flushParagraph();
      flushQuote();
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    flushQuote();
    flushList();
    paragraph.push(trimmed);
  }

  flushAll();
  return blocks;
}

/** Wraps every occurrence of a markdown pattern in a React node. */
function decorate(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Ordered so code spans win over emphasis, and links win over emphasis.
  const pattern =
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(_[^_]+_)|(\[[^\]]+\]\([^)\s]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const token = match[0];

    if (token.startsWith("`")) {
      nodes.push(
        <code key={`${key}-c${match.index}`} className="rounded bg-salon-shell px-1.5 py-0.5 font-mono text-[0.85em] text-salon-ink">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${key}-b${match.index}`} className="font-semibold text-salon-ink">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[")) {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      const href = link ? link[2] : "#";
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={`${key}-a${match.index}`}
          href={href}
          className="font-medium text-salon-brand underline underline-offset-4 hover:text-salon-brand-dark"
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {link ? link[1] : token}
        </a>
      );
    } else {
      nodes.push(
        <em key={`${key}-i${match.index}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

/** Renders newlines inside a paragraph as `<br>`, the usual markdown behaviour. */
function withLineBreaks(text: string, key: string): ReactNode[] {
  return text.split("\n").flatMap((line, index) =>
    index === 0
      ? [decorate(line, `${key}-${index}`)]
      : [<br key={`${key}-br${index}`} />, decorate(line, `${key}-${index}`)]
  );
}

/** Video files get a native player rather than the autoplaying `CmsImage` treatment. */
function ArticleVideo({ url, alt }: { url: string; alt: string }) {
  return (
    <video
      src={resolveImageUrl(url)}
      controls
      preload="metadata"
      playsInline
      className="w-full rounded-2xl border border-salon-card bg-salon-shell"
      aria-label={alt || "Article video"}
    />
  );
}

export default function MarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseMarkdown(content);

  if (!blocks.length) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `b${index}`;

        switch (block.kind) {
          case "heading": {
            const text = decorate(block.text, key);
            if (block.level === 2) {
              return (
                <h2
                  key={key}
                  className="mt-10 mb-3 font-display text-2xl tracking-tight text-salon-ink first:mt-0"
                >
                  {text}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3 key={key} className="mt-8 mb-2 font-display text-xl text-salon-ink first:mt-0">
                  {text}
                </h3>
              );
            }
            return (
              <h4 key={key} className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wider text-salon-ink">
                {text}
              </h4>
            );
          }

          case "quote":
            return (
              <blockquote
                key={key}
                className="my-6 border-l-2 border-salon-brand bg-salon-shell-soft px-5 py-4 font-display text-lg italic leading-relaxed text-salon-ink"
              >
                {withLineBreaks(block.text, key)}
              </blockquote>
            );

          case "list": {
            const items = block.items.map((item, itemIndex) => (
              <li key={`${key}-i${itemIndex}`} className="leading-relaxed">
                {decorate(item, `${key}-i${itemIndex}`)}
              </li>
            ));
            return block.ordered ? (
              <ol
                key={key}
                className="my-5 list-decimal space-y-2 pl-5 text-sm text-salon-muted marker:font-semibold marker:text-salon-brand"
              >
                {items}
              </ol>
            ) : (
              <ul
                key={key}
                className="my-5 list-disc space-y-2 pl-5 text-sm text-salon-muted marker:text-salon-brand"
              >
                {items}
              </ul>
            );
          }

          case "media":
            return block.video ? (
              <figure key={key} className="my-6">
                <ArticleVideo url={block.url} alt={block.alt} />
              </figure>
            ) : (
              <figure key={key} className="my-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-salon-card bg-salon-shell">
                  <CmsImage
                    value={block.url}
                    alt={block.alt || "Article image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
                {block.alt ? (
                  <figcaption className="mt-2 text-center text-[11px] text-salon-muted">
                    {block.alt}
                  </figcaption>
                ) : null}
              </figure>
            );

          case "rule":
            return <hr key={key} className="my-8 border-salon-card" />;

          default:
            return (
              <p key={key} className="my-4 text-sm leading-relaxed text-salon-muted first:mt-0 last:mb-0">
                {withLineBreaks(block.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}