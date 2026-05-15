import { z } from "zod";
import { publicProcedure } from "@/server/root";
import { domain_getSearch } from "../domain/get";

export const procedure_getSearch = publicProcedure
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
                results: input.results,
            },
        });
    });

export const procedure_readSearchWithResults = publicProcedure
    .input(
        z.object({
            id: z.string().nonempty("ID is required"),
        }),
    )
    .query(async ({ ctx, input }) => {
        return await domain_getSearch({
            ctx,
            input: {
                id: input.id,
                results: true,
            },
        });
    });
