import { UserEntity } from "@/server/entities/user/entity";
import { ICreateCheckoutSessionDTO } from "./DTO";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CreateCheckoutSessionService = async ({
  repositories,
  ...data
}: ICreateCheckoutSessionDTO) => {
  console.log("CreateCheckoutSessionService called with:", data);

  const user = await UserEntity.read({
    id: data.userId,
    repositories: {
      ...repositories,
      database: repositories.user,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [{ price: data.priceId, quantity: 1 }],
      customer_email: user.email!,
      metadata: {
        userId: user.id,
      },
      payment_method_types: ["card"],
      mode: "subscription", // Important: this sets up a recurring payment
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
      adaptive_pricing: {
        enabled: true,
      },
    });

    return checkoutSession.url;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error("Failed to create checkout session", {
      cause: error,
    });
  }
};

export { CreateCheckoutSessionService };
