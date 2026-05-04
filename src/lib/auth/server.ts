import "server-only";
import { headers } from "next/headers";
import { appRouter } from "@/server";
import { createCallerFactory, createTRPCContext } from "@/server/root";

const createCaller = createCallerFactory(appRouter);

export async function getServerAuth() {
    try {
        const h = await headers();
        const ctx = await createTRPCContext({ headers: h });
        const caller = createCaller(ctx);
        const result = await caller.auth.me();
        return result.result;
    } catch {
        return null;
    }
}
