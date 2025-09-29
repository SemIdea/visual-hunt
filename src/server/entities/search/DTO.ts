import { IEntityDatabaseRepository } from "../base/entity";

type ISearchEntity = {
  id: string;
  source: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
  publicAccessToken: string;
};

type ISearchModel = IEntityDatabaseRepository<ISearchEntity, {}>;

export type { ISearchEntity, ISearchModel };
