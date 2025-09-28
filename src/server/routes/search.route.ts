import { t } from "../createRouter";
import { searchWithUrlController } from "../features/search/url/controller";
import { searchWithUrlSchema } from "../schema/search.schema";

const SearchRouter = t.router({
  searchWithUrl: t.procedure
    .input(searchWithUrlSchema)
    .mutation(async ({ input, ctx }) => searchWithUrlController({ input, ctx })),
});

export { SearchRouter };
