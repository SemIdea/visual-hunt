import { router_checkout } from "./features/checkout-session/router";
import { router_search } from "./features/search/router";
import { createTRPCRouter } from "./root";

export const appRouter = createTRPCRouter({
  search: router_search,
  checkout: router_checkout,
});

export type AppRouter = typeof appRouter;