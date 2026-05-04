import z from "zod";
import { publicProcedure } from "@/server/root";
import { domain_refreshSession } from "../domains/refresh-session";
import { refreshSessionInputSchema, refreshSessionResultSchema } from "../schemas";

export const procedure_refreshSession = publicProcedure
    .input(refreshSessionInputSchema)
    .output(
        z.object({
            result: refreshSessionResultSchema,
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const { accessToken, refreshToken, expiresIn } = await domain_refreshSession({
            ctx,
            params: { refreshToken: input.refreshToken },
        });

        return { result: { accessToken, refreshToken, expiresIn } };
    });
