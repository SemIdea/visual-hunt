import type { Device } from "@/server/lib/headers";
import { generateSession } from "@/server/lib/token";
import type { TRPCContext } from "@/server/root";

export const domain_createSession = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { userId: string; device: Device };
}) => {
    const {
        accessToken,
        refreshToken,
        accessTokenHash,
        refreshTokenHash,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        expiresIn,
    } = generateSession(ctx);

    await ctx.db.session.create({
        data: {
            accessTokenHash,
            refreshTokenHash,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
            userId: params.userId,
            userAgent: params.device.userAgent,
            ip: params.device.ip,
        },
    });

    return { accessToken, refreshToken, expiresIn };
};
