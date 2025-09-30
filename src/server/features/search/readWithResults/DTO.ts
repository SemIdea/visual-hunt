import { ISearchModel } from "@/server/entities/search/DTO";

type IReadSearchWithResultsDTO = {
  id: string;
  repositories: {
    database: ISearchModel;
  };
};

export type { IReadSearchWithResultsDTO };
