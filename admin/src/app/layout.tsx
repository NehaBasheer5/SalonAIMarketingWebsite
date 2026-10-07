import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-admin-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SalonAI Admin CMS",
  description: "Content management for the SalonAI marketing website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-100 font-sans text-slate-900">{children}</body>
    </html>
  );
}
