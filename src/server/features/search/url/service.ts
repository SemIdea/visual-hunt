import { auth, tasks } from "@trigger.dev/sdk";
import { ISearchWithUrlDTO } from "./DTO";
import { SearchEntity } from "@/server/entities/search/entity";

const SearchWithUrlTriggerJob = async ({
  repositories,
  helpers,
  ...data
}: ISearchWithUrlDTO) => {
  const job = await tasks.trigger("search-with-google-lens", {
    imageUrl: data.url,
    type: "exact_matches",
  });

  const publicAccessToken = await auth.createPublicToken({
    scopes: {
      read: {
        runs: job.id,
      },
    },
  });

  const search = await SearchEntity.create({
    id: helpers.uid.generate(),
    data: {
      source: data.url,
      status: "PENDING",
      jobId: job.id,
      publicAccessToken,
    },
    repositories,
  });

  return search;
};

export { SearchWithUrlTriggerJob };
