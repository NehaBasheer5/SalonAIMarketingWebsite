import ContactHero from "@/components/sections/contact/ContactHero";
import ContactFormSection from "@/components/sections/contact/ContactFormSection";
import LocationMapSection from "@/components/sections/contact/LocationMapSection";
import ContactCtaBanner from "@/components/sections/contact/ContactCtaBanner";
import { getContactContent } from "@/lib/content";
import { resolveImageUrl, isVideoPath } from "@/lib/content";

export const metadata = {
  title: "Contact Us - SalonAI by Avenque",
  description: "Reach out to SalonAI for a demo, support, or sales. We help salons streamline bookings, staff, and growth with AI.",
};

export default async function ContactPage() {
  const { content, hidden } = await getContactContent();

  return (
    <main className="min-h-screen bg-salon-bg">
      {!hidden.has("hero") ? (
        <ContactHero {...content.hero} />
      ) : null}
      {!hidden.has("contact_form") ? (
        <ContactFormSection {...content.contact_form} />
      ) : null}
      {!hidden.has("location_map") ? (
        <LocationMapSection {...content.location_map} />
      ) : null}
      {!hidden.has("cta_banner") ? (
        <ContactCtaBanner {...content.cta_banner} />
      ) : null}
    </main>
  );
}