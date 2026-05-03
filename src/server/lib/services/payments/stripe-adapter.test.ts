import { describe, expect, it, vi } from "vitest";

const mockCreate = vi.fn();
const mockRetrieve = vi.fn();
const mockCreateCustomer = vi.fn();

const mockStripe = {
    checkout: { sessions: { create: mockCreate } },
    subscriptions: { retrieve: mockRetrieve },
    customers: { create: mockCreateCustomer },
};

describe("StripePaymentAdapter", () => {
    it("createCheckoutSession returns session URL", async () => {
        mockCreate.mockResolvedValueOnce({
            url: "https://checkout.stripe.com/test",
        });

        const { createStripePaymentAdapter } = await import("./stripe-adapter");
        const adapter = createStripePaymentAdapter(mockStripe as never);

        const url = await adapter.createCheckoutSession({
            priceId: "price_123",
            userId: "user_1",
            customerEmail: "test@test.com",
            successUrl: "https://example.com/success",
            cancelUrl: "https://example.com/cancel",
        });

        expect(url).toBe("https://checkout.stripe.com/test");

        expect(mockCreate).toHaveBeenCalledWith({
            line_items: [{ price: "price_123", quantity: 1 }],
            customer_email: "test@test.com",
            metadata: { userId: "user_1" },
            payment_method_types: ["card"],
            mode: "subscription",
            success_url: "https://example.com/success",
            cancel_url: "https://example.com/cancel",
            adaptive_pricing: { enabled: true },
        });
    });

    it("retrieveSubscription returns mapped details", async () => {
        mockRetrieve.mockResolvedValueOnce({
            id: "sub_1",
            status: "active",
            items: {
                data: [
                    {
                        price: { id: "price_456" },
                        current_period_end: 1700000000,
                    },
                ],
            },
        });

        const { createStripePaymentAdapter } = await import("./stripe-adapter");
        const adapter = createStripePaymentAdapter(mockStripe as never);

        const sub = await adapter.retrieveSubscription("sub_1");

        expect(sub).toEqual({
            id: "sub_1",
            status: "active",
            priceId: "price_456",
            currentPeriodEnd: new Date(1700000000 * 1000),
        });
    });

    it("createCustomer returns customer ID", async () => {
        mockCreateCustomer.mockResolvedValueOnce({ id: "cus_123" });

        const { createStripePaymentAdapter } = await import("./stripe-adapter");
        const adapter = createStripePaymentAdapter(mockStripe as never);

        const id = await adapter.createCustomer("test@test.com");

        expect(id).toBe("cus_123");
        expect(mockCreateCustomer).toHaveBeenCalledWith({ email: "test@test.com" });
    });
});
