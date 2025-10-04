import Features from "@/app/(home)/_components/features";
import Slogan from "@/app/(home)/_components/slogan";
import SocialProof from "./_components/social";
import HowItWorks from "./_components/howItWorks";
import FAQ from "./_components/FAQ";
import CTA from "./_components/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Slogan />
      <SocialProof />
      <HowItWorks />
      <Features />
      <FAQ />
      <CTA />
    </div>
  );
}
