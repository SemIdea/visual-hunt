import { publicProcedure } from "@/server/root";
import { z } from "zod";
import { domain_searchWithUrl } from "../domain/with-url";

export const procedure_searchWithUrl = publicProcedure.input(z.object({
  url: z.url({
    protocol: /^https?$/,
  }).nonempty("URL is required"),
  userId: z.string().nonempty("User ID is required"),
})).mutation(async ({ ctx, input }) => {
  return await domain_searchWithUrl({ ctx, input: {
    url: input.url,
    userId: input.userId,
  } });
});