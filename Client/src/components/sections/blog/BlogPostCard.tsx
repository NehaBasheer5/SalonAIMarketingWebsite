import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import type { BlogPost } from "@/lib/content";
import { fallbackImages } from "@/lib/content";

type Props = {
  post: BlogPost;
};

/** Author, date and read time, shared by the card and the blog hero. */
export function BlogPostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-salon-muted">
      {post.author ? <span className="font-semibold text-salon-ink">{post.author}</span> : null}
      {post.author && post.date_label ? <span>•</span> : null}
      {post.date_label ? <span>{post.date_label}</span> : null}
      {post.read_time ? <span>• {post.read_time}</span> : null}
    </div>
  );
}

/** Article card used on the blog index, the related reads and the home teaser. */
export default function BlogPostCard({ post }: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(91,64,39,0.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(91,64,39,0.14)]">
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-salon-tile">
        {/* A cover video wins over the cover image when both are set. */}
        <CmsImage
          value={post.cover_video || post.cover_image}
          fallback={fallbackImages.blog_cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 85vw, 340px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-salon-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {post.tags.length ? (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-salon-shell px-2.5 py-0.5 text-[12px] font-medium text-salon-brand-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <h3 className="line-clamp-2 text-base font-semibold text-salon-ink transition group-hover:text-salon-brand">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-[19px] leading-relaxed text-salon-muted">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <BlogPostMeta post={post} />
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-salon-shell text-salon-brand transition group-hover:bg-salon-brand group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}