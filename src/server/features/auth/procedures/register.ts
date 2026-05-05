import z from "zod";
import { publicProcedure } from "@/server/root";
import { domain_register } from "../domains/register";
import { AuthStatus, authenticatedResultSchema, registerInputSchema } from "../schemas";

export const procedure_register = publicProcedure
    .input(registerInputSchema)
    .output(
        z.object({
            result: authenticatedResultSchema,
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const result = await domain_register({
            ctx,
            params: { name: input.name, email: input.email, password: input.password },
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
