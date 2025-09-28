import { SearchWithUrlInput } from "@/server/schema/search.schema";
import { SearchWithUrlTriggerJob } from "./service";
import { IAPIContextDTO } from "@/server/createContex";

const searchWithUrlController = async ({
  input,
  ctx,
}: {
  input: SearchWithUrlInput;
  ctx: IAPIContextDTO;
}) => {
  const job = await SearchWithUrlTriggerJob({
    ...input,
    repositories: {
      ...ctx.repositories,
      database: ctx.repositories.search,
    },
    helpers: ctx.helpers,
  });

  return job;
};

export { searchWithUrlController };
