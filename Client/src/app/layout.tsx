import "./globals.css";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getFooterContent } from "@/lib/content";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
  const { content, hidden } = await getFooterContent();

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
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
