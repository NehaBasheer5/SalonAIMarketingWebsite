import React from "react";
import { Metadata } from "next";
import FeaturesHero from "@/components/sections/features/FeaturesHero";
import FeaturesGrid from "@/components/sections/features/FeaturesGrid";
import PlatformShowcase from "@/components/sections/features/PlatformShowcase";
import StatsBar from "@/components/sections/features/StatsBar";
import FeaturesCta from "@/components/sections/features/FeaturesCta";


export const metadata: Metadata = {
  title: "Features | Avenque SalonAI - All-in-One Salon Platform",
  description: "Explore all features of Avenque SalonAI including online booking, staff management, loyalty programs, AI insights, and payment integration.",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      <FeaturesHero />
      <FeaturesGrid />
      <PlatformShowcase />
      <StatsBar />
      <FeaturesCta />
    </main>
  );
}