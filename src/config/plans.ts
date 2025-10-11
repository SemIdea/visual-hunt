export type Plan = {
  title: string;
  description: string;
  price: number;
  features: Record<string, boolean>;
  cta: {
    label: string;
    priceId: { 
      monthly: string;
      yearly: string;
    };
  };
  highlighted?: boolean;
};

export const plans: Record<"basic" | "pro" | "expert", Plan> = {
  basic: {
    title: "Basic plan",
    description: "For casual users",
    price: 9.99,
    features: {
      "20 Image Searches / month": true,
      "Standard Search Speed": true,
      "Save Search History": true,
      "Video Search": false,
      "Multi-Engine Analysis": false,
    },
    cta: {
      label: "Get Started",
      priceId: {
        monthly: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || "",
        yearly: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || "",
      },
    },
  },
  pro: {
    title: "Pro Plan",
    description: "For power users, creators, and professionals.",
    price: 19.99,
    features: {
      "Unlimited Image Searches": true,
      "50 Video Searches / month": true,
      "Priority Search Speed": true,
      "Multi-Engine Analysis": true,
      "Save Search History": true,
    },
    cta: {
      label: "Get Started",
      priceId: {
        monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
        yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
      },
    },
    highlighted: true,
  },
  expert: {
    title: "Expert Plan",
    description: "For heavy-duty users and small teams.",
    price: 39.99,
    features: {
      "Unlimited Image Searches": true,
      "200 Video Searches / month": true,
      "Highest Priority Search Speed": true,
      "Multi-Engine Analysis": true,
      "Save Search History": true,
    },
    cta: {
      label: "Get Started",
      priceId: {
        monthly: process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID || "",
        yearly: process.env.STRIPE_EXPERT_YEARLY_PRICE_ID || "",
      },
    },
  },
};
