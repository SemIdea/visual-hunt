import { TRPCError } from "@trpc/server";
import { hashPassword } from "@/server/lib/bcrypt";
import type { TRPCContext } from "@/server/root";
import { domain_createSession } from "./create-session";

export const domain_register = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { name: string; email: string; password: string };
}) => {
    const existing = await ctx.db.user.findUnique({
        where: { email: params.email },
        select: { id: true },
    });

    if (existing) {
        throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered.",
        });
    }

    const passwordHash = await hashPassword(params.password, ctx.env.auth.user.bcrypt.cost);

    const user = await ctx.db.user.create({
        data: {
            name: params.name,
            email: params.email,
            passwordHash,
        },
    });

    const session = await domain_createSession({
        ctx,
        params: { userId: user.id, device: ctx.device },
    });

    return session;
};
