import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogPostCard from "@/components/sections/blog/BlogPostCard";
import type { BlogPost } from "@/lib/content";

type Props = {
  posts: BlogPost[];
};

/**
 * Home page teaser for the blog.
 *
 * Fed by the same published `blog_posts` rows as the blog page, so an article
 * published in the admin shows up here without any extra wiring. Renders
 * nothing when the blog has no published articles.
 */
export default function LatestPostsSection({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <section className="w-full overflow-hidden border-t border-salon-card bg-salon-soft py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-9 bg-salon-rule" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salon-eyebrow">
                From the Blog
              </span>
            </div>
            <h2 className="font-display text-2xl tracking-tight text-salon-ink sm:text-3xl">
              Latest <span className="text-salon-accent">Articles</span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
          >
            View All Articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}