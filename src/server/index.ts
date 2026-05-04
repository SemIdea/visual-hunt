import { router_auth } from "./features/auth/router";
import { router_checkout } from "./features/checkout-session/router";
import { router_search } from "./features/search/router";
import { createTRPCRouter } from "./root";

export const appRouter = createTRPCRouter({
    auth: router_auth,
    search: router_search,
    checkout: router_checkout,
});

export type AppRouter = typeof appRouter;
