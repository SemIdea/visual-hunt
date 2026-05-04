import type { TRPCContext } from "@/server/root";

export const domain_invalidateSessionCache = async ({
    ctx,
    params,
}: {
    ctx: TRPCContext;
    params: { accessTokenHash: string };
}) => {
    await ctx.redis.del(`${ctx.env.auth.session.cache.sessionKeyPrefix}${params.accessTokenHash}`);
};
