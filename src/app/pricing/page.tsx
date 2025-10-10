import { PricingProvider } from "./page.client";
import PricingHeader from "./_components/header";
import Plans from "./_components/plans";
import PayAsYouGo from "./_components/payAsYouGo";
import FAQ from "./_components/faq";

export default function PricingPage() {
  return (
    <PricingProvider>
      <div className="container mx-auto px-4 z-2">
        <PricingHeader />
        <Plans />
        <PayAsYouGo />
        <FAQ />
      </div>
    </PricingProvider>
  );
}
