import { Session } from "@prisma/client";
import { IEntityCacheRepository, IEntityDatabaseRepository } from "../base/entity";

type ISessionEntity = Session;

type ISessionExtraRepositories = {
  readBySessionToken: (token: string) => Promise<ISessionEntity | null>;
};

type ISessionModel = IEntityDatabaseRepository<
  ISessionEntity,
  ISessionExtraRepositories
>;

type IReadSessionBySessionTokenDTO = {
  sessionToken: string;
  repositories: {
    database: ISessionModel;
    cache: IEntityCacheRepository
  };
};

export type { ISessionEntity, ISessionModel, IReadSessionBySessionTokenDTO };
