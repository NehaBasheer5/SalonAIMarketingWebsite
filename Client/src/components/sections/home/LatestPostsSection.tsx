"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
 * nothing when the blog has no published articles. All articles sit in a
 * horizontal rail that auto-scrolls right-to-left and can also be dragged
 * with the cursor; it pauses on hover.
 */
export default function LatestPostsSection({ posts }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const moved = useRef(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      const el = scrollerRef.current;
      if (el && !pausedRef.current && !draggingRef.current) {
        el.scrollLeft += 0.6;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || e.pointerType === "touch") return;
    draggingRef.current = true;
    setDragging(true);
    moved.current = false;
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 4) moved.current = true;
    el.scrollLeft = startScroll.current - delta;
    const half = el.scrollWidth / 2;
    if (half > 0) {
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft < 0) el.scrollLeft += half;
    }
  };

  const endDrag = () => {
    draggingRef.current = false;
    setDragging(false);
  };

  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  };

  if (!posts.length) return null;

  const loopPosts = [...posts, ...posts];

  return (
    <section className="w-full overflow-hidden bg-salon-bg py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8 flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
              Latest{" "}
              <span className="bg-gradient-to-r from-salon-ink via-salon-gold to-salon-tile bg-clip-text text-transparent">
                Articles
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-[19px] text-salon-muted">
              Expert tips, industry trends and product updates to help you run a smarter, more
              profitable salon.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-salon-brand underline-offset-4 hover:underline"
          >
            View All Articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="relative -mx-5 sm:-mx-8">
          <div
            ref={scrollerRef}
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => {
              pausedRef.current = false;
              endDrag();
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onDragStart={(e) => e.preventDefault()}
            onClickCapture={onClickCapture}
            className={`flex items-stretch gap-4 overflow-x-auto px-5 pb-4 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              dragging ? "cursor-grabbing select-none" : "cursor-grab"
            }`}
          >
            {loopPosts.map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="w-[80vw] max-w-[340px] shrink-0 sm:w-[340px]"
              >
                <BlogPostCard post={post} />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-salon-bg to-transparent sm:w-8" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-salon-bg to-transparent sm:w-8" />
        </div>
      </div>
    </section>
  );
}
