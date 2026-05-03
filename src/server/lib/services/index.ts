import type Stripe from "stripe";
import { createStripePaymentAdapter } from "./payments/stripe-adapter";

export function createServicesRegistry(stripe: Stripe) {
    return {
        payments: createStripePaymentAdapter(stripe),
    } as const;
}

export type ServicesRegistry = ReturnType<typeof createServicesRegistry>;