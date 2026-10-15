import BlogPostCard from "@/components/sections/blog/BlogPostCard";
import { defaultBlogContent, type BlogContent, type BlogPost } from "@/lib/content";

type Props = {
  popular?: BlogContent["popular"];
  popularPosts: BlogPost[];
};

export default function BlogPopular({
  popular = defaultBlogContent.popular,
  popularPosts,
}: Props) {
  return (
    <section className="w-full overflow-hidden bg-salon-bg py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 xl:max-w-none xl:px-20 2xl:max-w-[1920px] 2xl:px-24">
        <div className="mb-8 flex items-center gap-3">
          <h2 className="font-display text-3xl tracking-tight text-salon-ink sm:text-4xl lg:text-5xl">
            {popular.heading}
          </h2>
        </div>

        {popularPosts.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-salon-muted">{popular.empty_message}</p>
        )}
      </div>
    </section>
  );
}
