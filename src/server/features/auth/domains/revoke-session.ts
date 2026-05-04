import { TRPCError } from "@trpc/server";
import { HmacSha256 } from "@/server/lib/crypto";
import type { TRPCContext } from "@/server/root";
import { domain_invalidateSessionCache } from "./invalidate-session-cache";

export const domain_revokeSession = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { sessionId: string; accessToken: string };
}) => {
    const session = await ctx.db.session.findUnique({
        where: { id: params.sessionId },
    });

    if (!session) throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
    if (session.revokedAt) throw new TRPCError({ code: "FORBIDDEN", message: "Session revoked" });

    await ctx.db.session.update({
        where: { id: params.sessionId },
        data: { revokedAt: new Date() },
    });

    const accessTokenHash = HmacSha256(params.accessToken, ctx.env.auth.session.accessSecret);
    await domain_invalidateSessionCache({ ctx, params: { accessTokenHash } });

    return { sessionId: session.id };
};
