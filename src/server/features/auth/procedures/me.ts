import z from "zod";
import { protectedProcedure } from "@/server/root";

const userResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string(),
    stripeCustomerId: z.string().nullable(),
    subscription: z
        .object({
            stripePriceId: z.string(),
            status: z.string(),
            currentPeriodEnd: z.string(),
        })
        .nullable(),
});

export const procedure_me = protectedProcedure
    .output(z.object({ result: userResultSchema }))
    .query(async ({ ctx }) => {
        const user = await ctx.db.user.findUnique({
            where: { id: ctx.session.userId },
            include: { subscription: true },
        });

        if (!user) {
            throw new Error(`User not found for session: ${ctx.session.id}`);
        }

        return {
            result: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                stripeCustomerId: user.stripeCustomerId,
                subscription: user.subscription
                    ? {
                          stripePriceId: user.subscription.stripePriceId,
                          status: user.subscription.status,
                          currentPeriodEnd: user.subscription.currentPeriodEnd.toISOString(),
                      }
                    : null,
            },
        };
    });
