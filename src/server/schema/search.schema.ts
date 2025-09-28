import { z } from "zod";

const searchWithUrlSchema = z.object({
  url: z
    .url({
      protocol: /^https?$/,
    })
    .nonempty("URL is required"),
});

type SearchWithUrlInput = z.TypeOf<typeof searchWithUrlSchema>;

export { searchWithUrlSchema };
export type { SearchWithUrlInput };
