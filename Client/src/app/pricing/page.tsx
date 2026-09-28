"use client";

import React, { useState } from "react";
import PricingHero from "@/components/sections/pricing/PricingHero";
import PricingCards from "@/components/sections/pricing/PricingCards";
import PricingComparison from "@/components/sections/pricing/PricingComparison";
import PricingBanner from "@/components/sections/pricing/PricingBanner";
import PricingFaqCta from "@/components/sections/pricing/PricingFaqCta";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <main className="min-h-screen bg-white">
      <PricingHero billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
      <PricingCards billingCycle={billingCycle} />
      <PricingComparison />
      <PricingBanner />
      <PricingFaqCta />
    </main>
  );
}