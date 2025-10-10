import { BillingToggle } from "../../page.client";

const PricingHeader = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
        Find the Perfect Plan
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
        Start for free, or unlock powerful features with our Pro plan. Cancel
        anytime.
      </p>
      <BillingToggle />
    </div>
  );
};

export default PricingHeader;
