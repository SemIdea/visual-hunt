import "server-only";

import { headers } from "next/headers";
import { appRouter } from "@/server";
import { createCallerFactory, createTRPCContext } from "@/server/root";

export const createCaller = async () => {
    const h = await headers();
    const ctx = await createTRPCContext({ headers: h });
    return createCallerFactory(appRouter)(ctx);
};
