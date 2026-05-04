import { TRPCError } from "@trpc/server";
import { verifyPassword } from "@/server/lib/bcrypt";
import type { TRPCContext } from "@/server/root";
import { domain_createSession } from "./create-session";

export const domain_login = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { email: string; password: string };
}) => {
    const user = await ctx.db.user.findUnique({
        where: { email: params.email },
    });

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password.",
        });
    }

    if (!user.passwordHash) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password.",
        });
    }

    const passwordValid = await verifyPassword(params.password, user.passwordHash);

    if (!passwordValid) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password.",
        });
    }

    const session = await domain_createSession({
        ctx,
        params: { userId: user.id, device: ctx.device },
    });

    return session;
};
