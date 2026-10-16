import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CmsImage from "@/components/ui/CmsImage";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { getFeaturePost, resolveImageUrl } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

/**
 * `generateMetadata` and the page body both need the feature, and the CMS
 * response is uncached, so the read is wrapped in React's request scoped cache
 * (one HTTP call per request).
 */
const loadPost = cache((slug: string) => getFeaturePost(slug));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadPost(slug);
  if (!result) return { title: "Feature not found | SalonAI" };

  const { post } = result;
  // Uploads live on the Admin origin, so the raw CMS value would be a relative
  // path that no social scraper can resolve.
  const image = resolveImageUrl(post.image_url);

  return {
    title: `${post.title} | SalonAI Features`,
    description: post.description || undefined,
    alternates: { canonical: `/features/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      type: "article",
      images: image ? [image] : undefined,
    },
  };
}

/**
 * Single feature detail page, opened by "Learn more" on the features grid.
 *
 * The card fields form the header, and the body is markdown authored in the
 * Admin app, so it can carry images and videos uploaded through the media
 * library. Every feature is listed together on the /features grid.
 */
export default async function FeaturePostPage({ params }: Params) {
  const { slug } = await params;
  const result = await loadPost(slug);

  if (!result) notFound();

  const { post, related } = result;

  return (
    <main className="min-h-screen bg-salon-bg">
      <article>
        <header className="w-full">
          <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to features
            </Link>

            <h1 className="mt-6 text-center font-display text-4xl leading-[1.1] tracking-tight text-salon-ink sm:text-5xl">
              {post.title}
            </h1>

            {post.description ? (
              <p className="mt-4 text-center text-base leading-relaxed text-salon-muted">{post.description}</p>
            ) : null}
          </div>
        </header>

        {resolveImageUrl(post.image_url) ? (
          <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-salon-card bg-salon-shell">
              <CmsImage
                value={post.image_url}
                alt={post.image_alt || post.title}
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
              This feature has no detail content yet. Add it from the features posts screen in the
              admin panel.
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-salon-card pt-6">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All features
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
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
            <div className="mb-8">
              <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
                Explore more features
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.slice(0, 3).map((item) => {
                const linkHref = /^https?:\/\//i.test(item.href || "")
                  ? item.href
                  : `/features/${item.slug}`;
                return (
                  <article
                    key={`${item.id}-${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(91,64,39,0.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(91,64,39,0.14)]"
                  >
                    <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-salon-tile">
                      <CmsImage
                        value={item.image_url}
                        alt={item.image_alt || item.title}
                        fill
                        sizes="(max-width: 768px) 85vw, 340px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {item.category ? (
                        <span className="mb-2.5 w-fit rounded-full bg-salon-shell px-2.5 py-0.5 text-[12px] font-medium text-salon-brand-dark">
                          {item.category}
                        </span>
                      ) : null}
                      <h3 className="line-clamp-2 text-base font-semibold text-salon-ink transition group-hover:text-salon-brand">
                        <Link href={linkHref || "/features"}>{item.title}</Link>
                      </h3>
                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-salon-muted">
                          {item.description}
                        </p>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                        <span className="text-[12px] font-semibold uppercase tracking-wider text-salon-brand-dark">
                          Learn more
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-salon-shell text-salon-brand transition group-hover:bg-salon-brand group-hover:text-white">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

