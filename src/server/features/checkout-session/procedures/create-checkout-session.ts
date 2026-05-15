import z from "zod";
import { protectedProcedure } from "@/server/root";
import { domain_createCheckoutSession } from "../domain/create-checkout-session";

export const procedure_createCheckoutSession = protectedProcedure
    .input(
        z.object({
            priceId: z.string().nonempty("Price ID is required"),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        return await domain_createCheckoutSession({
            ctx,
            input: {
                priceId: input.priceId,
                userId: ctx.session.userId,
            },
        });
    });
