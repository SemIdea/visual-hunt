import { TRPCError } from "@trpc/server";
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
        where: { id: input.userId },
    });

    if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    if (!user.email) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User has no email" });
    }

    const url = await ctx.services.payments.createCheckoutSession({
        priceId: input.priceId,
        userId: user.id,
        customerEmail: user.email,
        successUrl: `${ctx.env.publicUrl}/dashboard?success=true`,
        cancelUrl: `${ctx.env.publicUrl}/pricing?canceled=true`,
    });

    return url;
};
