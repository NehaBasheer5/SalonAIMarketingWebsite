import React from "react";
import FaqHero from "@/components/sections/faq/FaqHero";
import FaqCategoriesContent from "@/components/sections/faq/FaqCategoriesContent";
import FaqSupportCta from "@/components/sections/faq/FaqSupportCta";
import { fetchCmsFaqs, fetchCmsFaqPageContent } from "@/lib/cms/faqs";

export default async function FaqPage() {
  const [faqs, cms] = await Promise.all([fetchCmsFaqs(), fetchCmsFaqPageContent()]);

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

  const categories = Array.isArray(categoriesSection.categories)
    ? (categoriesSection.categories as any[]).map((c: any, idx: number) => ({
        id: c.id || String(idx),
        label: c.label || c.name || "Category",
        icon: c.icon || "BookOpen",
        slug: c.slug || "",
      }))
    : [];

  const content = {
    eyebrow: (categoriesSection.eyebrow as string) || "Browse",
    heading: (categoriesSection.heading as string) || "Answers",
    heading_accent: (categoriesSection.heading_accent as string) || "by Category",
    subheading: (categoriesSection.subheading as string) || "Browse questions and answers.",
    categories,
    faqs: faqs.map((f: any) => ({ question: f.question, answer: f.answer })),
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
        }}
      />
    </main>
  );
}