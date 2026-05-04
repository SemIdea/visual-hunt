import z from "zod";
import { publicProcedure } from "@/server/root";
import { domain_login } from "../domains/login";
import { AuthStatus, authenticatedResultSchema, loginInputSchema } from "../schemas";

export const procedure_login = publicProcedure
    .input(loginInputSchema)
    .output(
        z.object({
            result: authenticatedResultSchema,
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const result = await domain_login({
            ctx,
            params: { email: input.email, password: input.password },
        });

        return {
            result: {
                status: AuthStatus.AUTHENTICATED,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                expiresIn: result.expiresIn,
            },
        };
    });
