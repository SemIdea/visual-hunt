import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { domain_getSessionByToken } from "@/server/features/auth/domains/get-session-by-token";
import { domain_checkRateLimit } from "@/server/features/auth/domains/rate-limit";
import type { ISession } from "@/server/features/auth/schemas";
import { env } from "@/server/lib/env";
import { type Device, extractBearerToken, parseHeaders } from "@/server/lib/headers";
import { prismaClient } from "@/server/lib/prisma";
import { redis } from "@/server/lib/redis";
import { createServicesRegistry } from "@/server/lib/services";
import { stripe } from "@/server/lib/stripe";
import { taskRegistry } from "@/server/lib/tasks";

export interface CreateTRPCContextInput {
    headers: Headers;
}

export interface TRPCContext {
    db: typeof prismaClient;
    env: typeof env;
    redis: typeof redis;
    tasks: typeof taskRegistry;
    services: ReturnType<typeof createServicesRegistry>;
    device: Device;
    accessToken: string | null;
}

export interface ProtectedContext extends TRPCContext {
    session: ISession;
    accessToken: string;
}

export const createTRPCContext = async (opts: CreateTRPCContextInput): Promise<TRPCContext> => {
    const device = parseHeaders(opts.headers);
    const accessToken = extractBearerToken(opts.headers);

    return {
        db: prismaClient,
        env,
        redis,
        tasks: taskRegistry,
        services: createServicesRegistry(stripe),
        device,
        accessToken,
    };
};

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
    await domain_checkRateLimit({ ctx });
    return next();
});

export const publicProcedure = t.procedure.use(rateLimitMiddleware);

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
    if (!ctx.accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing access token" });
    }

    const { session } = await domain_getSessionByToken({
        ctx,
        params: { token: ctx.accessToken },
    });

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid session" });
    }

    return next({
        ctx: { ...ctx, session, accessToken: ctx.accessToken } as ProtectedContext,
    });
});
