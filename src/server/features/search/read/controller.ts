import { IAPIContextDTO } from "@/server/createContex";
import { ReadSearchByIdInput } from "@/server/schema/search.schema";
import { ReadSearchByIdService } from "./service";

const readSearchByIdController = async ({
  input,
  ctx,
}: {
  input: ReadSearchByIdInput;
  ctx: IAPIContextDTO;
}) => {
  const search = await ReadSearchByIdService({
    ...input,
    repositories: {
      ...ctx.repositories.search,
      database: ctx.repositories.search,
    },
  });

  return search;
};

export { readSearchByIdController };
