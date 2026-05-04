import { HmacSha256 } from "@/server/lib/crypto";
import type { TRPCContext } from "@/server/root";
import { type ISession, SessionStatus, sessionSchema } from "../schemas";

const validateSession = (
    session: Pick<ISession, "revokedAt" | "accessTokenExpiresAt">,
): SessionStatus => {
    if (session.revokedAt) return SessionStatus.REVOKED;
    if (session.accessTokenExpiresAt < new Date()) return SessionStatus.EXPIRED;
    return SessionStatus.VALID;
};

export const domain_getSessionByToken = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { token: string };
}) => {
    const accessTokenHash = HmacSha256(params.token, ctx.env.auth.session.accessSecret);

    const cachedData = await ctx.redis.get(
        `${ctx.env.auth.session.cache.sessionKeyPrefix}${accessTokenHash}`,
    );

    if (cachedData) {
        const parsed = sessionSchema.safeParse(JSON.parse(cachedData));
        if (parsed.success) {
            const status = validateSession(parsed.data);
            return { session: parsed.data, status };
        }
    }

    const session = await ctx.db.session.findUnique({
        where: { accessTokenHash },
        include: { user: true },
    });

    if (!session) return { session: null, status: SessionStatus.NOT_FOUND };
    const status = validateSession(session);
    if (status !== SessionStatus.VALID) return { session: null, status };

    const parsed = sessionSchema.safeParse({
        id: session.id,
        userId: session.userId,
        accessTokenExpiresAt: session.accessTokenExpiresAt,
        revokedAt: session.revokedAt,
        userAgent: session.userAgent,
        ip: session.ip,
    });

    if (!parsed.success) return { session: null, status: SessionStatus.INVALID };

    await ctx.redis.set(
        `${ctx.env.auth.session.cache.sessionKeyPrefix}${accessTokenHash}`,
        JSON.stringify(parsed.data),
        "PX",
        ctx.env.auth.session.cache.ttl,
    );

    return { session: parsed.data, status: SessionStatus.VALID };
};
