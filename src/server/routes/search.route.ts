import { protectedProcedure, t } from "../createRouter";
import { readSearchController } from "../features/search/read/controller";
import { readSearchWithResultsController } from "../features/search/readWithResults/controller";
import { searchWithUrlController } from "../features/search/url/controller";
import { readSearch, searchWithUrlSchema } from "../schema/search.schema";

const SearchRouter = t.router({
  searchWithUrl: protectedProcedure
    .input(searchWithUrlSchema)
    .mutation(async ({ input, ctx }) =>
      searchWithUrlController({ input, ctx })
    ),
  readSearch: protectedProcedure
    .input(readSearch)
    .query(async ({ input, ctx }) => readSearchController({ input, ctx })),
  readSearchWithResults: protectedProcedure
    .input(readSearch)
    .query(async ({ input, ctx }) =>
      readSearchWithResultsController({ input, ctx })
    ),
});

export { SearchRouter };
