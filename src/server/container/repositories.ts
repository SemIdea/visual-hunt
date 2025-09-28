import { ISearchModel } from "../entities/search/DTO";
import { PrismaSearchModel } from "../entities/search/repositories/prisma";

type IRepositories = {
  search: ISearchModel;
};

const repositories: IRepositories = {
  search: new PrismaSearchModel(),
};

export { repositories };

export type { IRepositories };
