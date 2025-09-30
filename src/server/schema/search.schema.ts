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

type ReadSearch = z.TypeOf<typeof readSearch>;
type SearchWithUrlInput = z.TypeOf<typeof searchWithUrlSchema>;

export { searchWithUrlSchema, readSearch };
export type { SearchWithUrlInput, ReadSearch };
