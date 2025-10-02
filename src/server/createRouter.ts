import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./createContex";

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;

const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId
    },
  });
});

export { t, publicProcedure, protectedProcedure };
