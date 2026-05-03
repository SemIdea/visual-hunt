import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { env } from "@/server/lib/env";
import { prismaClient } from "@/server/lib/prisma";
import { createServicesRegistry } from "@/server/lib/services";
import { stripe } from "@/server/lib/stripe";
import { taskRegistry } from "@/server/lib/tasks";

export const createTRPCContext = async () => {
    return {
        db: prismaClient,
        env,
        tasks: taskRegistry,
        services: createServicesRegistry(stripe),
    };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    const session = await auth();
    if (!session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({ ctx: { ...ctx, session } });
});
