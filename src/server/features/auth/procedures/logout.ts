import z from "zod";
import { protectedProcedure } from "@/server/root";
import { domain_revokeSession } from "../domains/revoke-session";
import { AuthStatus, logoutResultSchema } from "../schemas";

export const procedure_logout = protectedProcedure
    .output(z.object({ result: logoutResultSchema }))
    .mutation(async ({ ctx }) => {
        await domain_revokeSession({
            ctx,
            params: { sessionId: ctx.session.id, accessToken: ctx.accessToken },
        });

        return { result: { status: AuthStatus.LOGGED_OUT } };
    });
