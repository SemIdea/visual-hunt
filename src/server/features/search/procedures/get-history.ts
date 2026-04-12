import { z } from "zod";
import { publicProcedure } from "@/server/root";
import { domain_getSearchHistory } from "../domain/get-history";

export const procedure_getSearchHistory = publicProcedure
    .input(
        z.object({
            userId: z.string().nonempty("User ID is required"),
        }),
    )
    .query(async ({ ctx, input }) => {
        return await domain_getSearchHistory({ ctx, input });
    });
