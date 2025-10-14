import type { User } from "@prisma/client";
import {
  IEntityCacheRepository,
  IEntityDatabaseRepository,
} from "../base/entity";

type IUserEntity = User;

type IUserExtraRepositories = {
  readByEmail: (email: string) => Promise<IUserEntity | null>;
};

type IUserModel = IEntityDatabaseRepository<
  IUserEntity,
  IUserExtraRepositories
>;

type IReadUserByEmailDTO = {
  email: string;
  repositories: {
    database: IUserModel;
    cache: IEntityCacheRepository;
  };
};

export type { IUserEntity, IUserModel, IReadUserByEmailDTO };
