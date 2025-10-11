import { IProtectedAPIContextDTO } from "@/server/createContex";
import { DeleteSearchService } from "./service";
import { repositories } from "@/server/container/repositories";
import { DeleteSearchInput } from "@/server/schema/search.schema";

const deleteSearchController = async ({
  input,
  ctx,
}: {
  input: DeleteSearchInput;
  ctx: IProtectedAPIContextDTO;
}) => {
  const search = await DeleteSearchService({
    id: input.id,
    userId: ctx.user.id,
    repositories: {
      ...repositories,
      database: repositories.search,
    },
  });

  return search;
};

export { deleteSearchController };
