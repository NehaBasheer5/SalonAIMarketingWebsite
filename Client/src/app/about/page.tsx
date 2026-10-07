import React from "react";
import { Metadata } from "next";
import AboutHero from "@/components/sections/AboutUs/AboutHero";
import AboutMissionAndStats from "@/components/sections/AboutUs/AboutMissionAndStats";
import AboutJourneyTimeline from "@/components/sections/AboutUs/AboutJourneyTimeline";
import AboutTeam from "@/components/sections/AboutUs/AboutTeam";
import AboutWhyChoose from "@/components/sections/AboutUs/AboutWhyChoose";
import { getAboutContent, type AboutContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | Avenque SalonAI - Building Intelligent Salon Solutions",
  description:
    "Learn about SalonAI's mission, our journey and the team building intelligent software solutions for modern salons.",
};

export default async function ClientAboutPage() {
  const { content, hidden } = await getAboutContent();

  const show = (key: keyof AboutContent) => !hidden.has(key);

  return (
    <main className="min-h-screen bg-salon-bg">
      {show("hero") ? <AboutHero content={content.hero} /> : null}
      {show("mission_stats") ? <AboutMissionAndStats content={content.mission_stats} /> : null}
      {show("journey") ? <AboutJourneyTimeline content={content.journey} /> : null}
      {show("team") ? <AboutTeam content={content.team} /> : null}
      {show("why_choose") ? <AboutWhyChoose content={content.why_choose} /> : null}
    </main>
  );
}
