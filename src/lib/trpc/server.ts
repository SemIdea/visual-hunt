import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { appRouter } from "@/server";
import { createTRPCContext } from "@/server/root";
import { makeQueryClient } from "./shared";

export const getQueryClient = cache(makeQueryClient);

export const trpcServer = createTRPCOptionsProxy({
    ctx: async () => {
        const h = await headers();
        return createTRPCContext({ headers: h });
    },
    router: appRouter,
    queryClient: getQueryClient,
});
