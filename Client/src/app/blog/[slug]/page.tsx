import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import MarkdownContent from "@/components/ui/MarkdownContent";
import BlogCtaBanner from "@/components/sections/blog/BlogCtaBanner";
import BlogPostCard from "@/components/sections/blog/BlogPostCard";
import { getBlogContent, getBlogPost, resolveImageUrl } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/**
 * `generateMetadata` and the page body both need the article, and the CMS
 * response is uncached, so the read is wrapped in React's request scoped cache.
 * One HTTP call per request, and the CMS view counter increments once rather
 * than twice.
 */
const loadPost = cache((slug: string) => getBlogPost(slug));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadPost(slug);
  if (!result) return { title: "Article not found | SalonAI" };

  const { post } = result;
  // Uploads live on the Admin origin, so the raw CMS value would be a relative
  // path that no social scraper can resolve.
  const cover = resolveImageUrl(post.cover_image);

  return {
    title: `${post.title} | SalonAI Blog`,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      // A cover video cannot be scraped as an image, so the card is dropped.
      images: post.cover_video ? undefined : cover ? [cover] : undefined,
    },
  };
}

/**
 * Single article.
 *
 * The body is markdown authored in the Admin app, so it can contain images and
 * videos uploaded through the media library. Related reads at the foot come
 * from the same endpoint.
 */
export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [result, { content }] = await Promise.all([loadPost(slug), getBlogContent()]);

  if (!result) notFound();

  const { post, related } = result;

  return (
    <main className="min-h-screen bg-salon-bg">
      <article>
        <header className="w-full overflow-hidden border-b border-salon-card bg-salon-soft">
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {post.category ? (
                <span className="rounded-md bg-salon-tile px-2.5 py-1 text-[10px] font-semibold text-salon-brand-dark">
                  {post.category}
                </span>
              ) : null}
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-salon-card bg-white px-2.5 py-1 text-[10px] font-medium text-salon-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight text-salon-ink sm:text-5xl">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-4 text-base leading-relaxed text-salon-muted">{post.excerpt}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-salon-card pt-5 text-xs text-salon-muted">
              {post.author ? (
                <span className="flex items-center gap-2">
                  {/* The circle already existed; the upload fills it when the admin sets one. */}
                  <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-salon-tile">
                    <CmsImage
                      value={post.author_image}
                      alt={post.author}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </span>
                  <span className="font-semibold text-salon-ink">{post.author}</span>
                </span>
              ) : null}
              {post.date_label ? <span>{post.date_label}</span> : null}
              {post.read_time ? <span>{post.read_time}</span> : null}
              {post.view_count ? (
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.view_count} views
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {post.cover_video || post.cover_image ? (
          <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-salon-card bg-salon-shell">
              <CmsImage
                value={post.cover_video || post.cover_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-14">
          {post.content ? (
            <MarkdownContent content={post.content} />
          ) : (
            <p className="text-sm leading-relaxed text-salon-muted">
              This article has no content yet. Add it from the blog screen in the admin panel.
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-salon-card pt-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-1 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              Book a demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-12">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <h2 className="font-display text-2xl tracking-tight text-salon-ink">
                More from the <span className="text-salon-accent">blog</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.map((item) => (
                <BlogPostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <BlogCtaBanner content={content.cta_banner} />
    </main>
  );
}