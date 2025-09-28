import { t } from "../createRouter";
import { SearchRouter } from "./search.route";

const appRouter = t.router({
  search: SearchRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
