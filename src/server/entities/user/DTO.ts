import type { User } from "@prisma/client";
import { IEntityDatabaseRepository } from "../base/entity";

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
  };
};

export type { IUserEntity, IUserModel, IReadUserByEmailDTO };
