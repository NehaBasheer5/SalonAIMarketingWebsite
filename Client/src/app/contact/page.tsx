import ContactHero from "@/components/sections/contact/ContactHero";
import ContactFormSection from "@/components/sections/contact/ContactFormSection";
import LocationMapSection from "@/components/sections/contact/LocationMapSection";
import ContactCtaBanner from "@/components/sections/contact/ContactCtaBanner";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <ContactHero />
      <ContactFormSection />
      <LocationMapSection />
      <ContactCtaBanner />
    </main>
  );
}