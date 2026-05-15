import Stripe from "stripe";
import { env } from "./env";

let stripeClient: Stripe | null = null;

export const getStripe = () => {
    if (!env.stripe.secretKey) {
        throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
    }

    stripeClient ??= new Stripe(env.stripe.secretKey);
    return stripeClient;
};

export const stripe = new Proxy({} as Stripe, {
    get(_target, prop, receiver) {
        const value = Reflect.get(getStripe(), prop, receiver);
        return typeof value === "function" ? value.bind(getStripe()) : value;
    },
});
