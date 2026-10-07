"use client";

import PricingPlanEditor from "@/components/PricingPlanEditor";

/**
 * Pricing shortcut in the sidebar.
 *
 * This screen manages the pricing packages only, from the `pricing_plans`
 * table. The page copy around them (hero, comparison table, banner and FAQ) is
 * edited under Pages -> Pricing, and both are served to the marketing site
 * through the public content and pricing APIs.
 */
export default function PricingAdminPage() {
  return <PricingPlanEditor />;
}
