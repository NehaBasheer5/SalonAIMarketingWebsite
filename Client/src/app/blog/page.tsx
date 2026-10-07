import type { Metadata } from "next";
import BlogHero from "@/components/sections/blog/BlogHero";
import BlogCategories from "@/components/sections/blog/BlogCategories";
import BlogNewsletterAndPopular from "@/components/sections/blog/BlogNewsletterAndPopular";
import BlogCtaBanner from "@/components/sections/blog/BlogCtaBanner";
import {
  getBlogContent,
  getBlogFeed,
  pickFeaturedPost,
  resolveBlogCategories,
  type BlogCategoryOption,
} from "@/lib/content";

/**
 * Blog index.
 *
 * The copy and layout come from the `blog` page sections in the CMS, and the
 * articles themselves come from `blog_posts` via the Admin public API. Both
 * fall back to built-in content when the CMS is unreachable.
 *
 * The category filters are resolved here so the hero dropdown and the chips
 * below it are driven by one list: pick a category under Pages > Blog, drop the
 * matching filter value on a post, and it shows up on this page.
 */
export default async function BlogPage() {
  const [{ content, hidden }, feed] = await Promise.all([getBlogContent(), getBlogFeed()]);
  const posts = feed.posts;
  const show = (key: keyof typeof content) => !hidden.has(key);

  // The featured article is shown in the hero, so the grid lists everything else
  // first and only falls back to including it when the hero is hidden.
  const featured = pickFeaturedPost(posts);
  const gridPosts = featured && show("hero")
    ? posts.filter((post) => post.id !== featured.id)
    : posts;

  const options = resolveBlogCategories(content.categories.items, posts, feed.categories);

  // The chip list is configured with a blank-slug entry that means "no filter",
  // so it is turned into a real option here rather than matching any category.
  const allItem = content.categories.items.find((item) => !item?.slug);
  const allOption: BlogCategoryOption = {
    label: allItem?.label || "All Posts",
    value: "",
    keys: [],
    icon: allItem?.icon || "LayoutGrid",
    count: posts.length,
  };
  const categories = [allOption, ...options];

  return (
    <main className="min-h-screen bg-salon-bg">
      {show("hero") ? (
        <BlogHero content={content.hero} featured={featured} categories={categories} />
      ) : null}
      {show("categories") || show("latest") ? (
        <BlogCategories
          content={content.categories}
          latest={content.latest}
          posts={gridPosts}
          categories={categories}
        />
      ) : null}
      {show("newsletter") || show("popular") ? (
        <BlogNewsletterAndPopular
          newsletter={content.newsletter}
          popular={content.popular}
          popularPosts={posts.slice(0, 3)}
        />
      ) : null}
      {show("cta_banner") ? <BlogCtaBanner content={content.cta_banner} /> : null}
    </main>
  );
}

/** Titles and copy come from the hero section, so the admin controls the SEO too. */
export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getBlogContent();
  const { hero } = content;
  const title = [hero.heading, hero.heading_accent].filter(Boolean).join(" ");

  return {
    title: `${title} | SalonAI Blog`,
    description: hero.subheading || undefined,
    openGraph: {
      title: `${title} | SalonAI Blog`,
      description: hero.subheading || undefined,
      type: "website",
    },
  };
}