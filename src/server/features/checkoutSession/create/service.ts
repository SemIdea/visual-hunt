import { UserEntity } from "@/server/entities/user/entity";
import { ICreateCheckoutSessionDTO } from "./DTO";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CreateCheckoutSessionService = async ({
  repositories,
  ...data
}: ICreateCheckoutSessionDTO) => {
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

  var stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name!,
    });

    console.log("Created new Stripe customer:", customer);

    stripeCustomerId = customer.id;

    await UserEntity.update({
      id: user.id,
      data: {
        stripeCustomerId: customer.id,
      },
      repositories: {
        ...repositories,
        database: repositories.user,
      },
    });
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
      success_url: `http://localhost:3000/dashboard?success=true`,
      cancel_url: `http://localhost:3000/pricing?canceled=true`,
      adaptive_pricing: {
        enabled: true,
      },
    });

    return checkoutSession.url;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error("Failed to create checkout session", {
      cause: error,
    } as any);
  }
};

export { CreateCheckoutSessionService };
