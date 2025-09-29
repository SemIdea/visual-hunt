import { ISearchModel } from "@/server/entities/search/DTO";

type IReadSearchByIdDTO = {
  id: string;
  repositories: {
    database: ISearchModel;
  };
};

export type { IReadSearchByIdDTO };
