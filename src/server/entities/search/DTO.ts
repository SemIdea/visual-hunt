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

type ISearchEntityWithResults = ISearchEntity & {
  results: Array<{
    id: string;
    searchId: string;
    position: number;
    title: string;
    source: string;
    link: string;
    thumbnail: string;
    width: number;
    height: number;
  }>;
};

type ISearchExtraRepositories = {
  readWithResults: (searchId: string) => Promise<ISearchEntity | null>;
};

type ISearchModel = IEntityDatabaseRepository<
  ISearchEntity,
  ISearchExtraRepositories
>;

type IReadSearchWithResults = {
  searchId: string;
  repositories: {
    database: ISearchModel;
  };
};

export type {
  ISearchEntity,
  ISearchModel,
  IReadSearchWithResults,
  ISearchEntityWithResults,
};
