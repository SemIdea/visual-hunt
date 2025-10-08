import { t } from "../createRouter";
import { CheckoutSessionRouter } from "./checkoutSession.route";
import { SearchRouter } from "./search.route";

const appRouter = t.router({
  search: SearchRouter,
  checkout: CheckoutSessionRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
