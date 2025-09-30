import { IResultModel } from "../entities/result/DTO";
import { PrismaResultModel } from "../entities/result/repositories/prisma";
import { ISearchModel } from "../entities/search/DTO";
import { PrismaSearchModel } from "../entities/search/repositories/prisma";

type IRepositories = {
  search: ISearchModel;
  result: IResultModel;
};

const repositories: IRepositories = {
  search: new PrismaSearchModel(),
  result: new PrismaResultModel(),
};

export { repositories };

export type { IRepositories };
