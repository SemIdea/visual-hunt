import { prisma } from "@/server/drivers/prisma";
import { NextResponse } from "next/server";
import { SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Maps a Stripe subscription status to the corresponding status in your Prisma schema.
 * This is a safer and more explicit way to handle status changes.
 * @param {Stripe.Subscription.Status} stripeStatus - The status from the Stripe subscription object.
 * @returns {SubscriptionStatus | null} - The matching Prisma enum status, or null if unhandled.
 */
function mapStripeStatusToPrismaStatus(
  stripeStatus: Stripe.Subscription.Status
): SubscriptionStatus | null {
  const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "INCOMPLETE_EXPIRED",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
    unpaid: "UNPAID",
    paused: "PAUSED",
  };
  return statusMap[stripeStatus] || null;
}

/**
 * Retrieves a subscription from Stripe and upserts its details into your local database.
 * This function is the single source of truth for synchronizing Stripe subscription data.
 * @param {string} subscriptionId - The ID of the Stripe subscription.
 */
async function manageSubscriptionStatusChange(subscriptionId: string) {
  const subscription = (await stripe.subscriptions.retrieve(
    subscriptionId
  )) as Stripe.Subscription;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
    select: { id: true },
  });

  if (!user) {
    console.error(
      `Webhook Error: User not found for customer ID: ${subscription.customer}`
    );
    return;
  }

  const prismaStatus = mapStripeStatusToPrismaStatus(subscription.status);

  if (!prismaStatus) {
    console.error(
      `Webhook Error: Unhandled Stripe subscription status: ${subscription.status}`
    );
    return;
  }

  // **THE FIX IS HERE**
  // Access the period end from the first subscription item, as shown in your data.
  // Also, add a safety check to ensure items exist.
  const subscriptionItem = subscription.items.data[0];
  if (!subscriptionItem) {
    console.error(
      `Webhook Error: Subscription ${subscription.id} has no items.`
    );
    return;
  }
  // This value is guaranteed to exist on a subscription item.
  const currentPeriodEnd = new Date(subscriptionItem.current_period_end * 1000);

  const subscriptionData = {
    userId: user.id,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscriptionItem.price.id,
    status: prismaStatus,
    currentPeriodEnd: currentPeriodEnd,
  };

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: subscriptionData,
    update: subscriptionData,
  });

  console.log(
    `Successfully upserted subscription ${subscription.id} for user ${user.id}`
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
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle relevant subscription events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) {
        console.error(
          "checkout.session.completed webhook missing metadata.userId; cannot attach subscription"
        );
        break; // acknowledge webhook without throwing (prevents Stripe retries spam)
      }

      // Ensure the user exists (and optionally attach the stripeCustomerId if missing)
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        console.error(
          `checkout.session.completed: user ${userId} not found; cannot attach subscription.`
        );
        break;
      }

      // Retrieve subscription from Stripe (authoritative data)
      if (!session.subscription) {
        console.error(
          `checkout.session.completed: session has no subscription for user ${userId}`
        );
        break;
      }

      const subscription = (await stripe.subscriptions.retrieve(
        session.subscription as string
      )) as Stripe.Subscription;

      const firstItem = subscription.items.data[0];
      if (!firstItem) {
        console.error(
          `Stripe subscription ${subscription.id} has no items; cannot persist.`
        );
        break;
      }

      const periodEnd = new Date(firstItem.current_period_end * 1000);

      // If the user does not yet have stripeCustomerId, set it (idempotent safe update)
      if (!user.stripeCustomerId && subscription.customer) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: subscription.customer as string },
        });
      }

      // Check if there's already a subscription row for this user (1:1 relation)
      const existingUserSubscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingUserSubscription) {
        // If the stripeSubscriptionId changed (e.g. user upgraded/downgraded), update that row
        if (existingUserSubscription.stripeSubscriptionId !== subscription.id) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: firstItem.price.id,
              status: "ACTIVE",
              currentPeriodEnd: periodEnd,
            },
          });
        } else {
          // Just refresh fields
          await prisma.subscription.update({
            where: { userId },
            data: {
              stripePriceId: firstItem.price.id,
              status: "ACTIVE",
              currentPeriodEnd: periodEnd,
            },
          });
        }
      } else {
        // No subscription for this user yet -> create
        await prisma.subscription.create({
          data: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: firstItem.price.id,
            status: "ACTIVE",
            currentPeriodEnd: periodEnd,
          },
        });
      }

      console.log(
        `checkout.session.completed processed for user ${userId} (subscription ${subscription.id})`
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
