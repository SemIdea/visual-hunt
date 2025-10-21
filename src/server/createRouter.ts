import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./createContex";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;

const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await auth();

  const user = session?.user;

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: user as Required<typeof user>,
    },
  });
});

export { t, publicProcedure, protectedProcedure };
