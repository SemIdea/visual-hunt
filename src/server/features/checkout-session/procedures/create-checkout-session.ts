import { protectedProcedure } from "@/server/root";
import z from "zod";

export const procedure_createCheckoutSession = protectedProcedure.input(z.object({
  priceId: z.string().nonempty("Price ID is required"),
})).mutation(async ({ ctx, input }) => {
  
});