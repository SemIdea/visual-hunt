import Features from "@/app/(home)/_components/features";
import Slogan from "@/app/(home)/_components/hero";
import Arc from "@/components/arc";
import CTA from "./_components/CTA";
import FAQ from "./_components/FAQ";
import HowItWorks from "./_components/howItWorks";
import SocialProof from "./_components/social-proof";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Arc />
            <Slogan />
            <SocialProof />
            <HowItWorks />
            <Features />
            <FAQ />
            <CTA />
        </div>
    );
}
