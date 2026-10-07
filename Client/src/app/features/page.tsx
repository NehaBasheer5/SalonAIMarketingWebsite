import React from "react";
import { Metadata } from "next";
import FeaturesHero from "@/components/sections/features/FeaturesHero";
import FeaturesGrid from "@/components/sections/features/FeaturesGrid";
import PlatformShowcase from "@/components/sections/features/PlatformShowcase";
import StatsBar from "@/components/sections/features/StatsBar";
import { getFeaturesContent, type FeaturesContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features | Avenque SalonAI - All-in-One Salon Platform",
  description: "Explore all features of Avenque SalonAI including online booking, staff management, loyalty programs, AI insights, and payment integration.",
};

export default async function FeaturesPage() {
  const { content, hidden } = await getFeaturesContent();

  const show = (key: keyof FeaturesContent) => !hidden.has(key);

  return (
    <main className="min-h-screen bg-salon-bg">
      {show("hero") ? <FeaturesHero content={content.hero} /> : null}
      {show("feature_grid") ? <FeaturesGrid content={content.feature_grid} /> : null}
      {show("platform_showcase") ? (
        <PlatformShowcase content={content.platform_showcase} />
      ) : null}
      {show("stats_bar") ? <StatsBar content={content.stats_bar} /> : null}
    </main>
  );
}
