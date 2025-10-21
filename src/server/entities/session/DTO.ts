import { Session } from "@prisma/client";
import { IEntityCacheRepository, IEntityDatabaseRepository } from "../base/entity";
import { IUserEntity, IUserModel } from "../user/DTO";

type ISessionEntity = Session;

type ISessionExtraRepositories = {
  readBySessionToken: (token: string) => Promise<ISessionEntity | null>;
};

type AppSessionData = {
  session: ISessionEntity;
  user: IUserEntity;
  // subscription: ISubscriptionEntity | null; // Or whatever your type is
};

type ISessionModel = IEntityDatabaseRepository<
  ISessionEntity,
  ISessionExtraRepositories
>;

type IReadSessionBySessionTokenDTO = {
  sessionToken: string;
  repositories: {
    database: ISessionModel;
    user: IUserModel
    cache: IEntityCacheRepository
  };
};

export type { ISessionEntity, ISessionModel, IReadSessionBySessionTokenDTO, AppSessionData };
