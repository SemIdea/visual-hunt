import { ISearchModel } from "@/server/entities/search/DTO";

type IReadSearchHistoryDTO = {
  userId: string;
  repositories: {
    database: ISearchModel;
  };
};

export type { IReadSearchHistoryDTO };
