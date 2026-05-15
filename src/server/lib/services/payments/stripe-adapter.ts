import type Stripe from "stripe";
import type { CreateCheckoutSessionInput, PaymentAdapter, SubscriptionDetails } from "./adapter";

export const createStripePaymentAdapter = (stripe: Stripe): PaymentAdapter => ({
    async createCheckoutSession(input: CreateCheckoutSessionInput): Promise<string> {
        const session = await stripe.checkout.sessions.create({
            line_items: [{ price: input.priceId, quantity: 1 }],
            customer_email: input.customerEmail,
            metadata: { userId: input.userId },
            payment_method_types: ["card"],
            mode: "subscription",
            subscription_data: {
                metadata: { userId: input.userId },
            },
            success_url: input.successUrl,
            cancel_url: input.cancelUrl,
            adaptive_pricing: { enabled: true },
        });

        if (!session.url) {
            throw new Error("Checkout session URL is missing");
        }

        return session.url;
    },

    async retrieveSubscription(id: string): Promise<SubscriptionDetails> {
        const sub = await stripe.subscriptions.retrieve(id);

        const firstItem = sub.items.data[0];
        if (!firstItem) {
            throw new Error(`Subscription ${id} has no items`);
        }

        return {
            id: sub.id,
            status: sub.status,
            priceId: firstItem.price.id,
            currentPeriodEnd: new Date(firstItem.current_period_end * 1000),
        };
    },

    async createCustomer(email: string): Promise<string> {
        const customer = await stripe.customers.create({ email });
        return customer.id;
    },
});
