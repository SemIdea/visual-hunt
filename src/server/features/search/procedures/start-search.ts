import { z } from "zod";
import { protectedProcedure } from "@/server/root";
import { domain_startSearch } from "../domain/start-search";

export const procedure_startSearch = protectedProcedure
    .input(
        z.object({
            imageUrl: z.string().url("Must be a valid image URL"),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        return domain_startSearch({
            ctx,
            input: {
                imageUrl: input.imageUrl,
                userId: ctx.session.user.id,
            },
        });
    });
