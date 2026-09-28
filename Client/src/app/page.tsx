import HeroSection from "@/components/sections/home/HeroSection";
import FeaturesOverview from "@/components/sections/home/FeaturesOverview";
import ProductPreview from "@/components/sections/home/ProductPreview";
import MobileAppShowcase from "@/components/sections/home/MobileAppShowcase";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import PricingSection from "@/components/sections/home/PricingSection";
import FaqSection from "@/components/sections/home/FaqSection";
import CtaBanner from "@/components/sections/home/CtaBanner";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesOverview />
      <ProductPreview />
      <PricingSection />
      <TestimonialsSection />
      <MobileAppShowcase />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
