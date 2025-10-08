import { IAPIContextDTO } from "@/server/createContex";
import { ReadSearchInput } from "@/server/schema/search.schema";
import { ReadSearchService } from "./service";

const readSearchController = async ({
  input,
  ctx,
}: {
  input: ReadSearchInput;
  ctx: IAPIContextDTO;
}) => {
  const search = await ReadSearchService({
    ...input,
    repositories: {
      ...ctx.repositories.search,
      database: ctx.repositories.search,
    },
  });

  return search;
};

export { readSearchController };
