import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { appRouter } from "@/server";
import { createTRPCContext } from "@/server/root";
import { makeQueryClient } from "./shared";

export const getQueryClient = cache(makeQueryClient);

export const trpcServer = createTRPCOptionsProxy({
    ctx: async () => createTRPCContext(),
    router: appRouter,
    queryClient: getQueryClient,
});
