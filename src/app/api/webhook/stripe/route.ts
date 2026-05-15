import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { SubscriptionStatus as PrismaSubscriptionStatus } from "@/generated/prisma";
import { SubscriptionStatus } from "@/generated/prisma";
import { env } from "@/server/lib/env";
import { prismaClient } from "@/server/lib/prisma";
import { stripe } from "@/server/lib/stripe";

const statusByStripeStatus: Record<Stripe.Subscription.Status, PrismaSubscriptionStatus> = {
    active: SubscriptionStatus.ACTIVE,
    canceled: SubscriptionStatus.CANCELED,
    incomplete: SubscriptionStatus.INCOMPLETE,
    incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
    past_due: SubscriptionStatus.PAST_DUE,
    trialing: SubscriptionStatus.TRIALING,
    unpaid: SubscriptionStatus.UNPAID,
    paused: SubscriptionStatus.PAUSED,
};

const assertWebhookConfig = () => {
    if (!env.stripe.webhookSecret) {
        throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
    }
};

const getSubscriptionData = (subscription: Stripe.Subscription) => {
    const firstItem = subscription.items.data[0];

    if (!firstItem) {
        throw new Error(`Stripe subscription ${subscription.id} has no items.`);
    }

    return {
        stripeSubscriptionId: subscription.id,
        stripePriceId: firstItem.price.id,
        status: statusByStripeStatus[subscription.status],
        currentPeriodEnd: new Date(firstItem.current_period_end * 1000),
    };
};

async function syncSubscription(userId: string, subscription: Stripe.Subscription) {
    await prismaClient.subscription.upsert({
        where: { userId },
        update: getSubscriptionData(subscription),
        create: {
            userId,
            ...getSubscriptionData(subscription),
        },
    });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;

    if (!userId) {
        throw new Error("checkout.session.completed missing metadata.userId.");
    }

    if (!session.subscription) {
        throw new Error(`Checkout session ${session.id} has no subscription.`);
    }

    const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id;

    if (customerId) {
        await prismaClient.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
        });
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await syncSubscription(userId, subscription);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const existing = await prismaClient.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
        select: { userId: true },
    });
    const userId = existing?.userId ?? subscription.metadata.userId;

    if (!userId) {
        throw new Error(`No user found for Stripe subscription ${subscription.id}.`);
    }

    await syncSubscription(userId, subscription);
}

export async function POST(request: Request) {
    assertWebhookConfig();

    const signature = request.headers.get("stripe-signature");
    const body = await request.text();

    if (!signature || !body) {
        return NextResponse.json({ error: "Invalid Stripe payload/signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, env.stripe.webhookSecret);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;
            default:
                break;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown webhook error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
