import z from "zod";
import { protectedProcedure } from "@/server/root";

export const procedure_createCheckoutSession = protectedProcedure
    .input(
        z.object({
            priceId: z.string().nonempty("Price ID is required"),
        }),
    )
    .mutation(async ({ ctx, input }) => {});
