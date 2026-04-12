import { protectedProcedure } from "@/server/root";
import { z } from "zod";
import { domain_deleteSearch } from "../domain/delete";

export const procedure_deleteSearch = protectedProcedure.input(z.object({
  id: z.uuid(),
})).mutation(async ({ ctx, input }) => {
  return await domain_deleteSearch({ ctx, input: {
    id: input.id,
    userId: ctx.session?.user?.id ?? "",
  } });
});