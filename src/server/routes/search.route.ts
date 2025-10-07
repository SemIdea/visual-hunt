import { protectedProcedure, publicProcedure, t } from "../createRouter";
import { deleteSearchController } from "../features/search/delete/controller";
import { readSearchController } from "../features/search/read/controller";
import { readSearchHistoryController } from "../features/search/readSearchHistory/controller";
import { readSearchWithResultsController } from "../features/search/readWithResults/controller";
import { searchWithUrlController } from "../features/search/url/controller";
import { readSearch, searchWithUrlSchema } from "../schema/search.schema";

const SearchRouter = t.router({
  searchWithUrl: protectedProcedure
    .input(searchWithUrlSchema)
    .mutation(async ({ input, ctx }) =>
      searchWithUrlController({ input, ctx })
    ),
  readSearch: publicProcedure
    .input(readSearch)
    .query(async ({ input, ctx }) => readSearchController({ input, ctx })),
  readSearchWithResults: publicProcedure
    .input(readSearch)
    .query(async ({ input, ctx }) =>
      readSearchWithResultsController({ input, ctx })
    ),
  readSearchHistory: protectedProcedure.query(async ({ ctx }) =>
    readSearchHistoryController({ ctx })
  ),
  deleteSearch: protectedProcedure
    .input(readSearch)
    .mutation(async ({ input, ctx }) => deleteSearchController({ input, ctx })),
});

export { SearchRouter };
