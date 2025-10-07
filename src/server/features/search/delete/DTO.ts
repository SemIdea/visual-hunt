import { ISearchModel } from "@/server/entities/search/DTO";
import { IUserModel } from "@/server/entities/user/DTO";

type IDeleteSearchDTO = {
  id: string;
  userId: string;
  repositories: {
    database: ISearchModel;
    user: IUserModel;
  };
};

export type { IDeleteSearchDTO };
