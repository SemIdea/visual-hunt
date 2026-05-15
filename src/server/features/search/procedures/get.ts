import { z } from "zod";
import { protectedProcedure } from "@/server/root";
import { domain_getSearch } from "../domain/get";

export const procedure_getSearch = protectedProcedure
    .input(
        z.object({
            id: z.string().nonempty("ID is required"),
            results: z.boolean().optional(),
        }),
    )
    .query(async ({ ctx, input }) => {
        return await domain_getSearch({
            ctx,
            input: {
                id: input.id,
                userId: ctx.session.userId,
                results: input.results,
            },
        });
    });
