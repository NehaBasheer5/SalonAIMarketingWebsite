import AboutHero from "@/components/sections/AboutUs/AboutHero";
import AboutMissionAndStats from "@/components/sections/AboutUs/AboutMissionAndStats";
import AboutJourneyTimeline from "@/components/sections/AboutUs/AboutJourneyTimeline";
import AboutTeamAndFeatures from "@/components/sections/AboutUs/AboutTeamAndFeatures";

export default function ClientAboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <AboutMissionAndStats />
      <AboutJourneyTimeline />
      <AboutTeamAndFeatures />
    </main>
  );
}