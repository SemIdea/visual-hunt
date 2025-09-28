import { tasks } from "@trigger.dev/sdk";
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

  SearchEntity.create({
    id: helpers.uid.generate(),
    data: {
      source: data.url,
      status: "PENDING",
      jobId: job.id,
    },
    repositories,
  });

  return job;
};

export { SearchWithUrlTriggerJob };
