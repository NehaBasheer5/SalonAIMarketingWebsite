"use client";

import React from "react";
import FaqHero from "@/components/sections/faq/FaqHero";
import FaqCategoriesContent from "@/components/sections/faq/FaqCategoriesContent";
import FaqSupportCta from "@/components/sections/faq/FaqSupportCta";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-salon-bg">
      <FaqHero />
      <FaqCategoriesContent />
      <FaqSupportCta />
    </main>
  );
}