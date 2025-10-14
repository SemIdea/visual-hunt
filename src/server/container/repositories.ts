import { IAccountModel } from "../entities/account/DTO";
import { PrismaAccountModel } from "../entities/account/repositories/prisma";
import { IResultModel } from "../entities/result/DTO";
import { PrismaResultModel } from "../entities/result/repositories/prisma";
import { ISearchModel } from "../entities/search/DTO";
import { PrismaSearchModel } from "../entities/search/repositories/prisma";
import { ISessionModel } from "../entities/session/DTO";
import { PrismaSessionModel } from "../entities/session/repositories/prisma";
import { IUserModel } from "../entities/user/DTO";
import { PrismaUserModel } from "../entities/user/repositories/prisma";
import { ICacheRepositoryAdapter } from "../integrations/repositories/cache/adapter";
import { RedisCacheRepository } from "../integrations/repositories/cache/implementations/redis";

type IRepositories = {
  search: ISearchModel;
  result: IResultModel;
  user: IUserModel;
  account: IAccountModel;
  cache: ICacheRepositoryAdapter;
  session: ISessionModel;
};

const repositories: IRepositories = {
  search: new PrismaSearchModel(),
  result: new PrismaResultModel(),
  user: new PrismaUserModel(),
  account: new PrismaAccountModel(),
  cache: new RedisCacheRepository(),
  session: new PrismaSessionModel(),
};

export { repositories };

export type { IRepositories };
