import "./globals.css";
import { DM_Sans, Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getFooterContent, getSiteSettings, resolveImageUrl } from "@/lib/content";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "SalonAI | Empower Your Salon Business",
  description:
    "Simplify bookings, manage staff, delight your customers and grow your salon with SalonAI.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ content, hidden }, settings] = await Promise.all([
    getFooterContent(),
    getSiteSettings(),
  ]);

  const navSettings = {
    logoSrc: resolveImageUrl(settings.logo_url),
    logoAlt: settings.logo_alt || settings.brand_name,
    brandName: settings.brand_name,
    brandAccent: settings.brand_accent,
    tagline: settings.tagline,
    navItems: settings.nav_items
      .filter((item) => item.is_visible)
      .map((item) => ({ label: item.label, href: item.href })),
    secondary: { label: settings.secondary_label, href: settings.secondary_href },
    cta: { label: settings.cta_label, href: settings.cta_href },
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased">
        <Navbar {...navSettings} />
        {children}
        <Footer
          content={content.footer}
          newsletter={content.newsletter}
          showNewsletter={!hidden.has("newsletter")}
        />
      </body>
    </html>
  );
}
