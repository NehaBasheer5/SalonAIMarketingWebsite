import Link from "next/link";
import CmsImage from "@/components/ui/CmsImage";
import type { BlogPost } from "@/lib/content";
import { fallbackImages } from "@/lib/content";

type Props = {
  post: BlogPost;
  /** Shown as a small chip in the corner of the card. */
  tag?: string;
};

/** Author, date and read time, shared by the card and the blog hero. */
export function BlogPostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-salon-muted">
      {post.author ? <span className="font-semibold text-salon-ink">{post.author}</span> : null}
      {post.author && post.date_label ? <span>•</span> : null}
      {post.date_label ? <span>{post.date_label}</span> : null}
      {post.read_time ? <span>• {post.read_time}</span> : null}
    </div>
  );
}

/** Article card used on the blog index, the related reads and the home teaser. */
export default function BlogPostCard({ post, tag }: Props) {
  const label = tag || post.category;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-salon-card bg-white/80 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_34px_rgba(91,64,39,0.1)]">
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-salon-tile">
        {/* A cover video wins over the cover image when both are set. */}
        <CmsImage
          value={post.cover_video || post.cover_image}
          fallback={fallbackImages.blog_cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
        {label ? (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-salon-brand backdrop-blur-sm">
            {label}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-salon-ink transition group-hover:text-salon-brand">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-salon-muted">
              {post.excerpt}
            </p>
          ) : null}
          {post.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-salon-shell px-2 py-0.5 text-[10px] font-medium text-salon-brand-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="border-t border-salon-card pt-3">
          <BlogPostMeta post={post} />
        </div>
      </div>
    </article>
  );
}