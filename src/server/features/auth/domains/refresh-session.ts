import { TRPCError } from "@trpc/server";
import { HmacSha256 } from "@/server/lib/crypto";
import { generateSession } from "@/server/lib/token";
import type { TRPCContext } from "@/server/root";
import { domain_invalidateSessionCache } from "./invalidate-session-cache";

export const domain_refreshSession = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { refreshToken: string };
}) => {
    const refreshTokenHash = HmacSha256(params.refreshToken, ctx.env.auth.session.refreshSecret);

    const session = await ctx.db.session.findUnique({
        where: { refreshTokenHash },
    });

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid refresh token" });
    }

    if (session.revokedAt) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Session revoked" });
    }

    if (session.refreshTokenExpiresAt < new Date()) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Refresh token expired" });
    }

    const newTokens = generateSession(ctx);

    await ctx.db.session.update({
        where: { id: session.id },
        data: {
            accessTokenHash: newTokens.accessTokenHash,
            refreshTokenHash: newTokens.refreshTokenHash,
            accessTokenExpiresAt: newTokens.accessTokenExpiresAt,
            refreshTokenExpiresAt: newTokens.refreshTokenExpiresAt,
        },
    });

    const oldAccessTokenHash = HmacSha256(
        session.accessTokenHash,
        ctx.env.auth.session.accessSecret,
    );
    await domain_invalidateSessionCache({ ctx, params: { accessTokenHash: oldAccessTokenHash } });

    return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        expiresIn: newTokens.expiresIn,
    };
};
