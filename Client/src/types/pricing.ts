export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  description?: string;
  isPopular?: boolean;
  buttonText: string;
}