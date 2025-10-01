import { IResultModel } from "../entities/result/DTO";
import { PrismaResultModel } from "../entities/result/repositories/prisma";
import { ISearchModel } from "../entities/search/DTO";
import { PrismaSearchModel } from "../entities/search/repositories/prisma";
import { IUserModel } from "../entities/user/DTO";
import { PrismaUserModel } from "../entities/user/repositories/prisma";

type IRepositories = {
  search: ISearchModel;
  result: IResultModel;
  user: IUserModel;
};

const repositories: IRepositories = {
  search: new PrismaSearchModel(),
  result: new PrismaResultModel(),
  user: new PrismaUserModel(),
};

export { repositories };

export type { IRepositories };
