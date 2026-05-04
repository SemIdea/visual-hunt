import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "@/server/root";

export const domain_checkRateLimit = async ({ ctx }: { ctx: TRPCContext }) => {
    if (!ctx.device?.ip) return;

    const ip = ctx.device.ip;
    const key = `rate:${ip}`;

    const current = await ctx.redis.incr(key);
    if (current === 1) {
        await ctx.redis.pexpire(key, ctx.env.auth.rateLimit.windowMs);
    }

    if (current > ctx.env.auth.rateLimit.maxRequests) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests. Please try again later.",
        });
    }
};
