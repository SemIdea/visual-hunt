export type CreateCheckoutSessionInput = {
    priceId: string;
    userId: string;
    customerEmail: string;
    successUrl: string;
    cancelUrl: string;
};

export type SubscriptionDetails = {
    id: string;
    status: string;
    priceId: string;
    currentPeriodEnd: Date;
};

export interface PaymentAdapter {
    createCheckoutSession(input: CreateCheckoutSessionInput): Promise<string>;
    retrieveSubscription(id: string): Promise<SubscriptionDetails>;
    createCustomer(email: string): Promise<string>;
}
