import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { makeQueryClient } from "./shared";
import { appRouter } from "@/server";
import { createTRPCContext } from "@/server/root";

export const getQueryClient = cache(makeQueryClient);

export const trpcServer = createTRPCOptionsProxy({
    ctx: async () => createTRPCContext(),
    router: appRouter,
    queryClient: getQueryClient,
});
