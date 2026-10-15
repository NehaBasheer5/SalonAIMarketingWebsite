import React from "react";
import FaqHero from "@/components/sections/faq/FaqHero";
import FaqCategoriesContent from "@/components/sections/faq/FaqCategoriesContent";
import FaqSupportCta from "@/components/sections/faq/FaqSupportCta";
import { fetchCmsFaqs, fetchCmsFaqPageContent, fetchCmsFaqCategories } from "@/lib/cms/faqs";
import { defaultFaqPageContent } from "@/lib/content";

export default async function FaqPage() {
  const [faqs, cms, categoryDefs] = await Promise.all([
    fetchCmsFaqs(),
    fetchCmsFaqPageContent(),
    fetchCmsFaqCategories(),
  ]);

  const hero = cms?.hero ?? {};
  const categoriesSection = cms?.categories ?? {};

  const heroContent = {
    eyebrow: (hero.eyebrow as string) || "FAQ",
    heading: (hero.heading as string) || "Got Questions?",
    heading_accent: (hero.heading_accent as string) || "We've Got Answers",
    subheading:
      (hero.subheading as string) ||
      "Find quick answers to the most common questions about SalonAI. Can't find what you're looking for? Feel free to contact our team.",
    search_placeholder: (hero.search_placeholder as string) || "Search for answers...",
    search_label: (hero.search_label as string) || "Search",
    image_url: (hero.image_url as string) || "",
    image_alt: (hero.image_alt as string) || "",
  };

  // When the `faqs` table is empty (and the CMS has no questions), fall back to
  // the bundled set so the page still renders categories and answers.
  const useFallback = faqs.length === 0;

  const categories = (useFallback ? defaultFaqPageContent.categories : categoryDefs).map((c) => ({
    id: c.id,
    label: c.label,
    icon: c.icon,
    slug: c.slug || "",
  }));

  const content = {
    eyebrow: (categoriesSection.eyebrow as string) || defaultFaqPageContent.eyebrow,
    heading: (categoriesSection.heading as string) || defaultFaqPageContent.heading,
    heading_accent:
      (categoriesSection.heading_accent as string) || defaultFaqPageContent.heading_accent,
    subheading:
      (categoriesSection.subheading as string) || defaultFaqPageContent.subheading,
    categories,
    faqs: useFallback
      ? defaultFaqPageContent.faqs
      : faqs.map((f) => ({ question: f.question, answer: f.answer, category: f.category ?? "" })),
  };

  const cta = cms?.cta_banner ?? {};

  return (
    <main className="min-h-screen bg-salon-bg">
      <FaqHero content={heroContent} />
      <FaqCategoriesContent content={content} faqsFromDb={faqs} />
      <FaqSupportCta
        content={{
          eyebrow: (cta.eyebrow as string) || "Still have questions?",
          heading: (cta.heading as string) || "Our Support Team is Here to",
          heading_accent: (cta.heading_accent as string) || "Help",
          subheading:
            (cta.subheading as string) ||
            "Can't find the answer you're looking for? Get in touch with our friendly support team and we'll be happy to assist you.",
          cta_label: (cta.cta_label as string) || "Contact Support →",
          cta_href: (cta.cta_href as string) || "/contact",
          secondary_cta_label: (cta.secondary_cta_label as string) || "Book a Demo",
          secondary_cta_href: (cta.secondary_cta_href as string) || "/request-demo",
          image_url: (cta.image_url as string) || "",
          image_alt: (cta.image_alt as string) || "SalonAI support team",
        }}
      />
    </main>
  );
}