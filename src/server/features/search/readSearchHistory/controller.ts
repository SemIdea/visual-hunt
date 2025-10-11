import { IProtectedAPIContextDTO } from "@/server/createContex";
import { ReadSearchHistoryService } from "./service";

const readSearchHistoryController = async ({
  ctx,
}: {
  ctx: IProtectedAPIContextDTO;
}) => {
  const userId = ctx.user.id;

  // Fetch search history from the database or any other source
  const searches = await ReadSearchHistoryService({
    userId,
    repositories: {
      database: ctx.repositories.search,
    },
  });

  return searches;
};

export { readSearchHistoryController };
