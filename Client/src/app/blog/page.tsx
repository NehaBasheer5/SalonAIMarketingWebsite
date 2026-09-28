import BlogHero from "@/components/sections/blog/BlogHero";
import BlogCategories from "@/components/sections/blog/BlogCategories";
import LatestArticles from "@/components/sections/blog/LatestArticles";
import BlogNewsletterAndPopular from "@/components/sections/blog/BlogNewsletterAndPopular";
import BlogCtaBanner from "@/components/sections/blog/BlogCtaBanner";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <BlogHero />
      <BlogCategories />
      <LatestArticles />
      <BlogNewsletterAndPopular />
      <BlogCtaBanner />
    </main>
  );
}