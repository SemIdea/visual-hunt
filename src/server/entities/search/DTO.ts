import { IEntityDatabaseRepository } from "../base/entity";
import type { Search } from "@prisma/client";
import { IResultEntity } from "../result/DTO";

type ISearchEntity = Search;

type ISearchEntityWithResults = ISearchEntity & {
  results: Array<IResultEntity>;
};

type ISearchExtraRepositories = {
  readWithResults: (
    searchId: string
  ) => Promise<ISearchEntityWithResults | null>;
  readSearchHistory: (userId: string) => Promise<ISearchEntity[]>;
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

type IReadSearchHistoryDTO = {
  userId: string;
  repositories: {
    database: ISearchModel;
  };
};

export type {
  ISearchEntity,
  ISearchModel,
  IReadSearchWithResults,
  ISearchEntityWithResults,
  IReadSearchHistoryDTO,
};
