import { z } from "zod";

const readSearchByIdSchema = z.object({
  id: z.uuidv4(),
});

const searchWithUrlSchema = z.object({
  url: z
    .url({
      protocol: /^https?$/,
    })
    .nonempty("URL is required"),
});

type ReadSearchByIdInput = z.TypeOf<typeof readSearchByIdSchema>;
type SearchWithUrlInput = z.TypeOf<typeof searchWithUrlSchema>;

export { searchWithUrlSchema, readSearchByIdSchema };
export type { SearchWithUrlInput, ReadSearchByIdInput };
