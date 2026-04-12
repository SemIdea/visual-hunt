import FAQ from "./_components/faq";
import PricingHeader from "./_components/header";
import PayAsYouGo from "./_components/payAsYouGo";
import Plans from "./_components/plans";
import { PricingProvider } from "./page.client";

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
