import { SearchWithUrlInput } from "@/server/schema/search.schema";
import { SearchWithUrlTriggerJob } from "./service";
import { IProtectedAPIContextDTO } from "@/server/createContex";

const searchWithUrlController = async ({
  input,
  ctx,
}: {
  input: SearchWithUrlInput;
  ctx: IProtectedAPIContextDTO;
}) => {
  const job = await SearchWithUrlTriggerJob({
    ...input,
    userId: ctx.userId,
    repositories: {
      ...ctx.repositories,
      database: ctx.repositories.search,
    },
    helpers: ctx.helpers,
  });

  return job;
};

export { searchWithUrlController };
