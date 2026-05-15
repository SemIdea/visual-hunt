import { z } from "zod";
import { protectedProcedure } from "@/server/root";
import { domain_searchWithUrl } from "../domain/with-url";

export const procedure_searchWithUrl = protectedProcedure
    .input(
        z.object({
            url: z
                .url({
                    protocol: /^https?$/,
                })
                .nonempty("URL is required"),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        return await domain_searchWithUrl({
            ctx,
            input: {
                url: input.url,
                userId: ctx.session.userId,
            },
        });
    });
