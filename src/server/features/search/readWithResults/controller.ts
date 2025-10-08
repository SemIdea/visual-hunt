import { IAPIContextDTO } from "@/server/createContex";
import { ReadSearchInput } from "@/server/schema/search.schema";
import { ReadSearchWithResultsService } from "./service";

const readSearchWithResultsController = async ({
  input,
  ctx,
}: {
  input: ReadSearchInput;
  ctx: IAPIContextDTO;
}) => {
  const search = await ReadSearchWithResultsService({
    ...input,
    repositories: {
      ...ctx.repositories,
      database: ctx.repositories.search,
    },
  });

  return search;
};

export { readSearchWithResultsController };
