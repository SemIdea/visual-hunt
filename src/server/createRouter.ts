import { initTRPC } from "@trpc/server";
import { Context } from "./createContex";

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;

export { t, publicProcedure };
