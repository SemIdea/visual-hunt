import { Session } from "@prisma/client";
import {
  IEntityCacheRepository,
  IEntityDatabaseRepository,
} from "../base/entity";
import { IUserModel, IUserWithSubscription } from "../user/DTO";

type ISessionEntity = Session;

type ISessionExtraRepositories = {
  readBySessionToken: (token: string) => Promise<ISessionEntity | null>;
  readWithUserAndSubscriptionBySessionToken: (
    token: string
  ) => Promise<AppSessionData | null>;
};

type AppSessionData = ISessionEntity & {
  user: IUserWithSubscription;
};

type ISessionModel = IEntityDatabaseRepository<
  ISessionEntity,
  ISessionExtraRepositories
>;

type IReadSessionBySessionTokenDTO = {
  sessionToken: string;
  repositories: {
    database: ISessionModel;
    user: IUserModel;
    cache: IEntityCacheRepository;
  };
};

type IReadSessionWithUserAndSubscriptionBySessionTokenDTO = {
  sessionToken: string;
  repositories: {
    database: ISessionModel;
    cache: IEntityCacheRepository;
  };
};

export type {
  ISessionEntity,
  ISessionModel,
  IReadSessionBySessionTokenDTO,
  AppSessionData,
  IReadSessionWithUserAndSubscriptionBySessionTokenDTO,
};
