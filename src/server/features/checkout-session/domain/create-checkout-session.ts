import { TRPCError } from "@trpc/server";
import { stripe } from "@/server/lib/stripe";
import type { TRPCContext } from "@/server/root";

export const domain_createCheckoutSession = async ({
    ctx,
    input,
}: {
    ctx: TRPCContext;
    input: {
        priceId: string;
        userId: string;
    };
}) => {
    const user = await ctx.db.user.findUnique({
        where: {
            id: input.userId,
        },
    });

    if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        line_items: [{ price: input.priceId, quantity: 1 }],
        customer_email: user.email!,
        metadata: {
            userId: user.id,
        },
        payment_method_types: ["card"],
        mode: "subscription",
        success_url: `${ctx.env.publicUrl}/dashboard?success=true`,
        cancel_url: `${ctx.env.publicUrl}/pricing?canceled=true`,
        adaptive_pricing: {
            enabled: true,
        },
    });

    return checkoutSession.url;
};
