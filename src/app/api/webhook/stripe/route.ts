import { prisma } from "@/server/drivers/prisma";
import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
      return "CANCELED";
  }
};

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      if (!userId) {
        console.error(
          "checkout.session.completed webhook missing metadata.userId; cannot attach subscription"
        );
        break;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        console.error(
          `checkout.session.completed: user ${userId} not found; cannot attach subscription.`
        );
        break;
      }

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

      const existingUserSubscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingUserSubscription) {
        if (existingUserSubscription.stripeSubscriptionId !== subscription.id) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: firstItem.price.id,
              status: parseStatus(subscription.status),
              currentPeriodEnd: periodEnd,
            },
          });
        } else {
          await prisma.subscription.update({
            where: { userId },
            data: {
              stripePriceId: firstItem.price.id,
              status: parseStatus(subscription.status),
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
            status: parseStatus(subscription.status),
            currentPeriodEnd: periodEnd,
          },
        });
      }

      console.log(
        `checkout.session.completed processed for user ${userId} (subscription ${subscription.id})`
      );
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          status: parseStatus(subscription.status), // Cast to your SubscriptionStatus enum
          stripePriceId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date(
            subscription.items.data[0].current_period_end * 1000
          ),
        },
      });

      console.log(`Updated subscription ${subscription.id}`);
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
