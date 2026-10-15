import "./globals.css";
import { DM_Sans, Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getFooterContent } from "@/lib/content";

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
  const { content, hidden } = await getFooterContent();

  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
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
