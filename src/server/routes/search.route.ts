import { t } from "../createRouter";
import { readSearchByIdController } from "../features/search/read/controller";
import { searchWithUrlController } from "../features/search/url/controller";
import {
  readSearchByIdSchema,
  searchWithUrlSchema,
} from "../schema/search.schema";

const SearchRouter = t.router({
  searchWithUrl: t.procedure
    .input(searchWithUrlSchema)
    .mutation(async ({ input, ctx }) =>
      searchWithUrlController({ input, ctx })
    ),
  readSearchById: t.procedure
    .input(readSearchByIdSchema)
    .query(async ({ input, ctx }) => readSearchByIdController({ input, ctx })),
});

export { SearchRouter };
