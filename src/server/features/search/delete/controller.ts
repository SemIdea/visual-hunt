import { IProtectedAPIContextDTO } from "@/server/createContex";
import { DeleteSearchService } from "./service";
import { repositories } from "@/server/container/repositories";

const deleteSearchController = async ({
  input,
  ctx,
}: {
  input: any;
  ctx: IProtectedAPIContextDTO;
}) => {
  const search = await DeleteSearchService({
    id: input.id,
    userId: ctx.userId,
    repositories: {
      ...repositories,
      database: repositories.search,
    },
  });

  return search;
};

export { deleteSearchController };
