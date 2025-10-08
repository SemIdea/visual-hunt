import { z } from "zod";

const readSearch = z.object({
  id: z.uuidv4(),
});

const searchWithUrlSchema = z.object({
  url: z
    .url({
      protocol: /^https?$/,
    })
    .nonempty("URL is required"),
});

const deleteSearch = z.object({
  id: z.uuidv4(),
});

type ReadSearchInput = z.TypeOf<typeof readSearch>;
type SearchWithUrlInput = z.TypeOf<typeof searchWithUrlSchema>;
type DeleteSearchInput = z.TypeOf<typeof deleteSearch>;

export { searchWithUrlSchema, readSearch, deleteSearch };
export type { SearchWithUrlInput, ReadSearchInput, DeleteSearchInput };
