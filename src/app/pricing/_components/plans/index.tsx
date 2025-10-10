import Plan from "./plan";

const plans = {
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
      href:
        process.env.NODE_ENV === "development"
          ? "price_1SG4iaDxv6vHSwDTyc604Tl2"
          : "",
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
      href:
        process.env.NODE_ENV === "development"
          ? "price_1SG4iaDxv6vHSwDTyc604Tl2"
          : "",
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
      href:
        process.env.NODE_ENV === "development"
          ? "price_1SG4iaDxv6vHSwDTyc604Tl2"
          : "",
    },
  },
};

const Plans = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
      {Object.values(plans).map((plan) => (
        <Plan key={plan.title} {...plan} />
      ))}
    </div>
  );
};

export default Plans;
