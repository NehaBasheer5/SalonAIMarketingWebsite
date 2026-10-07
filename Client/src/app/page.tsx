import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesOverview from "@/components/sections/home/FeaturesOverview";
import ProductPreview from "@/components/sections/home/ProductPreview";
import PricingSection from "@/components/sections/home/PricingSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import MobileAppShowcase from "@/components/sections/home/MobileAppShowcase";
import FaqSection from "@/components/sections/home/FaqSection";
import CtaBanner from "@/components/sections/home/CtaBanner";
import LatestPostsSection from "@/components/sections/home/LatestPostsSection";
import { getHomeContent, getBlogPosts, type HomeContent } from "@/lib/content";

export default async function Home() {
  // The blog teaser is independent of the home sections, so both load at once.
  const [{ content, hidden }, posts] = await Promise.all([getHomeContent(), getBlogPosts(3)]);

  const show = (key: keyof HomeContent) => !hidden.has(key);

  return (
    <main>
      {show("hero") ? <HeroSection content={content.hero} /> : null}
      {show("features_overview") ? <FeaturesOverview content={content.features_overview} /> : null}
      {show("product_preview") ? <ProductPreview content={content.product_preview} /> : null}
      {show("pricing") ? <PricingSection content={content.pricing} /> : null}
      {show("testimonials") ? <TestimonialsSection content={content.testimonials} /> : null}
      {show("mobile_app") ? <MobileAppShowcase content={content.mobile_app} /> : null}
      {show("faq") ? <FaqSection content={content.faq} /> : null}
      <LatestPostsSection posts={posts} />
      {show("cta_banner") ? <CtaBanner content={content.cta_banner} /> : null}
    </main>
  );
}
