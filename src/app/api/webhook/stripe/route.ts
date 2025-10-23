import { helpers } from "@/server/container/helpers";
import { repositories } from "@/server/container/repositories";
import { SessionEntity } from "@/server/entities/session/entity";
import { SubscriptionEntity } from "@/server/entities/subscription/entity";
import { UserEntity } from "@/server/entities/user/entity";
import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}
if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

const parseStatus = (
  status: Stripe.Subscription.Status
): SubscriptionStatus => {
  switch (status) {
    case "active":
    case "trialing":
      return "ACTIVE";
    case "canceled":
    case "incomplete_expired":
    case "unpaid":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    default:
      // Default to CANCELED to be safe.
      return "CANCELED";
  }
};

async function syncSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  const firstItem = subscription.items.data[0];
  if (!firstItem) {
    console.error(
      `Stripe subscription ${subscription.id} has no items; cannot sync.`
    );
    return;
  }

  const subscriptionData = {
    stripeSubscriptionId: subscription.id,
    stripePriceId: firstItem.price.id,
    status: parseStatus(subscription.status),
    currentPeriodEnd: new Date(firstItem.current_period_end * 1000),
  };

  const existingSub = await SubscriptionEntity.readByUserId({
    userId,
    repositories: {
      ...repositories,
      database: repositories.subscription,
    },
  });

  if (existingSub) {
    await SubscriptionEntity.updateByUserId({
      userId,
      data: subscriptionData,
      repositories: {
        ...repositories,
        database: repositories.subscription,
      },
    });
    console.log(`Updated subscription for user ${userId}`);
  } else {
    await SubscriptionEntity.create({
      id: helpers.uid.generate(),
      data: {
        ...subscriptionData,
        userId,
      },
      repositories: {
        ...repositories,
        database: repositories.subscription,
      },
    });
    console.log(`Created new subscription for user ${userId}`);
  }

  await SessionEntity.invalidateAllSessionsCache({
    userId,
    repositories: {
      ...repositories,
      database: repositories.session,
    },
  });
  console.log(`Invalidated session cache for user ${userId}`);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error(
      "checkout.session.completed: Webhook missing metadata.userId."
    );
    return;
  }

  const user = await UserEntity.read({
    id: userId,
    repositories: {
      ...repositories,
      database: repositories.user,
    },
  });

  if (!user) {
    console.error(`checkout.session.completed: User ${userId} not found.`);
    return;
  }

  if (!session.subscription) {
    console.error(
      `checkout.session.completed: Session ${session.id} has no subscription.`
    );
    return;
  }

  if (!user.stripeCustomerId && session.customer) {
    await UserEntity.update({
      id: userId,
      data: { stripeCustomerId: session.customer as string },
      repositories: {
        ...repositories,
        database: repositories.user,
      },
    });
    console.log(`Updated stripeCustomerId for user ${userId}`);
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  await syncSubscription(userId, subscription);

  console.log(
    `Processed checkout.session.completed for user ${userId} (sub ${subscription.id})`
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const user = await UserEntity.readBySubscriptionId({
    subscriptionId: subscription.id,
    repositories: {
      ...repositories,
      database: repositories.user,
    },
  });

  if (!user) {
    console.error(
      `customer.subscription.updated: Could not find user for subscription ${subscription.id}`
    );
    return;
  }

  await syncSubscription(user.id, subscription);

  console.log(
    `Processed customer.subscription.updated for user ${user.id} (sub ${subscription.id})`
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature || !body) {
    return NextResponse.json(
      { error: "Invalid Stripe payload/signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      // case "customer.subscription.deleted":
      //   // Handle final deletion
      //   break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing webhook ${event.id}:`, error);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
