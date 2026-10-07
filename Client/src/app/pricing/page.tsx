import PricingExperience from "@/components/sections/pricing/PricingExperience";
import PricingComparison from "@/components/sections/pricing/PricingComparison";
import PricingBanner from "@/components/sections/pricing/PricingBanner";
import PricingFaqCta from "@/components/sections/pricing/PricingFaqCta";
import { getPricingContent } from "@/lib/content";

/** Hero copy doubles as the page title/description so edits in the CMS stick. */
export async function generateMetadata() {
  const { content } = await getPricingContent();
  const title = content.hero.heading
    ? `${content.hero.heading}${content.hero.heading_accent ? ` ${content.hero.heading_accent}` : ""} - SalonAI`
    : "Pricing - SalonAI by Avenque";

  return {
    title,
    description: content.hero.subheading,
    alternates: { canonical: "/pricing" },
  };
}

export default async function PricingPage() {
  const { content, hidden } = await getPricingContent();
  const { hero, pricing_cards } = content;

  return (
    <main className="min-h-screen bg-salon-bg">
      <PricingExperience
        hero={hero}
        plans={pricing_cards.plans}
        emptyMessage={pricing_cards.empty_message}
        showHero={!hidden.has("hero")}
        showPlans={!hidden.has("pricing_cards")}
      />
      {!hidden.has("comparison") ? <PricingComparison {...content.comparison} /> : null}
      {!hidden.has("banner") ? <PricingBanner {...content.banner} /> : null}
      {!hidden.has("faq_cta") ? <PricingFaqCta {...content.faq_cta} /> : null}
    </main>
  );
}
