import { PricingProvider } from "./page.client";
import PricingHeader from "./_components/header";
import Plans from "./_components/plans";
import PayAsYouGo from "./_components/payAsYouGo";
import FAQ from "./_components/faq";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PricingProvider>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-2">
          <PricingHeader />
          <Plans />
          <PayAsYouGo />
          <FAQ />
        </div>
      </PricingProvider>
    </div>
  );
}
